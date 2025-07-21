// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import nodemailer from 'nodemailer';

// dotenv.config();

// const app = express();

// // const allowedOrigins = [
// //   'http://localhost:5173',
// //   'https://kirushnarmohanapriyan-cy6pwg79j-akm-mohanapriyans-projects.vercel.app',
// //   'https://kirushnarmohanapriyan.vercel.app' // Add your production domain
// // ];

// // Enhanced Middleware Configuration
// // app.use(cors({
// //   origin: function (origin, callback) {
// //     // Allow requests with no origin (like mobile apps or curl requests)
// //     if (!origin) return callback(null, true);
    
// //     if (allowedOrigins.indexOf(origin) === -1) {
// //       const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
// //       return callback(new Error(msg), false);
// //     }
// //     return callback(null, true);
// //   },
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization']
// // }));

// // app.use(cors({
// //   origin: function (origin, callback) {
// //     if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error('Not allowed by CORS'));
// //     }
// //   },
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization']
// // }));




// const allowedOrigins = [
//   'http://localhost:5173', // Local development
//   'https://kirushnarmohanapriyan.vercel.app', // Production frontend
//   /^https:\/\/kirushnarmohanapriyan-.*-akm-mohanapriyans-projects\.vercel\.app$/, // Preview deployments
//   /^https:\/\/kirushnarmohanapriyan-[a-z0-9]+\.vercel\.app$/ // Direct deployments
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     // Check against allowed origins
//     const isAllowed = allowedOrigins.some(allowed => {
//       if (typeof allowed === 'string') {
//         return origin === allowed;
//       } else if (allowed instanceof RegExp) {
//         return allowed.test(origin);
//       }
//       return false;
//     });

//     if (isAllowed) {
//       return callback(null, true);
//     } else {
//       const msg = `The CORS policy for this site does not allow access from ${origin}`;
//       return callback(new Error(msg), false);
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//   exposedHeaders: ['Content-Range', 'X-Content-Range']
// }));

// // Handle preflight requests
// app.options('*', cors());



// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // MongoDB Connection
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log('MongoDB connected successfully');
//     } catch (error) {
//         console.error('MongoDB connection error:', error.message);
//         process.exit(1);
//     }
// };

// connectDB();

// // Contact Message Schema
// const contactSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     subject: { type: String },
//     message: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now }
// });

// const Contact = mongoose.model('Contact', contactSchema);

// // Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // Enhanced Contact Form Endpoint with CORS headers
// app.post('/api/contact', async (req, res) => {
//     try {
//         const { name, email, subject, message } = req.body;

//         // Validate input
//         if (!name || !email || !message) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Please fill in all required fields'
//             });
//         }

//         // Save to database
//         const newContact = new Contact({ name, email, subject, message });
//         await newContact.save();

//         // Email options for admin notification
//         const adminMailOptions = {
//             from: process.env.EMAIL_USER,
//             to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Fallback to sender if ADMIN_EMAIL not set
//             subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
//             text: `
//         You have a new contact form submission:
        
//         Name: ${name}
//         Email: ${email}
//         Subject: ${subject || 'Not specified'}
//         Message: ${message}
        
//         Received at: ${new Date().toLocaleString()}
//       `,
//             html: `
//         <h2>New Contact Form Submission</h2>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Subject:</strong> ${subject || 'Not specified'}</p>
//         <p><strong>Message:</strong></p>
//         <p>${message.replace(/\n/g, '<br>')}</p>
//         <p><em>Received at: ${new Date().toLocaleString()}</em></p>
//       `
//         };

//         // Email options for user confirmation
//         const userMailOptions = {
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: 'Thank you for contacting us',
//             text: `Dear ${name},\n\nThank you for your message. We have received your inquiry and will get back to you shortly.\n\nBest regards,\n${process.env.COMPANY_NAME || 'Our Team'}`,
//             html: `
//         <h2>Thank you for contacting us</h2>
//         <p>Dear ${name},</p>
//         <p>Thank you for your message. We have received your inquiry and will get back to you shortly.</p>
//         <p>Best regards,<br>${process.env.COMPANY_NAME || 'Our Team'}</p>
//       `
//         };

//         // Send both emails
//         await transporter.sendMail(adminMailOptions);
//         await transporter.sendMail(userMailOptions);

//         res.status(200).json({
//             success: true,
//             message: 'Message sent successfully!'
//         });

//     } catch (error) {
//         console.error('Error processing contact form:', error);

//         // Differentiate between validation errors and server errors
//         if (error.name === 'ValidationError') {
//             return res.status(400).json({
//                 success: false,
//                 message: error.message
//             });
//         }

//         res.status(500).json({
//             success: false,
//             message: 'Server error. Please try again later.'
//         });
//     }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });




import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

// Configure CORS with all possible Vercel origins
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://kirushnarmohanapriyan.vercel.app', // Production domain
  /^https:\/\/kirushnarmohanapriyan-(\w+)?(?:-akm-mohanapriyans-projects)?\.vercel\.app$/, // All Vercel deployment patterns
  /^https:\/\/kirushnarmohanapriyan-[a-z0-9]+\.vercel\.app$/ // Direct deployments
];

// Enhanced CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow requests with no origin
    
    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') return origin === pattern;
      if (pattern instanceof RegExp) return pattern.test(origin);
      return false;
    });

    isAllowed 
      ? callback(null, true)
      : callback(new Error(`CORS blocked: ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Request-ID']
}));

// Explicit preflight handler for all routes
app.options('*', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin'
  }).status(204).end();
});

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Database connection with enhanced error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Contact schema with validation
const contactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  subject: { 
    type: String, 
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: { 
    type: String, 
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message should be at least 10 characters'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
});

const Contact = mongoose.model('Contact', contactSchema);

// Email transporter with connection pooling
const transporter = nodemailer.createTransport({
  service: 'gmail',
  pool: true,
  maxConnections: 1,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Enhanced contact endpoint with rate limiting
app.post('/api/contact', async (req, res) => {
  try {
    // Set CORS headers dynamically
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Vary', 'Origin');

    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Save to database
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    // Email templates
    const adminMailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact: ${subject || 'No Subject'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td></tr>
            ${subject ? `<tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Subject:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${subject}</td></tr>` : ''}
            <tr><td style="padding: 8px; vertical-align: top;"><strong>Message:</strong></td><td style="padding: 8px;">${message.replace(/\n/g, '<br>')}</td></tr>
          </table>
          <p style="margin-top: 20px; color: #666; font-size: 0.9em;">
            Received at: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    };

    const userMailOptions = {
      from: `"${process.env.COMPANY_NAME || 'Portfolio'} Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting us',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Thank you for your message, ${name}!</h2>
          <p style="line-height: 1.6;">
            We've received your inquiry and will get back to you as soon as possible.
          </p>
          ${subject ? `<p style="line-height: 1.6;"><strong>Subject:</strong> ${subject}</p>` : ''}
          <p style="line-height: 1.6; margin-top: 20px;">
            <strong>For your records, here's what you sent:</strong><br>
            ${message.replace(/\n/g, '<br>')}
          </p>
          <p style="margin-top: 30px; color: #666; font-size: 0.9em;">
            Best regards,<br>
            ${process.env.COMPANY_NAME || 'The Team'}
          </p>
        </div>
      `
    };

    // Send emails in parallel
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Contact form error:', error);

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

// Start server with graceful shutdown
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB().then(() => console.log('🔄 Connecting to MongoDB...'));
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('🔴 Server and MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('🔴 Server and MongoDB connection closed');
      process.exit(0);
    });
  });
});