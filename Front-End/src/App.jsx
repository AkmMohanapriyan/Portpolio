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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
// const response = await fetch('https://kirushnarmohanapriyan.vercel.app/api/contact', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(formData),
//   credentials: 'include' // If using cookies
// });


const response = await fetch('https://kirushnarmohanapriyan.vercel.app/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData)
});
      // First check if the response is JSON
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      toast.success(data.message);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
      console.error('Error:', error);
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
              <Link ><a className="nav-link active" href="#home"> <i class="fas fa-home"></i> HOME</a></Link>
              <Link ><a className="nav-link" href="#about"> <i class="fas fa-user"></i> ABOUT</a></Link>
              <Link ><a className="nav-link" href="#skills"> <i class="fas fa-code"></i> SKILLS</a></Link>
              <Link ><a className="nav-link" href="#services"> <i class="fas fa-cogs"></i> SERVICES</a></Link>
              <Link ><a className="nav-link" href="#contact"> <i class="fas fa-mobile-alt"></i> CONTACT</a></Link>
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
                  <Link className="btn btn-outline-light"><a className="btn-outline-light" href="#about" style={{color: "#e0e0e0", textDecoration: "none"}}>About Me</a></Link>
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

                <p style={{textAlign:"justify"}}>Hi, I'm <strong>Kirushnar Mohanapriyan</strong>, a passionate Full Stack Web Developer creating modern, responsive websites and applications. I also specialize in Tamil Typing, offering accurate and efficient typing services for documents, content, and translations. As a Graphic Designer, I design eye-catching visuals using Photoshop and Canva for branding, social media, and marketing. Additionally, I craft intuitive UI/UX designs to enhance user experience and engagement.</p>
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
                  <Link className="btn btn-outline-light"><a href="#contact" style={{color: "#e0e0e0", textDecoration: "none"}}>Contact Me</a></Link>
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
          <h2 className="section-title animate-in">Exchange Ideas<span></span></h2>
          <div className="contact-container">
            <div className="row">
              <div className="col-lg-5">
                <div className="contact-info animate-in">
                  <h3>Let's talk about your project</h3>
                  <p>Feel free to reach out if you're looking for a developer for your project, have a question, or just want to connect.</p>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="contact-text">
                      <h4>Location</h4>
                      <p>Neithal, Thuraimugam, Karainagar ,<br />Jaffna, Sri Lanka</p>
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
                    <a href="https://github.com/AkmMohanapriyan"><i className="fab fa-github"></i></a>
                    <a href="https://www.linkedin.com/in/kirushnar-mohanapriyan-120a38357/"><i className="fab fa-linkedin-in"></i></a>
                    <a href="https://wa.me/761989195"><i className="fab fa-whatsapp"></i></a>
                    <a href="https://www.instagram.com/blacklover_akm?igsh=cHB0NXZ4eW9qOWYy"><i className="fab fa-instagram"></i></a>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <form className="contact-form animate-in delay-1" onSubmit={handleSubmit}>
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
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
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