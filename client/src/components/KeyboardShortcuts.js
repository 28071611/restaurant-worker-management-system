import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap } from 'lucide-react';

const KeyboardShortcuts = () => {
  const navigate = useNavigate();
  const [activeAccess, setActiveAccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey) {
        let path = '';
        let label = '';
        
        switch (e.key) {
          case 'A':
            e.preventDefault();
            path = '/admin-login';
            label = 'ADMIN_ACCESS_PROTOCOL';
            break;
          case 'R':
            e.preventDefault();
            path = '/rate-worker';
            label = 'RATING_SEQUENCE_INITIATED';
            break;
          case 'C':
            e.preventDefault();
            path = '/file-complaint';
            label = 'INCIDENT_LOG_MATRIX';
            break;
          case 'D':
            e.preventDefault();
            path = '/';
            label = 'RETURNING_TO_CORE';
            break;
          default:
            return;
        }

        if (path) {
          triggerVisualFeedback(label);
          setTimeout(() => navigate(path), 800);
        }
      }
    };

    const triggerVisualFeedback = (label) => {
      setActiveAccess(label);
      setTimeout(() => setActiveAccess(false), 2000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (!activeAccess) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="bg-black/80 backdrop-blur-2xl px-12 py-8 rounded-3xl border border-emerald-500/50 shadow-[0_0_100px_rgba(16,185,129,0.2)] animate-fade-in flex flex-col items-center">
        <Zap className="h-12 w-12 text-emerald-500 mb-4 animate-pulse" />
        <p className="text-xl font-black text-white uppercase tracking-tighter italic">{activeAccess}</p>
        <div className="flex items-center space-x-2 mt-2">
          <Shield className="h-3 w-3 text-emerald-500/50" />
          <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest">Protocol Synchronized</span>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
