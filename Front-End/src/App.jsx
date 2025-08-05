import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Collapse } from 'bootstrap';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

import BG from "../src/assets/BG.jpg"
import Me from "../src/assets/Me.jpg"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Portfolio = () => {
  const [theme, setTheme] = useState('dark');
  const [professionIndex, setProfessionIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showThemeToggle, setShowThemeToggle] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const professions = [
    "Full Stack Web Developer",
    "UI/UX Designer",
    "Tamil Typing Expert",
    "Graphic Designer"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formSubmitUrl = 'https://formsubmit.co/ajax/mohanapriyanpriyan4@gmail.com';

      // Admin email - simple formatted text
      const adminEmailContent = `New Contact Form Submission
--------------------------
From: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject || 'No subject'}

Message:
${formData.message}

Received: ${new Date().toLocaleString()}`;

      // User confirmation - simple formatted text
      const userConfirmationContent = `Thank You for Your Message
--------------------------
Dear ${formData.name},

Thank you for contacting me. I've received your message and will respond soon.

Submitted: ${new Date().toLocaleString()}

Best regards,
Mohanapriyan`;

      const response = await fetch(formSubmitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New message from ${formData.name}`,
          _template: 'blank', // Use 'blank' template to avoid default formatting
          _replyto: formData.email,
          _autoresponse: userConfirmationContent,
          'custom-data': adminEmailContent, // Changed from 'form-data' to 'custom-data'
          _format: 'plain',
          _disableAutoResponse: false
        })
      });

      const result = await response.json();

      if (result.success === 'true') {
        toast.success(
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            padding: '12px',
            background: '#f0f9eb',
            color: '#2e7d32',
            borderRadius: '4px'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Message sent successfully</p>
            <p style={{ margin: 0, fontSize: '14px' }}>Confirmation sent to {formData.email}</p>
          </div>
        );
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Submission error:', error);

      const mailtoLink = `mailto:mohanapriyanpriyan4@gmail.com?subject=${encodeURIComponent(formData.subject || 'Contact Form Submission')
        }&body=${encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;

      toast.error(
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          padding: '12px',
          color: '#d32f2f',
          borderRadius: '4px'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Failed to send message</p>
          <p style={{ margin: 0, fontSize: '14px' }}>
            <a href={mailtoLink} style={{
              color: '#1976d2',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Send email directly instead
            </a>
          </p>
        </div>,
        { autoClose: 1000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Initialize Bootstrap Collapse for mobile menu
    const navbarCollapse = document.querySelector('.navbar-collapse');
    new Collapse(navbarCollapse, { toggle: false });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);

    // Scroll event listener
    const handleScroll = () => {
      // Back to top and theme toggle visibility
      const shouldShow = window.pageYOffset > 300;
      setShowBackToTop(shouldShow);
      setShowThemeToggle(shouldShow);

      // Navbar shadow
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.3)';
      } else {
        navbar.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.3)';
      }

      // Active nav link
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.nav-link');

      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });

      // Animate elements on scroll
      const animateElements = document.querySelectorAll('.animate-in');
      animateElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
          element.classList.add('show');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          const navbarCollapse = document.querySelector('.navbar-collapse');
          if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = Collapse.getInstance(navbarCollapse);
            bsCollapse.hide();
          }
        }
      });
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const currentProfession = professions[professionIndex];
    let typingTimeout;

    if (!isDeleting && charIndex < currentProfession.length) {
      typingText.textContent = currentProfession.substring(0, charIndex + 1);
      typingTimeout = setTimeout(() => setCharIndex(charIndex + 1), 150);
    } else if (!isDeleting && charIndex === currentProfession.length) {
      typingTimeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      typingText.textContent = currentProfession.substring(0, charIndex - 1);
      typingTimeout = setTimeout(() => setCharIndex(charIndex - 1), 100);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setProfessionIndex((professionIndex + 1) % professions.length);
    }

    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, professionIndex, professions]);

  const type = () => {
    const currentProfession = professions[professionIndex];

    if (isDeleting) {
      setCharIndex(prev => prev - 1);
    } else {
      setCharIndex(prev => prev + 1);
    }

    if (!isDeleting && charIndex === currentProfession.length - 1) {
      setIsEnd(true);
      setIsDeleting(true);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setProfessionIndex(prev => (prev + 1) % professions.length);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };




  // Education Popup 

  const [showModal, setShowModal] = useState(false);
  const [activeModule, setActiveModule] = useState(null);


  const [showWebDevModal, setShowWebDevModal] = useState(false);


  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setActiveModule(null);
    }
  };

  const toggleModule = (moduleIndex) => {
    setActiveModule(activeModule === moduleIndex ? null : moduleIndex);
  };

  const toggleWebDevModal = () => {
    setShowWebDevModal(!showWebDevModal);
    if (!showWebDevModal) {
      setActiveModule(null);
    }
  };

  const learningOutcomes = [
    "Develop responsive, accessible websites",
    "Connect frontend to Airtable databases",
    "Build no-code mobile apps with Thunkable",
    "Deploy projects for real-world use"
  ];

  const toolsCovered = [
    "Frontend: VS Code, Chrome DevTools",
    "Backend: Airtable (REST API)",
    "Mobile: Thunkable (Drag-and-drop app builder)",
    "Version Control: GitHub Basics"
  ];


  // web development modules
  const Modules = [
    {
      title: "1. Foundations of Web Development",
      sections: [
        {
          subTitle: "HTML5 Mastery",
          content: [
            "Document structure & semantic tags (<header>, <section>, <article>)",
            "Forms & input validation (<input types>, required, pattern)",
            "Multimedia embedding (<video>, <audio>, <iframe>)",
            "SEO best practices (meta tags, alt attributes, schema markup)"
          ]
        },
        {
          subTitle: "CSS3 & Responsive Design",
          content: [
            "Flexbox and Grid layouts",
            "CSS variables and custom properties",
            "Animations (@keyframes, transition)",
            "Media queries for mobile-first design",
            "Bootstrap 5 framework"
          ]
        }
      ]
    },
    {
      title: "2. Interactive Web with JavaScript",
      sections: [
        {
          subTitle: "Core JavaScript",
          content: [
            "Variables, loops, functions (ES6+ syntax)",
            "DOM manipulation (querySelector, event listeners)",
            "Async programming (Promises, async/await, Fetch API)"
          ]
        },
        {
          subTitle: "Advanced JS Concepts",
          content: [
            "LocalStorage & SessionStorage",
            "JSON parsing and manipulation",
            "API integration (RESTful services)",
            "Error handling (try/catch)"
          ]
        },
        {
          subTitle: "Mini-Projects",
          content: [
            "Todo List App",
            "Weather App with OpenWeather API",
            "Interactive Quiz Application"
          ]
        }
      ]
    },
    {
      title: "3. Backend Integration with Airtable",
      sections: [
        {
          subTitle: "Airtable as a Database",
          content: [
            "Creating bases and tables",
            "Field types (attachments, linked records)",
            "Views (Grid, Calendar, Kanban)"
          ]
        },
        {
          subTitle: "JavaScript Integration",
          content: [
            "Airtable API authentication",
            "CRUD operations (Create, Read, Update, Delete)",
            "Filtering and sorting records"
          ]
        },
        {
          subTitle: "Project",
          content: [
            "Build a customer management system with Airtable backend"
          ]
        }
      ]
    },
    {
      title: "4. Mobile App Development with Thunkable",
      sections: [
        {
          subTitle: "Thunkable Basics",
          content: [
            "UI components (Buttons, Lists, Inputs)",
            "Screen navigation and layouts"
          ]
        },
        {
          subTitle: "Logic & Functionality",
          content: [
            "Variables and data storage",
            "API integration (connecting to Airtable)",
            "Event-driven programming"
          ]
        },
        {
          subTitle: "Publishing Apps",
          content: [
            "Testing on iOS/Android",
            "Deploying to Google Play Store & Apple App Store"
          ]
        },
        {
          subTitle: "Project",
          content: [
            "Create a mobile app for your Airtable-powered web project"
          ]
        }
      ]
    },
    {
      title: "5. Capstone Project",
      sections: [
        {
          subTitle: "",
          content: [
            "Build a full-stack application combining:",
            "Frontend (HTML/CSS/JS)",
            "Backend (Airtable)",
            "Mobile companion (Thunkable)",
            "Example: Inventory Management System or Task Tracker"
          ]
        }
      ]
    }
  ];

  //  // ICT Technician Modules
  const modules = [
    {
      title: "1. Use the Computer and Manage Files",
      content: [
        "Hardware Fundamentals: Identify components (CPU, RAM, storage, peripherals).",
        "OS Navigation: Windows/Linux file systems, user profiles, and system settings.",
        "File Management: Organize directories, compress files, and use cloud storage.",
        "Security Basics: Password policies, antivirus setup, and data encryption."
      ]
    },
    {
      title: "2. Word Processing (MS Word/Google Docs)",
      content: [
        "Document Formatting: Styles, headers/footers, tables of contents.",
        "Advanced Features: Mail merge, macros, and collaborative editing.",
        "Professional Output: Design reports, resumes, and business letters."
      ]
    },
    {
      title: "3. Spreadsheets (MS Excel/Google Sheets)",
      content: [
        "Formulas & Functions: VLOOKUP, IF, SUMIF, pivot tables.",
        "Data Visualization: Charts (bar, pie, line), conditional formatting.",
        "Automation: Record macros for repetitive tasks."
      ]
    },
    {
      title: "4. Presentations (MS PowerPoint/Google Slides)",
      content: [
        "Slide Design: Master slides, animations, and transitions.",
        "Multimedia Integration: Embed videos, audio, and hyperlinks.",
        "Delivery Skills: Presenter view, audience engagement techniques."
      ]
    },
    {
      title: "5. Database Management (MS Access)",
      content: [
        "Relational Databases: Design tables, set primary/foreign keys.",
        "Queries & Reports: SQL basics, generate exportable reports.",
        "Forms: Create user-friendly data entry interfaces."
      ]
    },
    {
      title: "6. Internet & Email Operations",
      content: [
        "Web Tools: Browser settings, cookies, and cache management.",
        "Email Protocols: Configure SMTP/IMAP, manage attachments.",
        "Cybersecurity: Spot phishing, use VPNs, and secure browsing."
      ]
    },
    {
      title: "7. OS & Network Maintenance",
      content: [
        "Installation: Dual-boot setups, driver management.",
        "Troubleshooting: Blue screen errors, network connectivity (ping, ipconfig).",
        "User Management: Active Directory basics, group policies."
      ]
    },
    {
      title: "8. Graphic Design (Photoshop/Canva)",
      content: [
        "Digital Graphics: Resize, crop, and optimize images for web/print.",
        "Design Principles: Color theory, typography, and layout.",
        "Output Formats: JPEG, PNG, PDF, and vector files."
      ]
    },
    {
      title: "9. Information Systems Development",
      content: [
        "SDLC Basics: Requirements gathering, prototyping, testing.",
        "Documentation: Write technical manuals and user guides.",
        "Case Study: Design a mock inventory/student management system."
      ]
    }
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/"><span className='kiru'>KIRUSHNAR</span> MOHANAPRIYAN<span>.</span></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto">
              <Link ><a className="nav-link active" href="#home"> <i className="fas fa-home"></i> HOME</a></Link>
              <Link ><a className="nav-link" href="#about"> <i className="fas fa-user"></i> ABOUT</a></Link>
              <Link ><a className="nav-link" href="#skills"> <i className="fas fa-code"></i> SKILLS</a></Link>
              <Link ><a className="nav-link" href="#education"> <i className="fas fa-graduation-cap"></i> EDUCATION</a></Link>
              <Link ><a className="nav-link" href="#services"> <i className="fas fa-cogs"></i> SERVICES</a></Link>
              <Link ><a className="nav-link" href="#contact"> <i className="fas fa-mobile-alt"></i> CONTACT</a></Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="d-flex align-items-center">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="hero-title animate-in">Hi, I'm <span>Kirushnar Mohanapriyan</span></h1>
                <h2 className="hero-subtitle animate-in delay-1">I'm a <span className="typing-text animate-in delay-2"></span></h2>
                {/* <div className="typing-text animate-in delay-2"></div> */}
                <p className="animate-in delay-3">Full Stack Developer | Tamil Typing Expert | Graphic Designer (Photoshop & Canva) | UI/UX Designer – Building digital experiences that stand out!</p>
                <div className="hero-btns animate-in delay-4">
                  <Link className="btn btn-primary"><a className='text-white' href="#contact">Hire Me</a></Link>
                  <Link className="btn btn-view"><a className="btn-outline-light" href="#about" style={{ color: "#e0e0e0", textDecoration: "none" }}>About Me</a></Link>
                </div>
                <div className="social-icons animate-in delay-5">
                  <a href="https://github.com/AkmMohanapriyan"><i className="fab fa-github"></i></a>
                  <a href="https://www.linkedin.com/in/kirushnar-mohanapriyan-120a38357/"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="https://www.instagram.com/blacklover_akm?igsh=cHB0NXZ4eW9qOWYy"><i className="fab fa-instagram"></i></a>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image animate-in delay-5">
                <img src={Me} alt="Kirushnar Mohanapriyan" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container-fluid">
          <h2 className="section-title animate-in">Artist of the code <span></span></h2>
          <div className="row">
            <div className="col-lg-5">
              <div className="about-img animate-in">
                <img src={Me} alt="About Me" className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-7">
              <div className="about-content animate-in delay-1">
                <h3>The Mind Behind the Code</h3>

                <p style={{ textAlign: "justify" }}>Hi, I'm <strong>Kirushnar Mohanapriyan</strong>, a passionate Full Stack Web Developer creating modern, responsive websites and applications. I also specialize in Tamil Typing, offering accurate and efficient typing services for documents, content, and translations. As a Graphic Designer, I design eye-catching visuals using Photoshop and Canva for branding, social media, and marketing. Additionally, I craft intuitive UI/UX designs to enhance user experience and engagement.</p>
                <p><strong>Fun Fact : </strong>My last side project accidentally became a SaaS business. Your project might be next.</p>
                <p>I did something is now a profitable business! Don't let your idea go to waste!</p>
                <p>Your idea could be next... , Let's skip the small talk and start building something legendary.</p>
                {/* <p>I'm a passionate Full Stack Developer with expertise in building modern web applications. With a strong foundation in both front-end and back-end technologies, I create seamless digital experiences that users love.</p> */}
                {/* <p>My journey in web development started 5 years ago, and since then I've worked on various projects ranging from small business websites to complex web applications. I'm constantly learning and adapting to new technologies to stay at the forefront of web development.</p> */}

                <div className="info-list">
                  <div className="info-item">
                    <strong>Name:</strong>
                    <span>Kirushnar Mohanapriyan</span>
                  </div>
                  <div className="info-item">
                    <strong>Email:</strong>
                    <span>mohanapriyanpriyan4@gmail.com</span>
                  </div>
                  {/* <div className="info-item">
                    <strong>Experience:</strong>
                    <span>-</span>
                  </div>
                  <div className="info-item">
                    <strong>Freelance:</strong>
                    <span>Available</span>
                  </div> */}
                </div>

                <div className="mt-4">
                  <a className="btn btn-primary me-3">Download CV</a>
                  <Link className="btn btn-view"><a href="#contact">Contact Me</a></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section">
        <div className="container-fluid">
          <h2 className="section-title animate-in">Code Weapons<span></span></h2>
          <div className="skills-container">
            <div className="row">
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="skill-card animate-in">
                  <div className="skill-icon">
                    <i className="fab fa-html5"></i>
                  </div>
                  <h4>HTML5</h4>
                  <p>Semantic markup, accessibility standards, and modern HTML features.</p>
                  <span className="skill-level">Expert</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="skill-card animate-in delay-1">
                  <div className="skill-icon">
                    <i className="fab fa-css3-alt"></i>
                  </div>
                  <h4>CSS3/SASS</h4>
                  <p>Responsive design, animations, and preprocessor expertise.</p>
                  <span className="skill-level">Expert</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="skill-card animate-in delay-2">
                  <div className="skill-icon">
                    <i className="fab fa-js"></i>
                  </div>
                  <h4>JavaScript</h4>
                  <p>ES6+, DOM manipulation, and modern JS frameworks.</p>
                  <span className="skill-level">Intermediate</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="skill-card animate-in delay-3">
                  <div className="skill-icon">
                    <i className="fab fa-react"></i>
                  </div>
                  <h4>React.js</h4>
                  <p>Component-based architecture and state management.</p>
                  <span className="skill-level">Intermediate</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="skill-card animate-in">
                  <div className="skill-icon">
                    <i className="fab fa-node-js"></i>
                  </div>
                  <h4>Node.js</h4>
                  <p>Server-side JavaScript and RESTful API development.</p>
                  <span className="skill-level">Intermediate</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="skill-card animate-in delay-1">
                  <div className="skill-icon">
                    <i className="fas fa-database"></i>
                  </div>
                  <h4>MongoDB</h4>
                  <p>NoSQL database design and implementation.</p>
                  <span className="skill-level">Intermediate</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="skill-card animate-in delay-2">
                  <div className="skill-icon">
                    <i className="fas fa-paint-brush"></i>
                  </div>
                  <h4>UI/UX Design</h4>
                  <p>User-centered design principles and prototyping.</p>
                  <span className="skill-level">Intermediate</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="skill-card animate-in delay-3">
                  <div className="skill-icon">
                    <i className="fas fa-photo-video"></i>
                  </div>
                  <h4>Graphic Design</h4>
                  <p>Logo design, branding, and digital artwork.</p>
                  <span className="skill-level">Intermediate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* New Education Section */}
      <section id="education" className="section">
        <div className="container-fluid">
          <h2 className="section-title animate-in">My Education Journey<span></span></h2>
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="education-card animate-in">
                <div className="education-icon">
                  <i className="fas fa-laptop-code"></i>
                </div>
                <h3>ICT Technician - Level 4</h3>
                <p className='text-justify'>
                  I am proud to announce that I have successfully completed the National Vocational Qualification (NVQ) Level 4 in ICT Technician...               </p>
                <button className="btn btn-view" onClick={toggleModal}>View Full Details</button>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="education-card animate-in delay-1">
                <div className="education-icon">
                  <i className="fas fa-university"></i>
                </div>
                <h3>DP IT Campus</h3>
                <p className='text-justify'>
                  Attended DP IT Campus where I gained foundational knowledge in computer science and information technology principles...
                </p>
                <button className="btn btn-view" onClick={toggleWebDevModal}>View Full Details</button>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="education-card animate-in delay-2">
                <div className="education-icon">
                  <i className="fas fa-globe"></i>
                </div>
                <h3>Full Stack Web Development</h3>
                <p className='text-justify'>
                  Mastered full stack development including front-end technologies like React and back-end systems with Node.js and databases...
                </p>
                <button className="btn btn-view">View Full Details</button>
              </div>
            </div>
          </div>
        </div>


        {/* ICT Technician Modules */}
        {showModal && (
          <div className="modal-overlay" onClick={toggleModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={toggleModal}>
                <i className="fas fa-times"></i>
              </button>

              <h2>ICT Technician – Level 4 (National Certificate)</h2>
              <p className="modal-subtitle">Accredited by the Tertiary and Vocational Education Commission (TVEC), Sri Lanka</p>

              <div className="modal-description">

                <p className='text-jastify'>
                  I am proud to announce that I have successfully completed the National Vocational Qualification (NVQ) Level 4 in ICT Technician, accredited by the Tertiary and Vocational Education Commission (TVEC), Sri Lanka. This intensive program has equipped me with industry-standard technical skills and hands-on experience in computer systems, networking, software applications, and IT support.
                </p>

                <p className='text-jastify'>
                  This nationally recognized qualification equips learners with practical, industry-relevant ICT skills for roles in IT support, administration, and technical operations. The course aligns with the Sri Lanka Qualification Framework (SLQF) and emphasizes hands-on competency in hardware, software, and systems management.
                </p>
              </div>

              <h3 className="modal-section-title">Detailed Module Breakdown</h3>
              <div className="module-accordion">
                {modules.map((module, index) => (
                  <div key={index} className="module-item">
                    <div
                      className={`module-header ${activeModule === index ? 'active' : ''}`}
                      onClick={() => toggleModule(index)}
                    >
                      <h4>{module.title}</h4>
                      <i className={`fas ${activeModule === index ? 'fa-minus' : 'fa-plus'}`}></i>
                    </div>
                    {activeModule === index && (
                      <div className="module-content">
                        <ul>
                          {module.content.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <h3 className="modal-section-title">Career Pathways</h3>
              <ul className="career-pathways">
                <li>IT Support Technician (Helpdesk, Hardware Maintenance)</li>
                <li>Office Administrator (Data Entry, Document Management)</li>
                <li>Junior Network Administrator</li>
                <li>Graphic Designer Assistant</li>
                <li>Database Coordinator</li>
              </ul>

              <h3 className="modal-section-title">Learning Outcomes</h3>
              <ul className="learning-outcomes">
                <li>Troubleshoot hardware/software issues independently.</li>
                <li>Design professional documents, spreadsheets, and presentations.</li>
                <li>Configure and secure small office networks.</li>
                <li>Develop functional databases and basic information systems.</li>
              </ul>

              <div className="certificate-images">
                <img src="https://static.vecteezy.com/system/resources/previews/002/349/754/non_2x/modern-elegant-certificate-template-free-vector.jpg" alt="Certificate 1" className="certificate-img" />
                <img src="https://static.vecteezy.com/system/resources/thumbnails/006/425/314/small_2x/modern-university-certificate-template-free-vector.jpg" alt="Certificate 2" className="certificate-img" />
              </div>
            </div>
          </div>
        )}


        {/* Web Development Modules */}

        {/* Web Development Modal */}
        {showWebDevModal && (
          <div className="modal-overlay" onClick={toggleWebDevModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={toggleWebDevModal}>
                <i className="fas fa-times"></i>
              </button>

              <h2>Web Development Certification Course</h2>
              <p className="modal-subtitle">DP IT Campus (Online Program)</p>
              <p className="modal-subtitle">Full Stack Development with Modern Tools</p>

              <div className="modal-description">
                <h4 className="modal-section-title">Course Overview</h4>
                <p className='text-justify'>
                  This intensive program covers front-end development (HTML/CSS/JavaScript), back-end integration with Airtable, and mobile app development with Thunkable. Graduates will be able to build responsive websites, web apps, and cross-platform mobile applications.
                </p>
              </div>

              <h3 className="modal-section-title">Detailed Curriculum Breakdown</h3>
              <div className="module-accordion">
                {Modules.map((module, index) => (
                  <div key={index} className="module-item">
                    <div
                      className={`module-header ${activeModule === index ? 'active' : ''}`}
                      onClick={() => toggleModule(index)}
                    >
                      <h4>{module.title}</h4>
                      <i className={`fas ${activeModule === index ? 'fa-minus' : 'fa-plus'}`}></i>
                    </div>
                    {activeModule === index && (
                      <div className="module-content">
                        {module.sections.map((section, secIndex) => (
                          <div key={secIndex} className="module-section">
                            {section.subTitle && <h5>{section.subTitle}</h5>}
                            <ul>
                              {section.content.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <h3 className="modal-section-title">Learning Outcomes</h3>
              <ul className="learning-outcomes">
                {learningOutcomes.map((outcome, index) => (
                  <li key={index}>{outcome}</li>
                ))}
              </ul>

              <h3 className="modal-section-title">Tools & Technologies Covered</h3>
              <ul className="tools-covered">
                {toolsCovered.map((tool, index) => (
                  <li key={index}>{tool}</li>
                ))}
              </ul>

              <div className="certificate-images">
                <img src="https://static.vecteezy.com/system/resources/previews/002/349/754/non_2x/modern-elegant-certificate-template-free-vector.jpg" alt="Certificate 1" className="certificate-img" />
                <img src="https://static.vecteezy.com/system/resources/thumbnails/006/425/314/small_2x/modern-university-certificate-template-free-vector.jpg" alt="Certificate 2" className="certificate-img" />
              </div>

            </div>
          </div>
        )}

      </section>


      {/* Services Section */}
      <section id="services" className="section">
        <div className="container-fluid">
          <h2 className="section-title animate-in">What My Keyboard Does<span></span></h2>
          <div className="services-container">
            <div className="row">
              <div className="col-lg-4 col-md-6 mb-3">
                <div className="service-card animate-in">
                  <div className="service-icon">
                    <i className="fas fa-code"></i>
                  </div>
                  <h4>Web Development</h4>
                  <p>Custom website development tailored to your business needs using the latest technologies and frameworks for optimal performance.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div className="service-card animate-in delay-1">
                  <div className="service-icon">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <h4>Responsive Design</h4>
                  <p>Mobile-first responsive designs that work flawlessly across all devices and screen sizes, ensuring great user experience.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-3">
                <div className="service-card animate-in delay-2">
                  <div className="service-icon">
                    <i className="fas fa-paint-brush"></i>
                  </div>
                  <h4>UI/UX Design</h4>
                  <p>Beautiful, intuitive user interfaces designed with user experience in mind to increase engagement and conversions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container-fluid">
          <h2 className="section-title">Exchange Ideas</h2>
          <div className="contact-container">
            <div className="row">
              <div className="col-lg-5">
                <div className="contact-info">
                  <h3>Let's talk about your project</h3>
                  <p>Feel free to reach out if you're looking for a developer for your project, have a question, or just want to connect.</p>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="contact-text">
                      <h4>Location</h4>
                      <p>Neithal, Thuraimugam, Karainagar,<br />Jaffna, Sri Lanka</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="contact-text">
                      <h4>Email</h4>
                      <a href="mailto:mohanapriyanpriyan4@gmail.com">mohanapriyanpriyan4@gmail.com</a>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div className="contact-text">
                      <h4>Phone</h4>
                      <a href="tel:+94761989195">+94 761 989 195</a>
                    </div>
                  </div>

                  <div className="social-icons mt-4">
                    <a href="https://github.com/AkmMohanapriyan" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/kirushnar-mohanapriyan-120a38357/" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://wa.me/761989195" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-whatsapp"></i>
                    </a>
                    <a href="https://www.instagram.com/blacklover_akm?igsh=cHB0NXZ4eW9qOWYy" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="contact-name">Your Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="contact-name"
                          placeholder="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="contact-email">Your Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="contact-email"
                          placeholder="Your Email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="contact-subject">Subject</label>
                        <input
                          type="text"
                          className="form-control"
                          id="contact-subject"
                          placeholder="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="contact-message">Your Message</label>
                        <textarea
                          className="form-control"
                          id="contact-message"
                          placeholder="Your Message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="5"
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Sending...
                          </>
                        ) : 'Send Message'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container-fluid">
          <div className="footer-content">
            <div className="row">
              <div className="col-lg-6">
                <div className="footer-about">
                  <Link className="footer-logo"> <span className='kiru'>KIRUSHNAR</span> MOHANPRIYAN<span>.</span></Link>
                  <p>Full Stack Web Developer creating modern, responsive, and user-friendly websites and applications.</p>
                  <div className="footer-social">
                    <a href="https://github.com/AkmMohanapriyan"><i className="fab fa-github"></i></a>
                    <a href="https://www.linkedin.com/in/kirushnar-mohanapriyan-120a38357/"><i className="fab fa-linkedin-in"></i></a>
                    <a href="https://wa.me/761989195"><i className="fab fa-whatsapp"></i></a>
                    <a href="https://www.instagram.com/blacklover_akm?igsh=cHB0NXZ4eW9qOWYy"><i className="fab fa-instagram"></i></a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-links mt-4 mb-3">
                  <h3>Quick Links</h3>
                  <div className="footer-nav">
                    <Link ><a href="#home">HOME</a></Link>
                    <Link ><a href="#about">ABOUT</a></Link>
                    <Link ><a href="#skills">SKILLS</a></Link>
                    <Link ><a href="#services">SERVICES</a></Link>
                    <Link ><a href="#contact">CONTACT</a></Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer-links mt-4">
                  <h3>Services</h3>
                  <div className="footer-nav">
                    <Link to="#">Web Development</Link>
                    <Link to="#">UI/UX Design</Link>
                    <Link to="#">Responsive Design</Link>
                    <Link to="#">Graphic Design</Link>
                    <Link to="#">Tamil Typing</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; <span id="year"></span> Kirushnar Mohanapriyan. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <a href="#" className={`back-to-top ${showBackToTop ? 'active' : ''}`} onClick={scrollToTop}>
        <i className="fas fa-arrow-up"></i>
      </a>

      {/* Theme Toggle Button */}
      <div className={`theme-toggle ${showThemeToggle ? 'active' : ''}`} onClick={toggleTheme}>
        <i className={theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun'}></i>
      </div>


      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />


    </>
  );
};

export default Portfolio;