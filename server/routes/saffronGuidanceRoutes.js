const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// POST /api/saffron-guidance — Submit form
router.post('/', async (req, res) => {
  try {
    const { yourName, spouseName, phone, purpose, pregnancyMonth, doctorPermission } = req.body;

    if (!yourName || !phone || !purpose) {
      return res.status(400).json({ error: 'Name, phone, and purpose are required.' });
    }

    if (purpose === 'Pregnancy Support' && (!pregnancyMonth || !doctorPermission)) {
      return res.status(400).json({ error: 'Pregnancy month and doctor permission are required for pregnancy support.' });
    }

    const entry = await prisma.saffronGuidance.create({
      data: {
        yourName,
        spouseName: spouseName || 'N/A',
        phone,
        purpose,
        pregnancyMonth: pregnancyMonth ? parseInt(pregnancyMonth) : 0,
        doctorPermission: doctorPermission || 'N/A',
      },
    });

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    console.error('Saffron Guidance submit error:', error);
    res.status(500).json({ error: 'Failed to submit form. Please try again.' });
  }
});

// GET /api/saffron-guidance — Admin: list all submissions
router.get('/', async (req, res) => {
  try {
    const entries = await prisma.saffronGuidance.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(entries);
  } catch (error) {
    console.error('Saffron Guidance fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch entries.' });
  }
});

// PATCH /api/saffron-guidance/:id/status — Admin: update status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.saffronGuidance.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (error) {
    console.error('Saffron Guidance status update error:', error);
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

// DELETE /api/saffron-guidance/:id — Admin: delete entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.saffronGuidance.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Saffron Guidance delete error:', error);
    res.status(500).json({ error: 'Failed to delete entry.' });
  }
});

module.exports = router;
