const mongoose = require('mongoose');

// This is the blueprint for how a Student will look in our database
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    enrollmentId: { type: String, required: true, unique: true },
    course: { type: String, required: true },
    grade: { type: String, default: "Not Assigned" },
    attendance: { type: Number, default: 0 },
    subjects: [{
        name: { type: String },
        semester: { type: Number },
        marksPercentage: { type: Number }
    }],
    timetable: [{
        day: { type: String },
        time: { type: String },
        subject: { type: String },
        room: { type: String }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);