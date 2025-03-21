// Sidebar component for the Sidebar of the website for all the pages ,hub page

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,
  faGraduationCap,
  faCalendarAlt,
  faCog,
  faSignOutAlt,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import auth from '../../scripts/auth';
import '../../styles/sidebar.css';

type ContentType = 'home' | 'classes' | 'calendar' | 'settings' | 'classroom';

interface Classroom {
  id: string;
  name: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  isLoading: boolean;
  activeContent: ContentType;
  onContentChange: (content: ContentType) => void;
  classrooms: Classroom[];
  selectedClassroom: Classroom | null;
  onClassroomSelect: (classroom: Classroom) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  isLoading,
  activeContent,
  onContentChange,
  classrooms,
  selectedClassroom,
  onClassroomSelect
}) => {
  const [isClassesOpen, setIsClassesOpen] = React.useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/signin');
  };

  if (isLoading) {
    return (
      <aside className={`sidebar ${isCollapsed ? 'closed' : ''}`}>
        <div className="sidebar-content">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="menu-item skeleton">
              <div className="skeleton-icon" />
              <div className="skeleton-text" />
              {i === 1 && <div className="skeleton-chevron" />}
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className={`sidebar ${isCollapsed ? 'closed' : ''}`}>
      <div className="sidebar-content">
        <div className="menu-item-group">
          <div
            className={`menu-item ${activeContent === 'home' ? 'active' : ''}`}
            onClick={() => onContentChange('home')}
          >
            <FontAwesomeIcon icon={faHome} />
            <span>Home</span>
          </div>
        </div>

        <div className="menu-item-group">
          <div 
            className={`menu-item ${activeContent === 'classes' ? 'active' : ''}`}
            onClick={() => {
              if (!isCollapsed) {
                setIsClassesOpen(!isClassesOpen);
              }
              onContentChange('classes');
            }}
          >
            <FontAwesomeIcon icon={faGraduationCap} />
            <span>Classes</span>
            <FontAwesomeIcon 
              icon={faChevronDown}
              className="chevron"
              style={{
                transform: isClassesOpen ? 'rotate(180deg)' : 'rotate(0)',
                display: isCollapsed ? 'none' : 'block'
              }}
            />
          </div>
          {isClassesOpen && !isCollapsed && (
            <div className="submenu">
              {classrooms.length === 0 ? (
                <div className="menu-item sub empty">
                  <span>No classrooms yet</span>
                </div>
              ) : (
                classrooms.map(classroom => (
                  <div 
                    key={classroom.id}
                    className={`menu-item sub ${
                      activeContent === 'classroom' && 
                      selectedClassroom?.id === classroom.id ? 'active' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onClassroomSelect(classroom);
                    }}
                  >
                    <span>{classroom.name}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="menu-item-group">
          <div 
            className={`menu-item ${activeContent === 'calendar' ? 'active' : ''}`}
            onClick={() => onContentChange('calendar')}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>Calendar</span>
          </div>
        </div>

        <div className="menu-item-group">
          <div 
            className={`menu-item ${activeContent === 'settings' ? 'active' : ''}`}
            onClick={() => onContentChange('settings')}
          >
            <FontAwesomeIcon icon={faCog} />
            <span>Settings</span>
          </div>
        </div>

        <div className="menu-item logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Sign out</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;