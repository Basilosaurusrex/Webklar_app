import Link from 'next/link';
import { colors } from '@/lib/colors';

export default function WebklarFooter() {
  return (
    <footer 
      className="hidden md:block relative py-8 sm:py-12 border-t rounded-t-[2rem] sm:rounded-t-[3rem] mx-2 sm:mx-4 backdrop-blur-sm"
      style={{ 
        backgroundColor: `${colors.primary}F0`,
        borderColor: colors.secondary
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 sm:col-span-2">
            <div 
              className="text-2xl sm:text-3xl font-bold mb-4 relative"
              style={{ color: colors.tertiary }}
            >
              <span className="relative z-10">Webklar</span>
              <div 
                className="absolute -inset-2 rounded-xl blur-sm opacity-20"
                style={{ backgroundColor: colors.secondary }}
              ></div>
            </div>
            <p 
              className="mb-6 leading-relaxed text-sm sm:text-base"
              style={{ color: colors.background }}
            >
              Ihr Partner für Web & Support. Moderne Websites. Klare Kommunikation. Persönlicher Support.
            </p>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4" style={{ color: colors.tertiary }}>
              Services
            </h4>
            <ul className="space-y-2 text-sm sm:text-base" style={{ color: colors.background }}>
              {['Webdesign', 'E-Commerce', 'SEO', 'Hosting'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:opacity-80 transition-opacity">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4" style={{ color: colors.tertiary }}>
              Kontakt
            </h4>
            <ul className="space-y-2 text-sm sm:text-base" style={{ color: colors.background }}>
              <li><Link href="/impressum" className="hover:opacity-80 transition-opacity">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:opacity-80 transition-opacity">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:opacity-80 transition-opacity">AGB</Link></li>
              <li><Link href="/kontakte" className="hover:opacity-80 transition-opacity">Kontakte</Link></li>
            </ul>
          </div>
        </div>
        <div 
          className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm"
          style={{ 
            borderColor: colors.secondary,
            color: colors.background
          }}
        >
          <p>&copy; 2025 Webklar. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
} 