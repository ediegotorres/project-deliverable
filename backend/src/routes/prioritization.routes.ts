import { Request, Response, Router } from 'express';
import { getPrioritizedTasks } from '../services/prioritizationService';

const router = Router();
const HARDCODED_USER_ID = "mock-user-id";

router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await getPrioritizedTasks(HARDCODED_USER_ID);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to prioritize tasks' });
  }
});

export default router;
