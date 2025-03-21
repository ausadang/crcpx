import React from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../../scripts/auth';

interface HubLayoutProps {
  children: React.ReactNode;
}

const HubLayout: React.FC<HubLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/signin');
  };

  return (
    <div className="hub-layout">
      <nav className="hub-nav">
        <div className="nav-brand">CRCPX</div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>
      <div className="hub-content">
        {children}
      </div>
    </div>
  );
};

export default HubLayout;


// Navbar component for the navbar of the website for all the pages ,hub page
/**
 * atfc = auro fetch classrooms from database can list and click to change workspace to classroom
 * O/CSI= open/close sidebar icon
 * ______________________________________________________________________________________________________________
 * O/CSI          Dashboard              [theme_toggle][join_classroom][create_classroom][calendar][profile.png]|
 * -------------------------------------------------------------------------------------------------------------|
 * dashboard    |  ________________
 * classes    ^ |  |              |
 *    atfc      |  |     atfc     | 
 * -------------|  |______________|
 * archived     |  
 * settings     |  
 *              |  
 *              |                       
 *              |                        
 *              |                         
 *              |
 *              |
 *              |
 *              |
 *              |
 *              |
 *              |
 * -------------|
 *    logout    |
 * --------------------------------------------------------------------------------------------------------------------
 * 
 */