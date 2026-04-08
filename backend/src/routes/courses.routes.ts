// Router for handling course endpoints
import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// Hardcoded userId for MVP purposes
const HARDCODED_USER_ID = "mock-user-id";

router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { userId: HARDCODED_USER_ID }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, color, importance } = req.body;

    // Ensure the hardcoded user exists for simplicity
    await prisma.user.upsert({
      where: { id: HARDCODED_USER_ID },
      update: {},
      create: {
        id: HARDCODED_USER_ID,
        email: "student@gmu.edu",
        passwordHash: "mockHash"
      }
    });

    const course = await prisma.course.create({
      data: {
        name,
        color,
        importance,
        userId: HARDCODED_USER_ID
      }
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

export default router;
