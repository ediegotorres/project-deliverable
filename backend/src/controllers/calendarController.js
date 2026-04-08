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
exports.deleteCalendarItem = exports.updateCalendarItem = exports.createCalendarItem = exports.getCalendarItems = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const HARDCODED_USER_ID = "mock-user-id";
const getCalendarItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield prisma.calendarItem.findMany({
            where: { userId: HARDCODED_USER_ID },
            include: { course: true }
        });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch calendar items' });
    }
});
exports.getCalendarItems = getCalendarItems;
const createCalendarItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, itemType, startDate, endDate, location, notes, courseId, weightPercentage } = req.body;
        // Ensure the hardcoded user exists for simplicity
        yield prisma.user.upsert({
            where: { id: HARDCODED_USER_ID },
            update: {},
            create: {
                id: HARDCODED_USER_ID,
                email: "student@gmu.edu",
                passwordHash: "mockHash"
            }
        });
        const item = yield prisma.calendarItem.create({
            data: {
                title,
                itemType,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                location,
                notes,
                courseId,
                weightPercentage,
                userId: HARDCODED_USER_ID
            }
        });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create calendar item' });
    }
});
exports.createCalendarItem = createCalendarItem;
const updateCalendarItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { title, itemType, startDate, endDate, location, notes, courseId, weightPercentage } = req.body;
        const item = yield prisma.calendarItem.update({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update calendar item' });
    }
});
exports.updateCalendarItem = updateCalendarItem;
const deleteCalendarItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield prisma.calendarItem.delete({
            where: { id }
        });
        res.json({ message: 'Calendar item deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete calendar item' });
    }
});
exports.deleteCalendarItem = deleteCalendarItem;
