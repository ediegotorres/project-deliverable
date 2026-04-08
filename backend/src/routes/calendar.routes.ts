import { Router } from 'express';
import { 
  getCalendarItems, 
  createCalendarItem, 
  updateCalendarItem, 
  deleteCalendarItem 
} from '../controllers/calendarController';

const router = Router();

router.get('/', getCalendarItems);
router.post('/', createCalendarItem);
router.put('/:id', updateCalendarItem);
router.delete('/:id', deleteCalendarItem);

export default router;
