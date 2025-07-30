"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calculator, ChevronDown, ChevronUp, Loader2, Info, HelpCircle } from 'lucide-react';
import { colors } from '@/lib/colors';

interface PriceCalculatorProps {
  onPriceCalculated?: (price: string, details: string) => void;
}

const services = [
  { 
    id: 'seo', 
    label: 'SEO-Optimierung',
    tooltip: 'Suchmaschinenoptimierung für bessere Sichtbarkeit in Google & Co.'
  },
  { 
    id: 'database', 
    label: 'Datenbank-Anbindung',
    tooltip: 'Verbindung zu bestehenden Datenbanken oder neue Datenbankstrukturen'
  },
  { 
    id: 'ai', 
    label: 'KI-Integration',
    tooltip: 'Künstliche Intelligenz für Chatbots, Empfehlungssysteme oder Automatisierung'
  },
  { 
    id: 'responsive', 
    label: 'Responsives Design',
    tooltip: 'Optimale Darstellung auf allen Geräten: Desktop, Tablet, Smartphone'
  },
  { 
    id: 'social', 
    label: 'Social-Media-Verknüpfung',
    tooltip: 'Integration von Social Media Feeds und Sharing-Funktionen'
  },
  { 
    id: 'payment', 
    label: 'Zahlungsmethoden',
    tooltip: 'Sichere Online-Zahlungen mit PayPal, Kreditkarte, SEPA & Co.'
  },
  { 
    id: 'analytics', 
    label: 'Nutzeranalyse & Tracking',
    tooltip: 'Google Analytics, Conversion-Tracking und detaillierte Besucherstatistiken'
  },
  { 
    id: 'domain', 
    label: 'Domainverwaltung',
    tooltip: 'Professionelle Domain-Einrichtung und DNS-Konfiguration'
  },
  { 
    id: 'strategy', 
    label: 'Strategieberatung',
    tooltip: 'Digitale Strategie, Zielgruppenanalyse und Wettbewerbsanalyse'
  },
  { 
    id: 'app', 
    label: 'App-Entwicklung',
    tooltip: 'Native oder Progressive Web Apps für iOS und Android'
  }
];

const subscriptionServices = [
  { 
    id: 'content', 
    label: 'Content-Pflege',
    tooltip: 'Regelmäßige Aktualisierung von Texten, Bildern und Inhalten'
  },
  { 
    id: 'newsletter', 
    label: 'Newsletter-Versand & Pflege',
    tooltip: 'Professionelle Newsletter-Erstellung, Versand und Analyse'
  },
  { 
    id: 'landingpage', 
    label: 'Landingpage-Erstellung (1x/Monat)',
    tooltip: 'Conversion-optimierte Landingpages für Kampagnen und Aktionen'
  },
  { 
    id: 'blog', 
    label: 'Blog-Pflege',
    tooltip: 'Regelmäßige Blogartikel, SEO-Optimierung und Community-Management'
  },
  { 
    id: 'domain_redirects', 
    label: 'Domainverwaltung & Umleitungen',
    tooltip: 'Professionelle Domain-Verwaltung, Weiterleitungen und DNS-Management'
  }
];

