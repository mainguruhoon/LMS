require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const newUser = new User({ username: 'test_teacher_3', password: '123', role: 'teacher' });
        await newUser.save();
        console.log("SUCCESS");
    } catch (e) {
        console.error("ERROR:", e.message);
    } finally {
        process.exit(0);
    }
}
test();
