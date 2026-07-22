const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Submit career application (Public)
router.post('/apply', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      location,
      college,
      degree,
      graduationYear,
      position,
      resumeData,
      resumeName,
      portfolioUrl,
      coverLetter
    } = req.body;

    if (!fullName || !email || !phone || !location || !college || !degree || !graduationYear || !position) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const application = await prisma.careerApplication.create({
      data: {
        fullName,
        email,
        phone,
        location,
        college,
        degree,
        graduationYear,
        position,
        resumeData: resumeData || null,
        resumeName: resumeName || null,
        portfolioUrl: portfolioUrl || null,
        coverLetter: coverLetter || null,
      }
    });

    res.status(201).json({ message: 'Application submitted successfully!', application });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Failed to submit application. Please try again.' });
  }
});

// Get all applications (Admin)
router.get('/applications', async (req, res) => {
  try {
    const applications = await prisma.careerApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications.' });
  }
});

// Update status (Admin)
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.careerApplication.update({
      where: { id },
      data: { status }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Failed to update application status.' });
  }
});

// Delete application (Admin)
router.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.careerApplication.delete({
      where: { id }
    });
    res.json({ message: 'Application deleted successfully.' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Failed to delete application.' });
  }
});

module.exports = router;