export default function PriceCalculator({ onPriceCalculated }: PriceCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pages: 1,
    services: [] as string[],
    express: false,
    subscription: [] as string[],
    specialRequirements: ''
  });
  const [result, setResult] = useState<{ price: string; details: string } | null>(null);

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, serviceId]
        : prev.services.filter(id => id !== serviceId)
    }));
  };

  const handleSubscriptionChange = (serviceId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      subscription: checked 
        ? [...prev.subscription, serviceId]
        : prev.subscription.filter(id => id !== serviceId)
    }));
  };

  const generatePrompt = () => {
    const selectedServices = services.filter(service => formData.services.includes(service.id));
    const selectedSubscriptions = subscriptionServices.filter(service => formData.subscription.includes(service.id));
    
    const additionalServices = selectedServices.length > 0 
      ? selectedServices.map(s => s.label).join(', ')
      : 'Keine zusätzlichen Leistungen ausgewählt';
    
    const ongoingServices = selectedSubscriptions.length > 0
      ? selectedSubscriptions.map(s => s.label).join(', ')
      : 'Keine laufenden Services ausgewählt';

    return `Du bist eine intelligente Webprojekt-KI, die Kunden bei der Preisabschätzung für professionelle Websites unterstützt. Analysiere die vom Kunden angegebenen Wünsche und gib einen geschätzten Preisrahmen in Euro aus, basierend auf Komplexität, Umfang und Zusatzleistungen.

Wichtige Regeln:
– Die Basiswebsite beginnt bei 300 €
– Mehr Seiten erhöhen den Preis moderat
– Express-Lieferung kostet +30 % Aufpreis
– Je mehr Leistungen ausgewählt werden, desto effizienter kann gearbeitet werden ⇒ kleine Mengenrabatte möglich
– Laufende Services bedeuten monatliche Zusatzkosten (nicht im Grundpreis enthalten)
– Alle Preise sind unverbindliche Schätzungen

Ziel: Der Kunde soll eine ehrliche und transparente Einschätzung bekommen – nicht zu hoch, aber auch nicht unter Wert.

⸻

Kundeneingaben
Seitenanzahl: ${formData.pages}

Zusätzliche Leistungen:
${additionalServices}

Laufende Services:
${ongoingServices}

Express-Lieferung gewünscht?
${formData.express ? 'Ja' : 'Nein'}

Besondere Wünsche / Anforderungen:
${formData.specialRequirements || 'Keine besonderen Wünsche angegeben'}

⸻

Bitte liefere als Antwort:
– Eine realistische Preisspanne in Euro (z. B. 750–950 €)
– Eine kurze Begründung (1–2 Sätze)
– Hinweis auf Beratungsgespräch für verbindliches Angebot`;
  };

  const calculateLocalPrice = () => {
    let basePrice = 300; // Basis-Website
    
    // Preis pro Seite (ab der 2. Seite)
    if (formData.pages > 1) {
      basePrice += (formData.pages - 1) * 50;
    }
    
    // Zusatzleistungen
    const selectedServices = services.filter(service => formData.services.includes(service.id));
    const servicePrices = {
      'seo': 150,
      'database': 200,
      'ai': 300,
      'responsive': 100,
      'social': 80,
      'payment': 120,
      'analytics': 90,
      'domain': 60,
      'strategy': 180,
      'app': 400
    };
    
    let servicesCost = 0;
    selectedServices.forEach(service => {
      servicesCost += servicePrices[service.id as keyof typeof servicePrices] || 0;
    });
    
    // Mengenrabatt für mehrere Leistungen
    if (selectedServices.length > 2) {
      servicesCost *= 0.9; // 10% Rabatt ab 3 Leistungen
    }
    
    // Express-Lieferung
    let totalPrice = basePrice + servicesCost;
    if (formData.express) {
      totalPrice *= 1.3; // +30% für Express
    }
    
    // Preisspanne (10% Variation)
    const variation = totalPrice * 0.1;
    const minPrice = Math.round(totalPrice - variation);
    const maxPrice = Math.round(totalPrice + variation);
    
    return {
      price: `${minPrice}–${maxPrice}€`,
      details: `Basierend auf ${formData.pages} Seiten und ${selectedServices.length} Zusatzleistungen. ${formData.express ? 'Express-Lieferung inklusive.' : ''}`
    };
  };

  const calculatePrice = async () => {
    setIsLoading(true);
    
    try {
      const prompt = generatePrompt();
      
      console.log('Sending API request with prompt:', prompt);
      
      const response = await fetch('/api/calculate-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        // Fallback zur lokalen Preisberechnung
        console.log('Using local price calculation as fallback');
        const localResult = calculateLocalPrice();
        setResult(localResult);
        onPriceCalculated?.(localResult.price, localResult.details);
        return;
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      const aiResponse = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || 'Preis konnte nicht berechnet werden';
      console.log('AI Response:', aiResponse);
      
      // Extract price range and details
      const priceMatch = aiResponse.match(/(\d+[-–]\d+€)/);
      const price = priceMatch ? priceMatch[1] : 'Preis auf Anfrage';
      const details = aiResponse.replace(priceMatch?.[0] || '', '').trim();
      
      const result = { price, details };
      setResult(result);
      onPriceCalculated?.(price, details);
      
    } catch (error) {
      console.error('Error calculating price:', error);
      
      // Fallback zur lokalen Preisberechnung
      console.log('Using local price calculation as fallback due to error');
      const localResult = calculateLocalPrice();
      setResult(localResult);
      onPriceCalculated?.(localResult.price, localResult.details);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            size="lg"
            className="w-full px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.background
            }}
          >
            <Calculator className="w-5 h-5" />
            <span>Preis kalkulieren</span>
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-8">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            {/* Upper section with light background */}
            <div className="p-8 sm:p-12" style={{ backgroundColor: `${colors.background}F0` }}>
              <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-center" style={{ color: colors.primary }}>
                Kalkuliere deinen individuellen Preis mit wenigen Klicks
              </h3>
              
              <div className="space-y-8">
                {/* Anzahl Seiten - Slider */}
                <div>
                  <label className="block text-lg font-semibold mb-4" style={{ color: colors.primary }}>
                    Anzahl der Seiten: <span className="font-bold" style={{ color: colors.secondary }}>{formData.pages}</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.pages}
                      onChange={(e) => setFormData(prev => ({ ...prev, pages: parseInt(e.target.value) }))}
                      className="flex-1 h-3 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${colors.secondary} 0%, ${colors.secondary} ${(formData.pages - 1) * 11.11}%, ${colors.tertiary} ${(formData.pages - 1) * 11.11}%, ${colors.tertiary} 100%)`
                      }}
                    />
                    <span className="text-lg font-bold min-w-[3rem] text-center" style={{ color: colors.secondary }}>
                      {formData.pages}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2" style={{ color: colors.primary }}>
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Leistungen */}
                <div>
                  <label className="block text-lg font-semibold mb-4" style={{ color: colors.primary }}>
                    Zusätzliche Leistungen
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <TooltipProvider key={service.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                              <Checkbox
                                id={service.id}
                                checked={formData.services.includes(service.id)}
                                onCheckedChange={(checked) => handleServiceChange(service.id, checked as boolean)}
                                className="w-5 h-5"
                              />
                              <label htmlFor={service.id} className="text-lg cursor-pointer flex-1" style={{ color: colors.primary }}>
                                {service.label}
                              </label>
                              <HelpCircle className="w-4 h-4 opacity-60" style={{ color: colors.secondary }} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{service.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>

                {/* Express-Lieferung */}
                <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-white/20 transition-colors">
                  <Checkbox
                    id="express"
                    checked={formData.express}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, express: checked as boolean }))}
                    className="w-5 h-5"
                  />
                  <label htmlFor="express" className="text-lg cursor-pointer" style={{ color: colors.primary }}>
                    Express-Lieferung
                  </label>
                </div>

                {/* Laufende Services */}
                <div>
                  <label className="block text-lg font-semibold mb-4" style={{ color: colors.primary }}>
                    Laufende Services (optional)
                  </label>
                  <div className="space-y-3">
                    {subscriptionServices.map((service) => (
                      <TooltipProvider key={service.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                              <Checkbox
                                id={service.id}
                                checked={formData.subscription.includes(service.id)}
                                onCheckedChange={(checked) => handleSubscriptionChange(service.id, checked as boolean)}
                                className="w-5 h-5"
                              />
                              <label htmlFor={service.id} className="text-lg cursor-pointer flex-1" style={{ color: colors.primary }}>
                                {service.label}
                              </label>
                              <HelpCircle className="w-4 h-4 opacity-60" style={{ color: colors.secondary }} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{service.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Wave transition */}
            <div className="relative h-8" style={{ backgroundColor: `${colors.background}F0` }}>
              <svg
                className="absolute bottom-0 w-full h-full"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                style={{ color: colors.primary }}
              >
                <path
                  d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z"
                  fill="currentColor"
                  fillOpacity="0.1"
                />
              </svg>
            </div>

            {/* Lower section with darker background */}
            <div className="p-8 sm:p-12" style={{ backgroundColor: `${colors.primary}F0` }}>
              <div className="space-y-8">
                {/* Individuelle Wünsche */}
                <div>
                  <label className="block text-lg font-semibold mb-4" style={{ color: colors.background }}>
                    Haben Sie besondere Wünsche oder Anforderungen (optional, nicht verpflichtend)?
                  </label>
                  <Textarea
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
                    placeholder="Welche Funktionen oder Strukturen sind Ihnen wichtig? Beispiele: Mitgliederbereich, Projektverwaltung, dynamischer Produktfilter, interne Datenbankpflege, mehrsprachige Inhalte."
                    className="w-full p-4 text-lg resize-none"
                    rows={4}
                    style={{ 
                      backgroundColor: `${colors.background}20`,
                      borderColor: colors.background,
                      color: colors.background
                    }}
                  />
                </div>

                {/* Standard-Leistungen Info */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.background}20` }}>
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: colors.tertiary }} />
                    <p className="text-sm" style={{ color: colors.background }}>
                      Diese Leistungen sind bei jeder Website automatisch enthalten: Hosting, Wartung, technischer Support, SEO-Grundoptimierung, Performance-Check und eine persönliche Quartalsberatung.
                    </p>
                  </div>
                </div>

                {/* Berechnen Button */}
                <Button
                  onClick={calculatePrice}
                  disabled={isLoading}
                  size="lg"
                  className="w-full px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                  style={{ 
                    backgroundColor: colors.tertiary,
                    color: colors.primary
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Berechne Preis...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5" />
                      Preis berechnen
                    </>
                  )}
                </Button>

                {/* Ergebnis */}
                {result && (
                  <div className="mt-8 p-6 rounded-xl border-2" 
                       style={{ 
                         backgroundColor: `${colors.tertiary}20`,
                         borderColor: colors.tertiary 
                       }}>
                    <h4 className="text-xl font-semibold mb-4" style={{ color: colors.tertiary }}>
                      Geschätzter Preis: {result.price}
                    </h4>
                    <p className="text-lg mb-4" style={{ color: colors.background }}>
                      {result.details}
                    </p>
                    {formData.subscription.length > 0 && (
                      <p className="text-lg font-medium mb-4" style={{ color: colors.tertiary }}>
                        +200€/Monat für laufende Services
                      </p>
                    )}
                    <p className="text-sm" style={{ color: colors.background }}>
                      Dies ist ein Richtwert. Im Beratungsgespräch klären wir alle Details und finden eine Lösung, die zu Ihrem Budget passt.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
} 