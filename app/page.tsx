"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  HeadphonesIcon, 
  Server, 
  Search, 
  Globe, 
  Share2, 
  CreditCard, 
  BarChart3,
  Clock,
  Trophy,
  Puzzle,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Target,
  Store,
  Briefcase,
  Calendar,
  User,
  X,
  Cookie,
  Zap,
  Star,
  Award,
  MessageCircle,
  Phone,
  Mail,
  Building
} from "lucide-react";
import { colors } from "@/lib/colors";
import PartnerMarquee from "@/components/PartnerMarquee";
import Head from 'next/head';
import Link from 'next/link';

// Scroll animation hook
const useScrollAnimation = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return scrollY;
};

// Intersection Observer hook for fade-in animations
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView] as const;
};

// Cookie Button Component
const CookieButton = () => {
  const [showBanner, setShowBanner] = useState(false);

  const handleAccept = () => {
    setShowBanner(false);
    // Add cookie acceptance logic here
  };

  return (
    <>
      {/* Cookie Button */}
      <button
        onClick={() => setShowBanner(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: colors.secondary }}
      >
        <Cookie className="w-6 h-6 text-white" />
      </button>

      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="max-w-md w-full p-6 rounded-3xl shadow-2xl"
            style={{ backgroundColor: colors.background }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Cookie className="w-6 h-6" style={{ color: colors.primary }} />
              <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>
                Cookie-Einstellungen
              </h3>
            </div>
            <p className="mb-6 text-sm" style={{ color: colors.secondary }}>
              Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Durch die Nutzung unserer Website stimmen Sie unserer Datenschutzrichtlinie zu.
            </p>
            <div className="flex space-x-3">
              <Button 
                onClick={handleAccept}
                className="flex-1 rounded-full font-medium"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.background
                }}
              >
                Akzeptieren
              </Button>
              <Button 
                onClick={() => setShowBanner(false)}
                variant="outline" 
                className="flex-1 rounded-full"
                style={{ 
                  borderColor: colors.secondary,
                  color: colors.secondary
                }}
              >
                Ablehnen
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function TimedBadge({ onHide }: { onHide: () => void }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = Date.now();
    let raf: number;
    const duration = 15000;
    function animate() {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / duration, 1));
      if (elapsed < duration) {
        raf = requestAnimationFrame(animate);
      } else {
        setVisible(false);
        onHide();
      }
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [visible, onHide]);

  if (!visible) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-50 py-2 px-4 flex flex-col items-center" style={{ backgroundColor: colors.secondary }}>
      <div className="text-center">
        <Badge 
          className="bg-transparent border-none px-3 py-1 text-xs sm:text-sm font-medium text-white"
        >
          🎯 Webdesign für kleine Unternehmen & Dienstleister – maßgeschneidert und bezahlbar. 🔥
        </Badge>
      </div>
      <div className="w-full max-w-md mt-2 h-1 rounded-full overflow-hidden bg-white/20">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${progress * 100}%`, backgroundColor: colors.tertiary }}
        />
      </div>
    </div>
  );
}

export default function AboutServicePage() {
  const scrollY = useScrollAnimation();
  const [heroRef, heroInView] = useInView();
  const [servicesRef, servicesInView] = useInView();
  const [processRef, processInView] = useInView();
  const [pricingRef, pricingInView] = useInView();
  const [aboutRef, aboutInView] = useInView();
  const [contactRef, contactInView] = useInView();
  const [badgeVisible, setBadgeVisible] = useState(true);

  const services = [
    {
      icon: Target,
      title: "Strategieberatung & Konzeption",
      description: "Gemeinsam entwickeln wir die richtige digitale Strategie für Ihr Unternehmen"
    },
    {
      icon: Monitor,
      title: "Responsives Webdesign",
      description: "Moderne, benutzerfreundliche Designs für alle Geräte"
    },
    {
      icon: HeadphonesIcon,
      title: "Persönlicher Support",
      description: "Direkter Ansprechpartner bei Fragen und Problemen"
    },
    {
      icon: Server,
      title: "Hosting & Wartung",
      description: "Sichere Server, regelmäßige Updates und Backups"
    },
    {
      icon: Search,
      title: "SEO-Optimierung",
      description: "Bessere Sichtbarkeit in Suchmaschinen"
    },
    {
      icon: Globe,
      title: "Domain-Einrichtung & Verwaltung",
      description: "Komplette Abwicklung von Domain-Setup bis Verwaltung"
    },
    {
      icon: Share2,
      title: "Social-Media-Verknüpfung",
      description: "Integration von Instagram, Facebook und anderen Plattformen"
    },
    {
      icon: CreditCard,
      title: "Zahlungsmethoden-Integration",
      description: "PayPal, Stripe, Klarna und weitere Zahlungsanbieter"
    },
    {
      icon: BarChart3,
      title: "Nutzeranalyse & Tracking",
      description: "Detaillierte Einblicke in Besucherverhalten und Performance"
    },
    {
      icon: MessageCircle,
      title: "Transparente Kommunikation",
      description: "Klare Absprachen und regelmäßige Updates zum Projektstand"
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Kennenlernen & Beratung",
      description: "Wir lernen Sie und Ihr Unternehmen kennen und besprechen Ihre Ziele und Wünsche."
    },
    {
      number: "02", 
      title: "Konzept & Struktur",
      description: "Gemeinsam entwickeln wir die Struktur und das Konzept für Ihre neue Website."
    },
    {
      number: "03",
      title: "Design & Umsetzung", 
      description: "Wir gestalten und programmieren Ihre Website nach Ihren Vorstellungen."
    },
    {
      number: "04",
      title: "Feinschliff & Go-Live",
      description: "Letzte Anpassungen, Tests und dann geht Ihre Website online."
    },
    {
      number: "05",
      title: "Support & Pflege",
      description: "Auch nach dem Launch sind wir für Sie da - mit Updates und Support."
    }
  ];

  const valueProps = [
    {
      icon: Clock,
      title: "Zeitersparnis",
      description: "Wir übernehmen den digitalen Teil, Sie konzentrieren sich aufs Geschäft"
    },
    {
      icon: Trophy,
      title: "Kompetenz & Erfahrung",
      description: "Technisch stark, klar in der Umsetzung"
    },
    {
      icon: Puzzle,
      title: "Maßgeschneiderte Lösungen",
      description: "Keine Templates, sondern individuelle Umsetzung"
    },
    {
      icon: Shield,
      title: "Stressfreies Webmanagement",
      description: "Ein Ansprechpartner für alles"
    }
  ];

  return (
    <>
      <Head>
        <title>Webklar – Klarheit im Webdesign</title>
        <meta name="description" content="Wir gestalten moderne, schnelle Websites für Ihr Business." />
        <meta property="og:title" content="Webklar – Klarheit im Webdesign" />
        <meta property="og:description" content="Wir gestalten moderne, schnelle Websites für Ihr Business." />
        <meta property="og:url" content="https://webklar.com" />
        <meta property="og:type" content="website" />
      </Head>
      <div className="min-h-screen overflow-hidden" style={{ backgroundColor: colors.background }}>
        {/* Fixed Top Badge */}
        <TimedBadge onHide={() => setBadgeVisible(false)} />

        {/* Fixed Navigation - Button Only */}
        <nav className={`fixed left-0 right-0 z-40 backdrop-blur-md transition-all duration-150 ${badgeVisible ? 'top-10' : 'top-0'}`}>
          <div className="relative flex flex-col md:flex-row md:justify-between items-center px-4 sm:px-8 py-4 max-w-7xl mx-auto">
            {/* Logo: absolut mittig auf Mobile, links auf Desktop */}
            <div>
              <button
                className={`relative text-2xl sm:text-3xl font-bold select-none focus:outline-none md:static absolute left-1/2 -translate-x-1/2 md:translate-x-0 ${badgeVisible ? 'top-8' : 'top-0'} md:top-auto z-50 transition-all duration-150 float`}
                style={{ color: colors.primary }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Zum Seitenanfang scrollen"
              >
                <span className="relative z-10 text-glow">Webklar</span>
                <div 
                  className="absolute -inset-2 rounded-xl blur-sm opacity-20"
                  style={{ backgroundColor: colors.secondary }}
                ></div>
              </button>
            </div>
            {/* Navigation Buttons (ohne Startseite) */}
            <div className="hidden md:flex space-x-6 flex-1 justify-center">
              <Button variant="ghost" className="rounded-full font-medium btn-enhanced hover-lift" style={{ color: colors.primary }} onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>Über uns</Button>
              <Button variant="ghost" className="rounded-full font-medium btn-enhanced hover-lift" style={{ color: colors.primary }} onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>Leistungen</Button>
              <Button variant="ghost" className="rounded-full font-medium btn-enhanced hover-lift" style={{ color: colors.primary }} onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}>Unsere Abläufe</Button>
              <Button variant="ghost" className="rounded-full font-medium btn-enhanced hover-lift" style={{ color: colors.primary }} onClick={() => document.getElementById('references')?.scrollIntoView({ behavior: 'smooth' })}>Referenzen</Button>
            </div>
            {/* Kontakt-Button nur auf Desktop */}
            <div className="hidden md:block flex-1 text-right">
              <Link href="/kontakte">
                <Button className="rounded-full font-semibold px-4 sm:px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 btn-enhanced pulse-glow" style={{ backgroundColor: colors.primary, color: colors.background }}>
                  Kontakt
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Background Video Hero Section */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover"
              style={{ filter: 'blur(8px)' }}
            >
              <source src="/path/to/your/background-video.mp4" type="video/mp4" />
            </video>
            <div 
              className="absolute inset-0 backdrop-blur-sm animated-gradient"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}CC, ${colors.secondary}CC)`
              }}
            ></div>
          </div>

          {/* Animated Background Lines */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.tertiary} />
                  <stop offset="50%" stopColor={colors.secondary} />
                  <stop offset="100%" stopColor={colors.primary} />
                </linearGradient>
              </defs>
              <path
                d={`M 0,${100 + scrollY * 0.1} Q 400,${200 + scrollY * 0.15} 800,${150 + scrollY * 0.1} T 1600,${100 + scrollY * 0.05}`}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
              <path
                d={`M 0,${300 + scrollY * 0.08} Q 600,${400 + scrollY * 0.12} 1200,${350 + scrollY * 0.08} T 2400,${300 + scrollY * 0.04}`}
                stroke="url(#lineGradient)"
                strokeWidth="1"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </div>

          <div ref={heroRef} className="relative z-20 px-4 sm:px-8 py-32 max-w-7xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm">
              {['Strategieberatung', 'UX/UI Design', 'Entwicklung', 'SEO & Support'].map((item) => (
                <span 
                  key={item}
                  className="px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm border"
                  style={{ 
                    backgroundColor: `${colors.background}80`,
                    borderColor: colors.tertiary,
                    color: colors.primary
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
            
            <h1 className={`text-4xl sm:text-6xl md:text-8xl font-bold mb-6 sm:mb-8 transition-all duration-1000 ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <span 
                className="relative inline-block text-glow"
                style={{ color: colors.background }}
              >
                Maßgeschneiderte
                <div 
                  className="absolute -inset-4 rounded-2xl blur-xl opacity-20"
                  style={{ backgroundColor: colors.tertiary }}
                ></div>
              </span>{" "}
              <span className="text-glow" style={{ color: colors.background }}>Websites für</span>
              <br />
              <span className="text-glow" style={{ color: colors.background }}>kleine{" "}</span>
              <span 
                className="relative inline-block text-glow"
                style={{ color: colors.background }}
              >
                Unternehmen
                <svg className="absolute -bottom-2 sm:-bottom-4 left-0 w-full h-4 sm:h-6" viewBox="0 0 400 20">
                  <path
                    d="M 0,15 Q 200,5 400,15"
                    stroke={colors.tertiary}
                    strokeWidth="4"
                    fill="none"
                    className="animate-pulse"
                  />
                </svg>
              </span>
            </h1>
            
            <p className={`text-lg sm:text-xl mb-8 sm:mb-12 max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ color: colors.background }}>
              Von der Strategie bis zum fertigen Auftritt: Wir gestalten moderne, nutzerfreundliche Websites mit persönlichem Support.
            </p>
            
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 transition-all duration-1000 delay-500 ${
              heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <Button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full flex items-center justify-center space-x-3 text-base sm:text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 btn-enhanced hover-lift"
                style={{ 
                  backgroundColor: colors.background,
                  color: colors.primary
                }}
              >
                <Calendar className="w-5 sm:w-6 h-5 sm:h-6" />
                <span>Kostenlosen Termin buchen</span>
              </Button>
            </div>

            {/* Partner Tools */}
            <div className="mt-12 sm:mt-20">
              {/* Replace old grid with PartnerMarquee */}
              <PartnerMarquee />
              <Button 
                variant="outline" 
                className="rounded-full text-xs sm:text-sm mx-auto block"
                style={{ 
                  borderColor: colors.secondary,
                  color: colors.background,
                  backgroundColor: `${colors.secondary}40`
                }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Referenzen <ArrowRight className="ml-2 w-3 sm:w-4 h-3 sm:h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section 
          id="about"
          ref={aboutRef} 
          className="relative px-4 sm:px-8 py-12 sm:py-20 rounded-t-[2rem] sm:rounded-t-[3rem] rounded-b-[2rem] sm:rounded-b-[3rem] my-4 sm:my-8 mx-2 sm:mx-4 backdrop-blur-sm"
          style={{ backgroundColor: `${colors.background}F0` }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                {/* Animated decorative elements */}
                <div 
                  className="absolute -top-10 -left-10 w-24 sm:w-32 h-24 sm:h-32 border-2 rounded-full opacity-50 animate-pulse"
                  style={{ borderColor: colors.secondary }}
                ></div>
                <div 
                  className="absolute -bottom-10 -right-10 w-16 sm:w-24 h-16 sm:h-24 border-2 rounded-full opacity-50 animate-bounce"
                  style={{ borderColor: colors.tertiary }}
                ></div>
                
                <svg className="w-full h-48 sm:h-64 opacity-20">
                  <path
                    d="M 50,200 Q 150,50 250,150 T 450,100"
                    stroke={colors.secondary}
                    strokeWidth="3"
                    fill="none"
                    className="animate-pulse"
                  />
                </svg>
              </div>
              
              <div className={`order-1 lg:order-2 transition-all duration-1000 ${
                aboutInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight" style={{ color: colors.primary }}>
                  Wir sind ein{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">junges</span>
                    <div className="absolute -bottom-1 left-0 w-full h-1 bg-current opacity-30"></div>
                  </span>
                  {" "}Webdesign-Studio aus{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">Kaiserslautern</span>
                    <div 
                      className="absolute -inset-2 rounded-full border-2 opacity-50"
                      style={{ borderColor: colors.secondary }}
                    ></div>
                  </span>
                  <svg className="block mt-2 w-32 h-3" viewBox="0 0 128 12">
                    <path
                      d="M 0,8 Q 64,2 128,8"
                      stroke={colors.secondary}
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </h2>
                
                <p 
                  className="text-base sm:text-xl mb-6 sm:mb-8 leading-relaxed"
                  style={{ color: colors.secondary }}
                >
                  Mit einem klaren Ziel: kleinen Unternehmen und lokalen Dienstleistern eine starke digitale Präsenz zu verschaffen. Unsere Stärken liegen in moderner Gestaltung, technischer Klarheit und persönlichem Support.
                </p>
                
                <p 
                  className="text-base sm:text-lg font-medium"
                  style={{ color: colors.primary }}
                >
                  Kein Baukasten, kein Agentur-Blabla. Sondern ehrliche Arbeit, individuell abgestimmt.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section 
          id="services"
          ref={servicesRef} 
          className="relative px-4 sm:px-8 py-12 sm:py-20 rounded-t-[2rem] sm:rounded-t-[3rem] rounded-b-[2rem] sm:rounded-b-[3rem] mx-2 sm:mx-4 backdrop-blur-sm"
          style={{ backgroundColor: `${colors.primary}F0` }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className={`text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 transition-all duration-1000 ${
                servicesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ color: colors.tertiary }}>
                Unsere Leistungen
              </h2>
              <p className={`text-lg sm:text-xl transition-all duration-1000 delay-200 ${
                servicesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ color: colors.background }}>
                Alles aus einer Hand für Ihren digitalen Erfolg
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer backdrop-blur-sm card-hover glass-enhanced ${
                    servicesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ 
                    backgroundColor: `${colors.primaryLight}80`,
                    transitionDelay: `${index * 100}ms`
                  }}
                >
                  <div 
                    className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: colors.tertiary }}
                  >
                    <service.icon className="h-5 sm:h-6 w-5 sm:w-6" style={{ color: colors.primary }} />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold mb-2" style={{ color: colors.background }}>
                    {service.title}
                  </h4>
                  <p className="text-sm" style={{ color: colors.tertiary }}>
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section 
          id="process"
          ref={processRef} 
          className="relative px-4 sm:px-8 py-12 sm:py-20 rounded-t-[2rem] sm:rounded-t-[3rem] rounded-b-[2rem] sm:rounded-b-[3rem] mx-2 sm:mx-4 backdrop-blur-sm"
          style={{ backgroundColor: `${colors.background}F0` }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className={`text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 transition-all duration-1000 ${
                processInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ color: colors.primary }}>
                Unser Ablauf
              </h2>
              <p className={`text-lg sm:text-xl transition-all duration-1000 delay-200 ${
                processInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ color: colors.secondary }}>
                So läuft die Zusammenarbeit ab
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg transition-all duration-1000 hover:scale-105 backdrop-blur-sm card-hover hover-lift ${
                    processInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`}
                  style={{ 
                    backgroundColor: colors.background,
                    transitionDelay: `${index * 200}ms`
                  }}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: colors.background
                    }}
                  >
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: colors.primary }}>
                      {step.title}
                    </h3>
                    <p className="text-base sm:text-lg" style={{ color: colors.secondary }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section 
          id="references"
          ref={pricingRef} 
          className="relative px-4 sm:px-8 py-12 sm:py-20 rounded-t-[2rem] sm:rounded-t-[3rem] rounded-b-[2rem] sm:rounded-b-[3rem] mx-2 sm:mx-4 backdrop-blur-sm"
          style={{ backgroundColor: `${colors.primary}F0` }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12 sm:mb-16">
              <h2 className={`text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 transition-all duration-1000 ${
                pricingInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ color: colors.tertiary }}>
                Faire Preise
              </h2>
              <p className={`text-lg sm:text-xl transition-all duration-1000 delay-200 ${
                pricingInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ color: colors.background }}>
                Transparent und flexibel
              </p>
            </div>

            <div className={`p-8 sm:p-12 rounded-3xl shadow-2xl backdrop-blur-sm transition-all duration-1000 delay-300 ${
              pricingInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ backgroundColor: `${colors.background}F0` }}>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: colors.primary }}>
                Individuelle Lösungen
              </h3>
              <p className="text-lg sm:text-xl mb-8 leading-relaxed" style={{ color: colors.secondary }}>
                Unsere Preise richten sich nach dem Projektumfang und Ihren Anforderungen. 
                Gemeinsam finden wir eine Lösung, die zu Ihrem Budget passt – transparent, fair und flexibel.
              </p>
              <Button 
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:scale-105 transition-all duration-300"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.background
                }}
              >
                👉 Projekt besprechen
              </Button>
            </div>
          </div>
        </section>

        {/* Target Groups & Value Props */}
        <section 
          className="relative px-4 sm:px-8 py-12 sm:py-20 rounded-t-[2rem] sm:rounded-t-[3rem] rounded-b-[2rem] sm:rounded-b-[3rem] mx-2 sm:mx-4 backdrop-blur-sm"
          style={{ backgroundColor: `${colors.background}F0` }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
              {/* Target Groups */}
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8" style={{ color: colors.primary }}>
                  Für wen wir arbeiten
                </h2>
                <p className="text-lg sm:text-xl leading-relaxed" style={{ color: colors.secondary }}>
                  Wir arbeiten mit Unternehmen, die ihre veraltete Website modernisieren oder ihre Zeit nicht mehr mit Technik und Support verschwenden wollen.
                </p>
              </div>

              {/* Value Props */}
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8" style={{ color: colors.primary }}>
                  Warum wir das tun
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {valueProps.map((prop, index) => (
                    <div 
                      key={index} 
                      className="flex items-start space-x-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                      style={{ backgroundColor: `${colors.primary}20` }}
                    >
                      <div 
                        className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: colors.secondary }}
                      >
                        <prop.icon className="h-5 sm:h-6 w-5 sm:w-6" style={{ color: colors.background }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-base sm:text-lg" style={{ color: colors.primary }}>
                          {prop.title}
                        </h4>
                        <p className="text-sm sm:text-base" style={{ color: colors.secondary }}>
                          {prop.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
          ref={contactRef}
          id="contact"
          className="relative px-4 sm:px-8 py-12 sm:py-20 rounded-t-[2rem] sm:rounded-t-[3rem] rounded-b-[2rem] sm:rounded-b-[3rem] mx-2 sm:mx-4 backdrop-blur-sm"
          style={{ backgroundColor: colors.secondary }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 
                className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6"
                style={{ color: colors.background }}
              >
                Lassen Sie uns sprechen
              </h2>
              <p 
                className="text-lg sm:text-xl opacity-90"
                style={{ color: colors.background }}
              >
                Erzählen Sie uns von Ihrem Projekt
              </p>
            </div>

            <div className={`grid md:grid-cols-2 gap-8 transition-all duration-1000 ${
              contactInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {/* Contact Form */}
              <div 
                className="p-6 sm:p-8 rounded-3xl backdrop-blur-sm"
                style={{ backgroundColor: `${colors.background}F0` }}
              >
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primary }}>
                      01 – Wie ist dein Name?
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: colors.tertiary,
                        backgroundColor: colors.background,
                        color: colors.primary
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primary }}>
                      02 – Deine Telefonnummer
                    </label>
                    <input 
                      type="tel" 
                      className="w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: colors.tertiary,
                        backgroundColor: colors.background,
                        color: colors.primary
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primary }}>
                      03 – Dein Unternehmen
                    </label>
                    <input 
                      type="text" 
                      className="w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: colors.tertiary,
                        backgroundColor: colors.background,
                        color: colors.primary
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primary }}>
                      04 – Deine E-Mail-Adresse
                    </label>
                    <input 
                      type="email" 
                      className="w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: colors.tertiary,
                        backgroundColor: colors.background,
                        color: colors.primary
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primary }}>
                      05 – Erzähl uns kurz von deinem Vorhaben
                    </label>
                    <textarea 
                      rows={4}
                      className="w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: colors.tertiary,
                        backgroundColor: colors.background,
                        color: colors.primary
                      }}
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full py-3 rounded-xl text-lg font-semibold"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: colors.background
                    }}
                  >
                    Anfrage absenden
                  </Button>
                </form>
              </div>

              {/* Alternative Contact */}
              <div className="space-y-6">
                <div 
                  className="p-6 sm:p-8 rounded-3xl backdrop-blur-sm"
                  style={{ backgroundColor: `${colors.background}20` }}
                >
                  <h3 className="text-xl font-bold mb-4" style={{ color: colors.background }}>
                    Oder direkt anrufen
                  </h3>
                  <Button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-3 rounded-xl text-lg font-semibold mb-4"
                    style={{ 
                      backgroundColor: colors.background,
                      color: colors.primary
                    }}
                  >
                    <CheckCircle className="mr-3 h-5 w-5" />
                    Website optimieren
                  </Button>
                  
                  <div className="space-y-3 text-sm" style={{ color: colors.background }}>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3" />
                      <span>+49 (0) 631 123 456</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3" />
                      <span>hallo@webklar.de</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-3" />
                      <span>Kaiserslautern, Deutschland</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer 
          className="relative py-8 sm:py-12 border-t rounded-t-[2rem] sm:rounded-t-[3rem] mx-2 sm:mx-4 backdrop-blur-sm"
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

        {/* Film Grain Effect */}
        <div className="film-grain"></div>

        {/* Cookie Button */}
        <CookieButton />
      </div>
    </>
  );
}