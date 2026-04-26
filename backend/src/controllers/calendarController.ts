import { Request, Response } from 'express';
import { prisma } from '../db';
const HARDCODED_USER_ID = "mock-user-id";

export const getCalendarItems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.calendarItem.findMany({
      where: { userId: HARDCODED_USER_ID },
      include: { course: true }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calendar items' });
  }
};

export const createCalendarItem = async (req: Request, res: Response) => {
  try {
    const { title, itemType, startDate, endDate, location, notes, courseId, weightPercentage, priorityScore } = req.body;

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

    const item = await prisma.calendarItem.create({
      data: {
        title,
        itemType,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        notes,
        courseId,
        weightPercentage,
        priorityScore,
        userId: HARDCODED_USER_ID
      }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create calendar item' });
  }
};

export const updateCalendarItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, itemType, startDate, endDate, location, notes, courseId, weightPercentage } = req.body;
    
    const item = await prisma.calendarItem.update({
      where: { id },
      data: {
        title,
        itemType,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        location,
        notes,
        courseId,
        weightPercentage
      }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update calendar item' });
  }
};

export const deleteCalendarItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.calendarItem.delete({
      where: { id }
    });
    res.json({ message: 'Calendar item deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete calendar item' });
  }
};
