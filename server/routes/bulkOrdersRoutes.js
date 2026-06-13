const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/authMiddleware'); // Admin auth

// PUBLIC: Submit a new bulk order inquiry
router.post('/', async (req, res) => {
  try {
    const { fullName, email, mobile, region, country, purpose } = req.body;
    
    // Basic validation
    if (!fullName || !email || !mobile || !region || !country || !purpose) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const inquiry = await prisma.bulkOrderInquiry.create({
      data: {
        fullName,
        email,
        mobile,
        region,
        country,
        purpose
      }
    });

    res.status(201).json({ message: 'Bulk order inquiry submitted successfully!', inquiry });
  } catch (error) {
    console.error('Error submitting bulk order inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry.' });
  }
});

// ADMIN: Get all bulk order inquiries
router.get('/', authMiddleware, async (req, res) => {
  try {
    const inquiries = await prisma.bulkOrderInquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching bulk order inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries.' });
  }
});

// ADMIN: Update inquiry status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedInquiry = await prisma.bulkOrderInquiry.update({
      where: { id },
      data: { status }
    });

    res.json(updatedInquiry);
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

// ADMIN: Delete an inquiry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.bulkOrderInquiry.delete({
      where: { id }
    });
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ error: 'Failed to delete inquiry.' });
  }
});

module.exports = router;
