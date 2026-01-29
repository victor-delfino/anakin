// ============================================
// APP - Root Component
// ============================================

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-imperial-dark text-white">
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default App;
