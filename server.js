require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const authCodes = {}; // Store email: code temporarily

app.post('/send-code', async (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    authCodes[email] = code;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Reps & Repeat Login Code',
        text: `Your login code is: ${code}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (err) {
        console.error('Email error:', err);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.post('/verify-code', (req, res) => {
    const { email, code } = req.body;
    if (authCodes[email] === code) {
        delete authCodes[email];
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid code' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});