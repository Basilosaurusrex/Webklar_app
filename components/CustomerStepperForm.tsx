import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabaseClient';

const steps = [
  { title: 'Unternehmen & Zielgruppe' },
  { title: 'Ziel der Website' },
  { title: 'Inhalte & Struktur' },
  { title: 'Design & Stil' },
  { title: 'Technische Funktionen' },
  { title: 'Pflege & Support' },
  { title: 'Projektzeit & Ansprechpartner' },
  { title: 'Kommunikation & Zusammenarbeit' },
];

const Step1Schema = z.object({
  unternehmens_name: z.string().min(1, 'Pflichtfeld'),
  kurzbeschreibung: z.string().min(1, 'Pflichtfeld'),
  zielgruppe: z.string().min(1, 'Pflichtfeld'),
  unterscheidung_von_konkurrenz: z.string().optional(),
  bestehende_website: z.boolean(),
  bestehende_website_link: z.string().url('Ungültige URL').optional().or(z.literal('')),
  was_gefaellt_an_alter_webseite: z.string().optional(),
  was_gefaellt_nicht: z.string().optional(),
});

type Step1Type = z.infer<typeof Step1Schema>;

const Step2Schema = z.object({
  webseiten_ziele: z.array(z.string()).min(1, 'Bitte mindestens ein Ziel auswählen'),
  konkrete_kennzahlen: z.string().optional(),
});

type Step2Type = z.infer<typeof Step2Schema>;

const webseitenZieleOptions = [
  'Neukunden',
  'Vertrauen',
  'Produkte erklären',
  'Online verkaufen',
  'Terminbuchung',
  'anderes',
];

// Step 3: Inhalte & Struktur
const Step3Schema = z.object({
  geplante_seiten: z.array(z.string()).min(1, 'Mindestens eine Seite angeben'),
  texte_vorhanden: z.boolean(),
  bilder_vorhanden: z.boolean(),
  fokus_inhalte: z.string().optional(),
});
type Step3Type = z.infer<typeof Step3Schema>;
const geplanteSeitenOptions = [
  'Start',
  'Über uns',
  'Leistungen',
  'Referenzen',
  'Kontakt',
  'Impressum',
  'Datenschutz',
  'Blog',
  'Karriere',
  'FAQ',
  'Sonstiges',
];

// Step 4: Design & Stil
const Step4Schema = z.object({
  logo_vorhanden: z.boolean(),
  farben_schriftwuensche: z.string().optional(),
  stilrichtung: z.string().min(1, 'Bitte Stilrichtung wählen'),
  beispiellinks: z.array(z.string().url('Ungültige URL')).optional(),
});
type Step4Type = z.infer<typeof Step4Schema>;
const stilrichtungOptions = [
  'modern',
  'klassisch',
  'verspielt',
  'minimalistisch',
  'technisch',
  'kreativ',
  'seriös',
  'freundlich',
  'exklusiv',
  'andere',
];

// Step 5: Technische Funktionen
const Step5Schema = z.object({
  benoetigte_funktionen: z.array(z.string()).min(1, 'Mindestens eine Funktion wählen'),
  drittanbieter: z.array(z.string()).optional(),
});
type Step5Type = z.infer<typeof Step5Schema>;
const funktionenOptions = [
  'Kontaktformular',
  'Shop',
  'Terminbuchung',
  'Newsletter',
  'Blog',
  'Kalender',
  'Benutzerverwaltung',
  'andere',
];
const drittanbieterOptions = [
  'Stripe',
  'Supabase',
  'Google Ads',
  'Google Analytics',
  'Mailchimp',
  'andere',
];

// Step 6: Pflege & Support
const Step6Schema = z.object({
  selbst_pflegen: z.boolean(),
  support_erwuenscht: z.boolean(),
  seo_betreuung: z.boolean().optional(),
});
type Step6Type = z.infer<typeof Step6Schema>;

// Step 7: Projektzeit & Ansprechpartner
const Step7Schema = z.object({
  go_live_wunschdatum: z.string().min(1, 'Bitte Datum wählen'),
  projektverantwortlicher_name: z.string().min(1, 'Pflichtfeld'),
  projektverantwortlicher_kontakt: z.string().min(1, 'Pflichtfeld'),
  budgetrahmen: z.string().optional(),
});
type Step7Type = z.infer<typeof Step7Schema>;

