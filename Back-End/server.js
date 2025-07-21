import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

// Enhanced CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://kirushnarmohanapriyan.vercel.app',
  'https://kirushnarmohanapriyan-*.vercel.app',
  'https://kirushnarmohanapriyan-git-*.vercel.app',
  'https://687d4a6e55631cb42edcd062--kirushnarmohanapriyan.netlify.app',
  'https://kirushnarmohanapriyan.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const regex = new RegExp(`^${allowed.replace(/\*/g, '.*')}$`);
        return regex.test(origin);
      }
      return origin === allowed;
    })) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

await connectDB();

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// API Endpoint with Enhanced Logging
app.post('/api/contact', async (req, res) => {
  try {
    console.log('Incoming request:', req.method, req.url);
    console.log('Request body:', req.body);

    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      console.warn('Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Save to database
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    console.log('Contact saved to DB');

    // Email templates
    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact: ${subject || 'No Subject'}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Message:</strong> ${message}</p>`
    };

const userMail = {
  from: `"Kirushnar Mohanapriyan" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: 'Thank You for Contacting Me - Message Received',
  text: `
Dear ${name},

Thank you for reaching out through my contact form. I wanted to personally acknowledge that I've received your message:

Subject: ${subject || 'No subject provided'}
Message: ${message}

I typically respond to inquiries within 24-48 hours. If your matter requires urgent attention, please don't hesitate to contact me directly at +94 761 989 195.

In the meantime, you might find these resources helpful:
- My portfolio: https://kirushnarmohanapriyan.vercel.app
- My GitHub: https://github.com/AkmMohanapriyan
- LinkedIn: https://www.linkedin.com/in/kirushnar-mohanapriyan-120a38357/

Warm regards,
Kirushnar Mohanapriyan
Full Stack Developer | UI/UX Designer
Phone: +94 761 989 195
Email: mohanapriyanpriyan4@gmail.com
  `,
  html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2d3748;">Dear ${name},</h2>
  
  <p>Thank you for reaching out through my contact form. I wanted to personally acknowledge that I've received your message:</p>
  
  <div style="background: #f7fafc; padding: 16px; border-left: 4px solid #4299e1; margin: 16px 0;">
    <p style="margin: 0;"><strong>Subject:</strong> ${subject || 'No subject provided'}</p>
    <p style="margin: 8px 0 0 0;"><strong>Message:</strong></p>
    <p style="white-space: pre-wrap; margin: 8px 0 0 0;">${message}</p>
  </div>

  <p>I typically respond to inquiries within <strong>24-48 hours</strong>. If your matter requires urgent attention, please don't hesitate to contact me directly at <a href="tel:+94761989195">+94 761 989 195</a>.</p>

  <p>In the meantime, you might find these resources helpful:</p>
  <ul>
    <li><a href="https://kirushnarmohanapriyan.vercel.app" style="color: #4299e1; text-decoration: none;">My Portfolio</a></li>
    <li><a href="https://github.com/AkmMohanapriyan" style="color: #4299e1; text-decoration: none;">My GitHub Profile</a></li>
    <li><a href="https://www.linkedin.com/in/kirushnar-mohanapriyan-120a38357/" style="color: #4299e1; text-decoration: none;">My LinkedIn Profile</a></li>
  </ul>

  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
    <p>Warm regards,</p>
    <p style="font-weight: bold; margin: 8px 0;">Kirushnar Mohanapriyan</p>
    <p style="margin: 4px 0; color: #4a5568;">Full Stack Developer | UI/UX Designer</p>
    <p style="margin: 4px 0;"><a href="tel:+94761989195" style="color: #4299e1; text-decoration: none;">+94 761 989 195</a></p>
    <p style="margin: 4px 0;"><a href="mailto:mohanapriyanpriyan4@gmail.com" style="color: #4299e1; text-decoration: none;">mohanapriyanpriyan4@gmail.com</a></p>
  </div>
</div>
  `
};

    // Send emails
    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);
    console.log('Emails sent successfully');

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Endpoint error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;