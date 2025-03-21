import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './ErrorPage.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="error-container" onMouseMove={handleMouseMove}>
      <div className="grid-background" />
      <div className="error-content">
        <div
          className="decorative-element warning-icon"
          style={{
            transform: `translate(${(mousePosition.x - window.innerWidth / 2) * -0.02}px, ${
              (mousePosition.y - window.innerHeight / 2) * -0.02
            }px)`,
          }}
        />
        <div
          className="decorative-element wave-line"
          style={{
            transform: `translate(${(mousePosition.x - window.innerWidth / 2) * -0.015}px, ${
              (mousePosition.y - window.innerHeight / 2) * -0.015
            }px)`,
          }}
        />
        <div
          className="decorative-element plug-icon"
          style={{
            transform: `translate(${(mousePosition.x - window.innerWidth / 2) * -0.01}px, ${
              (mousePosition.y - window.innerHeight / 2) * -0.01
            }px)`,
          }}
        />
        <div
          className="decorative-element cursor-icon"
          style={{
            transform: `translate(${(mousePosition.x - window.innerWidth / 2) * -0.025}px, ${
              (mousePosition.y - window.innerHeight / 2) * -0.025
            }px)`,
          }}
        />
        <div className="error-background">404</div>
        <h1 className="error-title">Page Not Found</h1>
        <button className="error-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;