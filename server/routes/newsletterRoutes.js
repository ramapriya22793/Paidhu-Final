const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const authMiddleware = require('../middleware/authMiddleware'); // Admin auth

// PUBLIC: Subscribe to newsletter
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });
    if (existing) {
      return res.status(200).json({ message: 'You are already subscribed!' });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email }
    });

    res.status(201).json({ message: 'Subscribed successfully!', subscriber });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe.' });
  }
});

// ADMIN: Get all subscribers
router.get('/', authMiddleware, async (req, res) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers.' });
  }
});

// ADMIN: Delete a subscriber
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.newsletterSubscriber.delete({
      where: { id }
    });
    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ error: 'Failed to delete subscriber.' });
  }
});

module.exports = router;
