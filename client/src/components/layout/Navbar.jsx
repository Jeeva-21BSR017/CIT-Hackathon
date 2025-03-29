import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Replace this with your actual authentication logic.
  const isLoggedIn = false; // or use a context/hook to get the auth state

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Community', path: '/community' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? 'py-2 bg-white/90 backdrop-blur-md shadow-sm'
        : 'py-4 bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold text-blue-600 flex items-center"
          >
            <span className="text-gradient">Level Up</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <ul className="flex space-x-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location.pathname === link.path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="ml-4 flex space-x-2">
              {isLoggedIn ? (
                <Link to="/logout">
                  <GradientButton size="sm" variant="default">
                    Logout
                  </GradientButton>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <GradientButton size="sm" variant="outline">
                      Sign In
                    </GradientButton>
                  </Link>
                  <Link to="/register">
                    <GradientButton size="sm" variant="default">
                      Register
                    </GradientButton>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 animate-fade-in">
            <ul className="pt-4 pb-3 space-y-1">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 text-base font-medium rounded-lg ${location.pathname === link.path
                      ? 'text-blue-600 bg-blue-50 dark:bg-gray-800'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="px-4 pb-4 flex flex-col space-y-2">
              {isLoggedIn ? (
                <Link to="/logout">
                  <GradientButton fullWidth variant="default">
                    Logout
                  </GradientButton>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <GradientButton fullWidth variant="outline">
                      Sign In
                    </GradientButton>
                  </Link>
                  <Link to="/register">
                    <GradientButton fullWidth>
                      Register
                    </GradientButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
