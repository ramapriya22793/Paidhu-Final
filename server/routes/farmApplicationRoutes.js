const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = require('../prismaClient');
const { uploadToR2, getR2PublicUrl, isR2Configured } = require('../utils/r2Client');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/farm_applications');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage for local storage with fallback
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1E6)}`;
    cb(null, `${uniqueSuffix}_${cleanBase}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max per file (supports video)
  }
});

// Configure upload fields
const appUploadFields = upload.fields([
  { name: 'soilTestReport', maxCount: 1 },
  { name: 'landRegistrationDoc', maxCount: 1 },
  { name: 'landLayout', maxCount: 1 },
  { name: 'waterSourceDetails', maxCount: 1 },
  { name: 'photos', maxCount: 10 },
  { name: 'videography', maxCount: 1 }
]);

// Helper to get accessible file URL
const processUploadedFile = async (file, req) => {
  if (!file) return null;
  const localRelativeUrl = `/uploads/farm_applications/${file.filename}`;
  
  // Also push to R2 if configured
  if (isR2Configured()) {
    try {
      const fileBuffer = fs.readFileSync(file.path);
      const r2FileName = `farm_applications/${file.filename}`;
      await uploadToR2(fileBuffer, r2FileName, file.mimetype);
      const r2Url = getR2PublicUrl(r2FileName, req);
      return {
        url: r2Url || localRelativeUrl,
        name: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype
      };
    } catch (r2Err) {
      console.warn('R2 upload failed, using local disk path:', r2Err.message);
    }
  }

  return {
    url: localRelativeUrl,
    name: file.originalname,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype
  };
};

/**
 * POST /api/farm-applications
 * Submit a new Just B Happy Farm Application
 */
router.post('/', appUploadFields, async (req, res) => {
  try {
    const {
      name,
      aadharNumber,
      email,
      phone,
      permanentAddress,
      landType,
      totalCultivationArea,
      flowerCultivationArea,
      previousCrops,
      notes
    } = req.body;

    if (!name || !aadharNumber || !email || !phone || !permanentAddress || !landType || !totalCultivationArea || !flowerCultivationArea) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Aadhar, Email, Phone, Permanent Address, Land Type, Total Area, and Proposed Flower Area).'
      });
    }

    const files = req.files || {};

    // Process single document uploads
    const soilFile = files.soilTestReport && files.soilTestReport[0]
      ? await processUploadedFile(files.soilTestReport[0], req)
      : null;

    const landDocFile = files.landRegistrationDoc && files.landRegistrationDoc[0]
      ? await processUploadedFile(files.landRegistrationDoc[0], req)
      : null;

    const layoutFile = files.landLayout && files.landLayout[0]
      ? await processUploadedFile(files.landLayout[0], req)
      : null;

    const waterFile = files.waterSourceDetails && files.waterSourceDetails[0]
      ? await processUploadedFile(files.waterSourceDetails[0], req)
      : null;

    const videoFile = files.videography && files.videography[0]
      ? await processUploadedFile(files.videography[0], req)
      : null;

    // Process multiple photos
    const photosList = [];
    if (files.photos && files.photos.length > 0) {
      for (const pFile of files.photos) {
        const processed = await processUploadedFile(pFile, req);
        if (processed) photosList.push(processed);
      }
    }

    // Also support JSON base64 / text values if submitted via json
    const soilTestReport = soilFile ? soilFile.url : (req.body.soilTestReport || null);
    const soilTestReportName = soilFile ? soilFile.name : (req.body.soilTestReportName || null);

    const landRegistrationDoc = landDocFile ? landDocFile.url : (req.body.landRegistrationDoc || null);
    const landRegistrationDocName = landDocFile ? landDocFile.name : (req.body.landRegistrationDocName || null);

    const landLayout = layoutFile ? layoutFile.url : (req.body.landLayout || null);
    const landLayoutName = layoutFile ? layoutFile.name : (req.body.landLayoutName || null);

    const waterSourceDetails = waterFile ? waterFile.url : (req.body.waterSourceDetails || null);
    const waterSourceDetailsName = waterFile ? waterFile.name : (req.body.waterSourceDetailsName || null);

    const videography = videoFile ? videoFile.url : (req.body.videography || null);
    const videographyName = videoFile ? videoFile.name : (req.body.videographyName || null);

    let finalPhotos = photosList;
    if (finalPhotos.length === 0 && req.body.photos) {
      try {
        finalPhotos = typeof req.body.photos === 'string' ? JSON.parse(req.body.photos) : req.body.photos;
      } catch (e) {
        finalPhotos = [];
      }
    }

    const application = await prisma.farmApplication.create({
      data: {
        name: name.trim(),
        aadharNumber: aadharNumber.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        permanentAddress: permanentAddress.trim(),
        landType: landType.trim(),
        totalCultivationArea: totalCultivationArea.trim(),
        flowerCultivationArea: flowerCultivationArea.trim(),
        previousCrops: previousCrops ? previousCrops.trim() : null,
        soilTestReport,
        soilTestReportName,
        landRegistrationDoc,
        landRegistrationDocName,
        landLayout,
        landLayoutName,
        waterSourceDetails,
        waterSourceDetailsName,
        photos: finalPhotos,
        videography,
        videographyName,
        notes: notes || null,
        status: 'Pending'
      }
    });

    console.log(`[Just B Happy] New Farm Application created: ${application.id} for ${application.name}`);

    return res.status(201).json({
      success: true,
      message: 'Your Just B Happy Farm Application has been submitted successfully!',
      applicationId: application.id,
      application
    });
  } catch (error) {
    console.error('Error submitting Farm Application:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again or contact support.'
    });
  }
});

/**
 * GET /api/farm-applications
 * List all farm applications (Admin)
 */
router.get('/', async (req, res) => {
  try {
    const { search, status, landType } = req.query;

    const where = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (landType && landType !== 'ALL') {
      where.landType = landType;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { aadharNumber: { contains: search, mode: 'insensitive' } },
        { permanentAddress: { contains: search, mode: 'insensitive' } }
      ];
    }

    const applications = await prisma.farmApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Error fetching Farm Applications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch farm applications.'
    });
  }
});

/**
 * GET /api/farm-applications/:id
 * Get single application details
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await prisma.farmApplication.findUnique({
      where: { id }
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    return res.json({ success: true, application });
  } catch (error) {
    console.error('Error fetching application detail:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve application.' });
  }
});

/**
 * PATCH /api/farm-applications/:id/status
 * Update status or admin notes (Admin)
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const dataToUpdate = {};
    if (status) dataToUpdate.status = status;
    if (notes !== undefined) dataToUpdate.notes = notes;

    const updated = await prisma.farmApplication.update({
      where: { id },
      data: dataToUpdate
    });

    return res.json({
      success: true,
      message: 'Status updated successfully',
      application: updated
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update application status.' });
  }
});

/**
 * DELETE /api/farm-applications/:id
 * Delete application (Admin)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.farmApplication.delete({
      where: { id }
    });

    return res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete application.' });
  }
});

module.exports = router;
