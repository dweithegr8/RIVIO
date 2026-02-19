import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Submit Feedback', path: '/submit-feedback' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-brand-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Placeholder */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Repufeed</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-white'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/admin/login"
              className="text-neutral-300 hover:text-white px-4 py-2 font-medium transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/get-started"
              className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold shadow-button hover:bg-brand-primary/90 hover:shadow-button-hover transition-all duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-brand-dark-alpha transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-800">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-white bg-brand-primary-alpha'
                      : 'text-neutral-300 hover:text-white hover:bg-brand-dark-alpha'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 mt-2 border-t border-neutral-800">
                <Link
                  to="/admin/login"
                  className="text-neutral-300 hover:text-white px-3 py-2.5 font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/get-started"
                  className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold text-center shadow-button hover:bg-brand-primary/90 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
