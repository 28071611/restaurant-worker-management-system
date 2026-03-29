import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const KeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+A - Admin Dashboard
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        navigate('/admin-login');
      }
      
      // Ctrl+Shift+R - Rate Worker
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        navigate('/rate-worker');
      }
      
      // Ctrl+Shift+C - File Complaint
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        navigate('/file-complaint');
      }
      
      // Ctrl+Shift+D - Dashboard
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return null;
};

export default KeyboardShortcuts;
