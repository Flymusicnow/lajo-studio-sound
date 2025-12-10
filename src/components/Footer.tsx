import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <span className="text-xl font-serif font-semibold tracking-wider text-foreground">
            LAJO
          </span>
          
          {/* Copyright */}
          <p className="text-sm text-muted-foreground font-sans">
            © {currentYear} LAJO Studio. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
