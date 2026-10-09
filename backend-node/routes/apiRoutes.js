const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Import our blueprint

// 1. GET Route: Fetch all students from the database
router.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

// 2. POST Route: Add a new student to the database
router.post('/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ error: "Failed to add student", details: err });
    }
});

// 3. PUT Route: Update a student (for Teachers to add marks/attendance)
router.put('/students/:enrollmentId', async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const updatedStudent = await Student.findOneAndUpdate(
            { enrollmentId },
            { $set: req.body },
            { new: true }
        );
        if (!updatedStudent) return res.status(404).json({ error: "Student not found" });
        res.json(updatedStudent);
    } catch (err) {
        res.status(500).json({ error: "Failed to update student", details: err });
    }
});

// --- Teacher Routes ---
const Teacher = require('../models/Teacher');

router.get('/teachers', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch teachers" });
    }
});

router.post('/teachers', async (req, res) => {
    try {
        const newTeacher = new Teacher(req.body);
        const savedTeacher = await newTeacher.save();
        res.status(201).json(savedTeacher);
    } catch (err) {
        res.status(400).json({ error: "Failed to add teacher", details: err });
    }
});

module.exports = router;