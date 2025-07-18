const User = require('./models/User');
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

const app = express();
app.use(cors());
app.use(express.json());

const authCodes = {};

app.post('/send-code', async (req, res) => {
    const { method, destination } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    authCodes[destination] = code;

    try {
        if (method === 'email') {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: destination,
                subject: 'Your Reps & Repeat Login Code',
                text: `Your login code is: ${code}`,
            };

            await transporter.sendMail(mailOptions);
            res.json({ success: true });

        } else if (method === 'sms') {
            const message = await twilioClient.messages.create({
                body: `Your Reps & Repeat login code is: ${code}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: destination
            });

            console.log(`SMS sent to ${destination}`, message.sid);
            res.json({ success: true });

        } else {
            res.status(400).json({ error: 'Invalid method' });
        }
    } catch (err) {
        console.error(`${method.toUpperCase()} error:`, err);
        res.status(500).json({ error: `Failed to send ${method}` });
    }
});

app.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    if (authCodes[email] === code) {
        delete authCodes[email];

        try {
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                await User.create({ email });
                console.log(`New user saved: ${email}`);
            } else {
                console.log(`Returning user: ${email}`);
            }
        } catch (err) {
            console.error('MongoDB save error:', err);
        }

        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid code' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server start error:', err.stack);
});
