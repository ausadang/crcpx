// Navbar component for the navbar of the website for all the pages ,hub page

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSun, 
  faMoon,
  faPlus, 
  faCalendarAlt, 
  faUserPlus,
  faCog,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../styles/contexts/ThemeContext';
import '../../styles/navbar.css';

interface NavbarProps {
  onToggleSidebar: () => void;
  activeContent: 'home' | 'classes' | 'calendar' | 'settings' | 'classroom';
  selectedClassroom?: { id: string; name: string } | null;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, activeContent, selectedClassroom }) => {
  const { theme, toggleTheme } = useTheme();

  const getTitle = () => {
    switch (activeContent) {
      case 'home':
        return 'Dashboard';
      case 'classes':
        return 'Classes';
      case 'calendar':
        return 'Calendar';
      case 'settings':
        return 'Settings';
      case 'classroom':
        return selectedClassroom?.name || 'Classroom';
      default:
        return 'Dashboard';
    }
  };

  return (
    <nav className="main-nav">
      <div className="nav-left">
        <button className="nav-btn toggle-sidebar" onClick={onToggleSidebar}>
          <FontAwesomeIcon icon={faBars} title="Toggle sidebar" />
        </button>
        <div className="nav-title">{getTitle()}</div>
      </div>
      <div className="nav-actions">
        <button 
          className="nav-btn" 
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-pressed={theme === 'dark'}
        >
          <FontAwesomeIcon 
            icon={theme === 'light' ? faMoon : faSun} 
            aria-hidden="true"
          />
        </button>
        <button className="nav-btn">
          <FontAwesomeIcon icon={faUserPlus} title="Join classroom" />
        </button>
        <button className="nav-btn">
          <FontAwesomeIcon icon={faPlus} title="Create classroom" />
        </button>
        <button className="nav-btn">
          <FontAwesomeIcon icon={faCalendarAlt} title="Calendar" />
        </button>
        <button className="nav-btn">
          <FontAwesomeIcon icon={faCog} title="Settings" />
        </button>
        <div className="profile-img">
          <img src="/default-profile.png" alt="Profile" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;