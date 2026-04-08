"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrioritizedTasks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getPrioritizedTasks = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield prisma.calendarItem.findMany({
        where: {
            userId,
            itemType: { in: ['ASSIGNMENT', 'EXAM'] },
            startDate: { gte: new Date() } // only future/current tasks
        },
        include: { course: true }
    });
    const prioritizedTasks = tasks.map((task) => {
        // Priority Score = (Weight % × 10) + (Urgency Multiplier) + Class Importance (1-10)
        var _a;
        // Weight
        const weightScore = (task.weightPercentage || 0) * 10;
        // Course Importance
        const courseImportance = ((_a = task.course) === null || _a === void 0 ? void 0 : _a.importance) || 5;
        // Urgency Multiplier
        let urgencyMultiplier = 0;
        const now = new Date();
        const dueDate = new Date(task.startDate);
        const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (diffHours <= 24) {
            urgencyMultiplier = 15;
        }
        else if (diffHours <= 72) { // 3 days
            urgencyMultiplier = 10;
        }
        else if (diffHours <= 168) { // 7 days
            urgencyMultiplier = 5;
        }
        const priorityScore = weightScore + urgencyMultiplier + courseImportance;
        return Object.assign(Object.assign({}, task), { priorityScore });
    });
    // Sort by highest priority score
    prioritizedTasks.sort((a, b) => b.priorityScore - a.priorityScore);
    return prioritizedTasks;
});
exports.getPrioritizedTasks = getPrioritizedTasks;
