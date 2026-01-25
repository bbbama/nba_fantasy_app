import React from 'react';
import { Typography, Box } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box className="flex flex-col min-h-screen bg-slate-900 text-white">
      {/* AppBar będzie teraz w App.tsx */}
      <main className="flex-grow p-4">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <Typography variant="body2" color="inherit">
          &copy; {new Date().getFullYear()} NBA Fantasy. All rights reserved.
        </Typography>
      </footer>
    </Box>
  );
};

export default Layout;
