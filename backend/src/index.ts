import express from 'express';
import cors from 'cors';
import calendarRoutes from './routes/calendar.routes';
import coursesRoutes from './routes/courses.routes';
import prioritizationRoutes from './routes/prioritization.routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/courses', coursesRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/prioritization', prioritizationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