// Step 8: Kommunikation & Zusammenarbeit
const Step8Schema = z.object({
  kommunikationsweg: z.array(z.string()).min(1, 'Mindestens einen Weg wählen'),
  reaktionszeit_erwartung: z.string().optional(),
});
type Step8Type = z.infer<typeof Step8Schema>;
const kommunikationswegOptions = [
  'E-Mail',
  'Telefon',
  'WhatsApp',
  'Videocall',
];

export default function CustomerStepperForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWebsiteLink, setShowWebsiteLink] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Type | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<Step1Type>({
    resolver: zodResolver(Step1Schema),
    defaultValues: {
      unternehmens_name: '',
      kurzbeschreibung: '',
      zielgruppe: '',
      unterscheidung_von_konkurrenz: '',
      bestehende_website: false,
      bestehende_website_link: '',
      was_gefaellt_an_alter_webseite: '',
      was_gefaellt_nicht: '',
    },
    mode: 'onChange',
  });

  const step2Methods = useForm<Step2Type>({
    resolver: zodResolver(Step2Schema),
    defaultValues: {
      webseiten_ziele: [],
      konkrete_kennzahlen: '',
    },
    mode: 'onChange',
  });

  // Add useForm hooks for each step
  const step3Methods = useForm<Step3Type>({
    resolver: zodResolver(Step3Schema),
    defaultValues: {
      geplante_seiten: [],
      texte_vorhanden: false,
      bilder_vorhanden: false,
      fokus_inhalte: '',
    },
    mode: 'onChange',
  });
  const step4Methods = useForm<Step4Type>({
    resolver: zodResolver(Step4Schema),
    defaultValues: {
      logo_vorhanden: false,
      farben_schriftwuensche: '',
      stilrichtung: '',
      beispiellinks: [],
    },
    mode: 'onChange',
  });
  const step5Methods = useForm<Step5Type>({
    resolver: zodResolver(Step5Schema),
    defaultValues: {
      benoetigte_funktionen: [],
      drittanbieter: [],
    },
    mode: 'onChange',
  });
  const step6Methods = useForm<Step6Type>({
    resolver: zodResolver(Step6Schema),
    defaultValues: {
      selbst_pflegen: false,
      support_erwuenscht: false,
      seo_betreuung: false,
    },
    mode: 'onChange',
  });
  const step7Methods = useForm<Step7Type>({
    resolver: zodResolver(Step7Schema),
    defaultValues: {
      go_live_wunschdatum: '',
      projektverantwortlicher_name: '',
      projektverantwortlicher_kontakt: '',
      budgetrahmen: '',
    },
    mode: 'onChange',
  });
  const step8Methods = useForm<Step8Type>({
    resolver: zodResolver(Step8Schema),
    defaultValues: {
      kommunikationsweg: [],
      reaktionszeit_erwartung: '',
    },
    mode: 'onChange',
  });

  const nextStep = async () => {
    if (currentStep === 0) {
      const valid = await methods.trigger();
      if (valid) {
        setStep1Data(methods.getValues());
        setCurrentStep(1);
      }
    } else if (currentStep === 1) {
      const valid = await step2Methods.trigger();
      if (valid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const valid = await step3Methods.trigger();
      if (valid) setCurrentStep(3);
    } else if (currentStep === 3) {
      const valid = await step4Methods.trigger();
      if (valid) setCurrentStep(4);
    } else if (currentStep === 4) {
      const valid = await step5Methods.trigger();
      if (valid) setCurrentStep(5);
    } else if (currentStep === 5) {
      const valid = await step6Methods.trigger();
      if (valid) setCurrentStep(6);
    } else if (currentStep === 6) {
      const valid = await step7Methods.trigger();
      if (valid) setCurrentStep(7);
    } else if (currentStep === 7) {
      const valid = await step8Methods.trigger();
      if (valid) setCurrentStep(8);
    }
  };
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  async function handleSubmitAll() {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Collect all data from all steps
      const data = {
        ...methods.getValues(),
        ...step2Methods.getValues(),
        ...step3Methods.getValues(),
        ...step4Methods.getValues(),
        ...step5Methods.getValues(),
        ...step6Methods.getValues(),
        ...step7Methods.getValues(),
        ...step8Methods.getValues(),
      };
      // Special handling for beispiellinks (split by line if string, else use as array)
      if (data.beispiellinks) {
        if (typeof data.beispiellinks === 'string') {
          data.beispiellinks = (data.beispiellinks as string)
            .split('\n')
            .map((l: string) => l.trim())
            .filter((l: string) => l.length > 0);
        } else if (Array.isArray(data.beispiellinks)) {
          data.beispiellinks = data.beispiellinks.filter((l: string) => l.length > 0);
        }
      }
      // Insert into Supabase
      const { error } = await supabase.from('kunden_projekte').insert([data]);
      if (error) {
        setSubmitError('Fehler beim Speichern: ' + error.message);
      } else {
        setSubmitSuccess(true);
      }
    } catch (e: any) {
      setSubmitError('Unbekannter Fehler: ' + (e.message || e.toString()));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Stepper Progress */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, idx) => (
          <div key={step.title} className="flex-1 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mb-1 ${idx === currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}>{idx + 1}</div>
            <span className={`text-xs text-center ${idx === currentStep ? 'font-semibold text-blue-700' : 'text-gray-500'}`}>{step.title}</span>
            {idx < steps.length - 1 && <div className="h-1 w-full bg-gray-200 mt-2" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {currentStep === 0 && (
          <div className="space-y-4">
            <FormField
              name="unternehmens_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unternehmensname *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="z.B. Webklar GmbH" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="kurzbeschreibung"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kurzbeschreibung *</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Was macht das Unternehmen?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="zielgruppe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zielgruppe *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Wer soll angesprochen werden?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="unterscheidung_von_konkurrenz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unterscheidung von Konkurrenz</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Was macht das Unternehmen besonders?" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="bestehende_website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bestehende Website?</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setShowWebsiteLink(checked);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Gibt es bereits eine Website?</FormDescription>
                </FormItem>
              )}
            />
            {methods.watch('bestehende_website') && (
              <FormField
                name="bestehende_website_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link zur bestehenden Website</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              name="was_gefaellt_an_alter_webseite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Was gefällt an der alten Website?</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Stärken der aktuellen Seite" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="was_gefaellt_nicht"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Was gefällt nicht?</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Schwächen der aktuellen Seite" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        {currentStep === 1 && (
          <Form {...step2Methods}>
            <div className="space-y-4">
              <FormField
                name="webseiten_ziele"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ziele der Website *</FormLabel>
                    <div className="flex flex-wrap gap-3">
                      {webseitenZieleOptions.map((ziel) => (
                        <label key={ziel} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            value={ziel}
                            checked={field.value?.includes(ziel)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...(field.value || []), ziel]);
                              } else {
                                field.onChange((field.value || []).filter((v: string) => v !== ziel));
                              }
                            }}
                            className="accent-blue-600"
                          />
                          <span>{ziel}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="konkrete_kennzahlen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konkrete Kennzahlen (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="z.B. 100 neue Leads/Monat" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        )}
        {currentStep === 2 && (
          <Form {...step3Methods}>
            <div className="space-y-4">
              <FormField
                name="geplante_seiten"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geplante Seiten *</FormLabel>
                    <div className="flex flex-wrap gap-3">
                      {geplanteSeitenOptions.map((seite) => (
                        <label key={seite} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            value={seite}
                            checked={field.value?.includes(seite)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...(field.value || []), seite]);
                              } else {
                                field.onChange((field.value || []).filter((v: string) => v !== seite));
                              }
                            }}
                            className="accent-blue-600"
                          />
                          <span>{seite}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="texte_vorhanden"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texte vorhanden?</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bilder_vorhanden"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bilder vorhanden?</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="fokus_inhalte"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fokus-Inhalte (optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Wichtige Schwerpunkte" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        )}
        {currentStep === 3 && (
          <Form {...step4Methods}>
            <div className="space-y-4">
              <FormField
                name="logo_vorhanden"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo vorhanden?</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="farben_schriftwuensche"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farben/Schriftwünsche (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="z.B. Blau, modern, serifenlos" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="stilrichtung"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stilrichtung *</FormLabel>
                    <select {...field} className="w-full border rounded px-2 py-1">
                      <option value="">Bitte wählen</option>
                      {stilrichtungOptions.map((stil) => (
                        <option key={stil} value={stil}>{stil}</option>
                      ))}
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="beispiellinks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beispiellinks (optional, mehrere möglich)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Eine URL pro Zeile" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        )}
        {currentStep === 4 && (
          <Form {...step5Methods}>
            <div className="space-y-4">
              <FormField
                name="benoetigte_funktionen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benötigte Funktionen *</FormLabel>
                    <div className="flex flex-wrap gap-3">
                      {funktionenOptions.map((fkt) => (
                        <label key={fkt} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            value={fkt}
                            checked={field.value?.includes(fkt)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...(field.value || []), fkt]);
                              } else {
                                field.onChange((field.value || []).filter((v: string) => v !== fkt));
                              }
                            }}
                            className="accent-blue-600"
                          />
                          <span>{fkt}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="drittanbieter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drittanbieter (optional)</FormLabel>
                    <div className="flex flex-wrap gap-3">
                      {drittanbieterOptions.map((anbieter) => (
                        <label key={anbieter} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            value={anbieter}
                            checked={field.value?.includes(anbieter)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...(field.value || []), anbieter]);
                              } else {
                                field.onChange((field.value || []).filter((v: string) => v !== anbieter));
                              }
                            }}
                            className="accent-blue-600"
                          />
                          <span>{anbieter}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        )}
        {currentStep === 5 && (
          <Form {...step6Methods}>
            <div className="space-y-4">
              <FormField
                name="selbst_pflegen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selbst pflegen?</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="support_erwuenscht"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support erwünscht?</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="seo_betreuung"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SEO-Betreuung (optional)</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        )}
        {currentStep === 6 && (
          <Form {...step7Methods}>
            <div className="space-y-4">
              <FormField
                name="go_live_wunschdatum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Go-Live Wunschdatum *</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="projektverantwortlicher_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projektverantwortlicher Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="projektverantwortlicher_kontakt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projektverantwortlicher Kontakt *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E-Mail oder Telefon" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="budgetrahmen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budgetrahmen (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="z.B. 5.000–10.000 €" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        )}
        {currentStep === 7 && (
          <Form {...step8Methods}>
            <div className="space-y-4">
              <FormField
                name="kommunikationsweg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kommunikationsweg *</FormLabel>
                    <div className="flex flex-wrap gap-3">
                      {kommunikationswegOptions.map((weg) => (
                        <label key={weg} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            value={weg}
                            checked={field.value?.includes(weg)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...(field.value || []), weg]);
                              } else {
                                field.onChange((field.value || []).filter((v: string) => v !== weg));
                              }
                            }}
                            className="accent-blue-600"
                          />
                          <span>{weg}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="reaktionszeit_erwartung"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reaktionszeit-Erwartung (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="z.B. innerhalb von 24h" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        )}
        {currentStep > 7 && !submitSuccess && (
          <div className="flex flex-col items-center justify-center min-h-[120px]">
            <span className="text-green-600 font-semibold mb-4">Alle Daten eingegeben!</span>
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={handleSubmitAll}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Speichern ...' : 'Daten speichern & Projekt anlegen'}
            </button>
            {submitError && <div className="text-red-600 mt-4">{submitError}</div>}
          </div>
        )}
        {submitSuccess && (
          <div className="flex flex-col items-center justify-center min-h-[120px]">
            <span className="text-green-700 font-bold text-lg mb-2">Kunde erfolgreich angelegt!</span>
            <span className="text-gray-500">Du kannst das Fenster jetzt schließen oder einen neuen Kunden anlegen.</span>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Zurück
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={nextStep}
          disabled={currentStep !== 0 && currentStep === steps.length - 1}
        >
          Weiter
        </button>
      </div>
    </>
  );
} 