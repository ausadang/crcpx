// Hub page for the hub page of the website for all the pages ,hub page is the main page that user see after login
// it look like a iframe of the website
// i click the sidebar button like page it will open the page in the iframe
// maybe like a react frame component

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faUserPlus, 
  faStream, 
  faBook, 
  faUsers,
  faEllipsisV 
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../layout/navbar';
import Sidebar from '../layout/sidebar';
import '../../styles/hub.css';

type ContentType = 'home' | 'classes' | 'calendar' | 'settings' | 'classroom';
type ClassroomTab = 'stream' | 'classwork' | 'people';

interface Classroom {
  id: string;
  name: string;
}

const Hub: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);
  const [activeContent, setActiveContent] = useState<ContentType>('home');
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [activeTab, setActiveTab] = useState<ClassroomTab>('stream');
  const [classrooms] = useState<Classroom[]>([
    { id: 'atfc', name: 'ATFC' },
    // Add more classrooms here when you have them
  ]);

  // Use classrooms array length to determine if there are classrooms
  const hasClassrooms = classrooms.length > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSidebarLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleContentChange = (content: ContentType) => {
    setActiveContent(content);
    if (content !== 'classroom') {
      setSelectedClassroom(null);
    }
  };

  const handleClassroomSelect = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setActiveContent('classroom');
  };

  const renderClassroomContent = () => {
    if (!selectedClassroom) return null;

    return (
      <div className="classroom-view">
        <div className="classroom-header">
          <div className="classroom-info">
            <h1>{selectedClassroom.name}</h1>
            <button className="menu-button">
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </div>
          <div className="classroom-tabs">
            <button 
              className={`tab-button ${activeTab === 'stream' ? 'active' : ''}`}
              onClick={() => setActiveTab('stream')}
            >
              <FontAwesomeIcon icon={faStream} />
              Stream
            </button>
            <button 
              className={`tab-button ${activeTab === 'classwork' ? 'active' : ''}`}
              onClick={() => setActiveTab('classwork')}
            >
              <FontAwesomeIcon icon={faBook} />
              Classwork
            </button>
            <button 
              className={`tab-button ${activeTab === 'people' ? 'active' : ''}`}
              onClick={() => setActiveTab('people')}
            >
              <FontAwesomeIcon icon={faUsers} />
              People
            </button>
          </div>
        </div>
        <div className="classroom-content">
          {activeTab === 'stream' && (
            <div className="stream-view">
              <div className="announcement-box">
                <div className="announcement-input">
                  <span>Share something with your class</span>
                </div>
              </div>
              <div className="stream-feed">
                <p>No announcements yet</p>
              </div>
            </div>
          )}
          {activeTab === 'classwork' && (
            <div className="classwork-view">
              <p>Classwork content coming soon</p>
            </div>
          )}
          {activeTab === 'people' && (
            <div className="people-view">
              <p>People content coming soon</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeContent) {
      case 'home':
        return (
          <div className="content-section">
            {!hasClassrooms ? (
              <div className="empty-state">
                <img 
                  src="/no-classrooms.svg" 
                  alt="No classrooms" 
                  className="empty-state-illustration"
                />
                <h2>Add or join your first classroom</h2>
                <div className="empty-state-actions">
                  <button className="action-button primary">
                    <FontAwesomeIcon icon={faPlus} />
                    Create classroom
                  </button>
                  <button className="action-button secondary">
                    <FontAwesomeIcon icon={faUserPlus} />
                    Join classroom
                  </button>
                </div>
              </div>
            ) : (
              <div className="classrooms-list">
                {classrooms.map(classroom => (
                  <div 
                    key={classroom.id}
                    className="classroom-card"
                    onClick={() => handleClassroomSelect(classroom)}
                  >
                    <h3>{classroom.name}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'classes':
        return (
          <div className="content-section">
            {!hasClassrooms ? (
              <div className="empty-state">
                <img 
                  src="/no-classrooms.svg" 
                  alt="No classrooms" 
                  className="empty-state-illustration"
                />
                <h2>Add or join your first classroom</h2>
                <div className="empty-state-actions">
                  <button className="action-button primary">
                    <FontAwesomeIcon icon={faPlus} />
                    Create classroom
                  </button>
                  <button className="action-button secondary">
                    <FontAwesomeIcon icon={faUserPlus} />
                    Join classroom
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1>Your Classes</h1>
                <div className="classrooms-grid">
                  {classrooms.map(classroom => (
                    <div 
                      key={classroom.id}
                      className="classroom-card"
                      onClick={() => handleClassroomSelect(classroom)}
                    >
                      <h3>{classroom.name}</h3>
                      <p>Click to view classroom</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      case 'classroom':
        if (!selectedClassroom) {
          setActiveContent('classes');
          return null;
        }
        return (
          <div className="content-section">
            {renderClassroomContent()}
          </div>
        );
      case 'calendar':
        return (
          <div className="content-section">
            <h1>Calendar</h1>
            <p>Calendar features coming soon</p>
          </div>
        );
      case 'settings':
        return (
          <div className="content-section">
            <h1>Settings</h1>
            <p>Settings options coming soon</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="hub-container">
      <Navbar 
        onToggleSidebar={handleToggleSidebar} 
        activeContent={activeContent}
        selectedClassroom={selectedClassroom}
      />
      <div className="hub-content">
        <Sidebar 
          isCollapsed={isCollapsed} 
          isLoading={isSidebarLoading}
          activeContent={activeContent}
          onContentChange={handleContentChange}
          classrooms={classrooms}
          selectedClassroom={selectedClassroom}
          onClassroomSelect={handleClassroomSelect}
        />
        <main className="workspace">
          <div className="frame-container">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Hub;
