import { prisma } from '../db';

export const getPrioritizedTasks = async (userId: string) => {
  const tasks = await prisma.calendarItem.findMany({
    where: { 
      userId,
      itemType: { in: ['ASSIGNMENT', 'EXAM'] },
      startDate: { gte: new Date() } // only future/current tasks
    },
    include: { course: true }
  });

  const prioritizedTasks = tasks.map((task: any) => {
    // Priority Score = (Weight % × 10) + (Urgency Multiplier) + Class Importance (1-10)
    
    // Weight
    const weightScore = (task.weightPercentage || 0) * 10;
    
    // Course Importance
    const courseImportance = task.course?.importance || 5;

    // Urgency Multiplier
    let urgencyMultiplier = 0;
    const now = new Date();
    const dueDate = new Date(task.startDate);
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours <= 24) {
      urgencyMultiplier = 15;
    } else if (diffHours <= 72) { // 3 days
      urgencyMultiplier = 10;
    } else if (diffHours <= 168) { // 7 days
      urgencyMultiplier = 5;
    }

    const priorityScore = weightScore + urgencyMultiplier + courseImportance;

    return {
      ...task,
      priorityScore
    };
  });

  // Sort by highest priority score
  prioritizedTasks.sort((a: any, b: any) => b.priorityScore - a.priorityScore);

  return prioritizedTasks;
};
