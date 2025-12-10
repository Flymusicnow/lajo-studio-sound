import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/pricing', label: t('nav.pricing') },
    { path: '/booking', label: t('nav.booking') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-serif font-semibold tracking-wider text-foreground hover:text-primary transition-colors"
          >
            LAJO
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-sans tracking-wide transition-colors gold-underline ${
                  isActive(link.path) 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Language Toggle */}
            <div className="flex items-center gap-1 ml-4 text-sm">
              <button
                onClick={() => setLanguage('sv')}
                className={`px-2 py-1 transition-colors ${
                  language === 'sv' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                SV
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 transition-colors ${
                  language === 'en' 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50 pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-sans transition-colors ${
                    isActive(link.path) 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Language Toggle */}
              <div className="flex items-center gap-2 mt-2 text-sm">
                <button
                  onClick={() => setLanguage('sv')}
                  className={`px-3 py-1.5 border transition-colors ${
                    language === 'sv' 
                      ? 'border-primary text-primary' 
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Svenska
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 border transition-colors ${
                    language === 'en' 
                      ? 'border-primary text-primary' 
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
