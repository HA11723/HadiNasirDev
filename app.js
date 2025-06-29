const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Message = require('./models/Message');

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// ✅ Routes
app.get(['/', '/index'], (req, res) => res.render('index'));
app.get('/about', (req, res) => res.render('about'));
app.get('/projects', (req, res) => res.render('projects'));
app.get('/contact', (req, res) => res.render('contact'));

// ✅ Handle contact form POST
app.post('/contact', async (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;
    const errors = [];

    if (!firstName || firstName.trim().length < 2) {
        errors.push({ field: 'First Name', message: 'Please enter a valid first name.' });
    }

    if (!lastName || lastName.trim().length < 2) {
        errors.push({ field: 'Last Name', message: 'Please enter a valid last name.' });
    }

    if (!email || !email.includes('@')) {
        errors.push({ field: 'Email', message: 'Please enter a valid email address.' });
    }

    if (!subject || subject.trim().length < 2) {
        errors.push({ field: 'Subject', message: 'Subject is required.' });
    }

    if (!message || message.trim().length < 10) {
        errors.push({ field: 'Message', message: 'Message must be at least 10 characters.' });
    }

    if (errors.length > 0) {
        return res.status(400).render('error', { errors });
    }

    try {
        const newMessage = new Message({ firstName, lastName, email, subject, message });
        await newMessage.save();
        res.render('success', { name: firstName });
    } catch (err) {
        console.error("❌ Error saving message:", err);
        res.status(500).render('error', {
            errors: [{ field: 'Server', message: 'Something went wrong. Please try again later.' }]
        });
    }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
