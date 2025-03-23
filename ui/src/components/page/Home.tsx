// Home page for the home page of the website for all the pages
//import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';//AnimatePresence
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  //faGraduationCap, 
  //faBookOpen, 
  //faUsers, 
  //faChalkboardTeacher,
  faArrowRight,
  //faCheckCircle,
  faMoon,
  faSun
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../styles/contexts/ThemeContext';
import '../../styles/homeStyle.css';

const Home = () => {
  //const [activeFeature, setActiveFeature] = useState(0);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="home-container">
      <button 
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label="Toggle theme"
      >
        <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
      </button>
      
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            Transform Your Learning Journey with
            <span className="gradient-text"> CRCPX</span>
          </h1>
          <p className="hero-subtitle">
            Github <a href="https://github.com/ausadang/crcpx.git" target="_blank" rel="noopener noreferrer">@ausadang</a>
          </p>
          <div className="hero-buttons">
            <motion.a 
              href="/signup" 
              className="cta-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started <FontAwesomeIcon icon={faArrowRight} />
            </motion.a>
            <motion.a 
              href="/about" 
              className="cta-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </div>
          
        </motion.div>
      </section>

    </div>
  );
};

export default Home;

/**

  const features = [
    {
      title: "Interactive Learning",
      description: "Engage with dynamic content and real-time feedback",
      icon: faGraduationCap,
      color: "var(--primary-500)"
    },
    {
      title: "Resource Library",
      description: "Access comprehensive learning materials and study guides",
      icon: faBookOpen,
      color: "var(--secondary-500)"
    },
    {
      title: "Collaborative Space",
      description: "Work together with peers in virtual study groups",
      icon: faUsers,
      color: "var(--success)"
    },
    {
      title: "Expert Guidance",
      description: "Get support from experienced educators",
      icon: faChalkboardTeacher,
      color: "var(--info)"
    }
  ];

  const benefits = [
    "Real-time progress tracking",
    "Personalized learning paths",
    "Interactive assessments",
    "24/7 access to resources",
    "Mobile-friendly interface",
    "Secure data protection"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            Transform Your Learning Journey with
            <span className="gradient-text"> CRCPX</span>
          </h1>
          <p className="hero-subtitle">
            A modern platform designed to enhance your educational experience
          </p>
          <div className="hero-buttons">
            <motion.a 
              href="/signup" 
              className="cta-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started <FontAwesomeIcon icon={faArrowRight} />
            </motion.a>
            <motion.a 
              href="/about" 
              className="cta-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why Choose CRCPX?</h2>
        <div className="features-grid">
          <AnimatePresence mode="wait">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`feature-card ${index === activeFeature ? 'active' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: index === activeFeature ? 1.05 : 1,
                  borderColor: index === activeFeature ? feature.color : 'var(--border-light)'
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                onClick={() => setActiveFeature(index)}
              >
                <FontAwesomeIcon 
                  icon={feature.icon} 
                  className="feature-icon"
                  style={{ color: feature.color }}
                />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>


      <section className="benefits-section">
        <h2 className="section-title">Platform Benefits</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit}
              className="benefit-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="benefit-icon" />
              <span>{benefit}</span>
            </motion.div>
          ))}
        </div>
      </section>


      <section className="cta-section">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students who are already transforming their education with CRCPX</p>
          <motion.a 
            href="/signup" 
            className="cta-button primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Your Account <FontAwesomeIcon icon={faArrowRight} />
          </motion.a>
        </motion.div>
      </section>

*/