"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const calendar_routes_1 = __importDefault(require("./routes/calendar.routes"));
const courses_routes_1 = __importDefault(require("./routes/courses.routes"));
const prioritization_routes_1 = __importDefault(require("./routes/prioritization.routes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/courses', courses_routes_1.default);
app.use('/api/calendar', calendar_routes_1.default);
app.use('/api/prioritization', prioritization_routes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
