'use client';

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

const webseitenZieleOptions = [
  'Neukunden',
  'Vertrauen',
  'Produkte erklären',
  'Online verkaufen',
  'Terminbuchung',
  'anderes',
];
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
const kommunikationswegOptions = [
  'E-Mail',
  'Telefon',
  'WhatsApp',
  'Videocall',
];

// Zod schema for all steps (fields optional, step validation below)
const fullSchema = z.object({
  // Step 1
  firma: z.string().min(1, 'Pflichtfeld'),
  beschreibung: z.string().min(1, 'Pflichtfeld'),
  zielgruppe: z.string().min(1, 'Pflichtfeld'),
  website_vorhanden: z.boolean(),
  stilvorbilder: z.string().optional(),
  was_gefaellt_gefaellt_nicht: z.string().optional(),
  // Step 2
  ziel_der_website: z.array(z.string()).min(1, 'Bitte mindestens ein Ziel auswählen'),
  // Step 3
  seiten_geplant: z.array(z.string()).min(1, 'Mindestens eine Seite angeben'),
  texte_bilder_vorhanden: z.boolean(),
  fokus_inhalte: z.string().optional(),
  // Step 4
  logo_farben_vorhanden: z.boolean(),
  design_wunsch: z.string().min(1, 'Bitte Stilrichtung wählen'),
  beispiellinks: z.string().optional(),
  // Step 5
  features_gewuenscht: z.array(z.string()).min(1, 'Mindestens eine Funktion wählen'),
  drittanbieter: z.array(z.string()).optional(),
  // Step 6
  selbst_pflegen: z.boolean(),
  laufende_betreuung: z.boolean(),
  // Step 7
  deadline: z.string().min(1, 'Bitte Datum wählen'),
  projekt_verantwortlich: z.string().min(1, 'Pflichtfeld'),
  budget: z.string().optional(),
  // Step 8
  kommunikationsweg: z.array(z.string()).min(1, 'Mindestens einen Weg wählen'),
  feedback_geschwindigkeit: z.string().optional(),
});
type FullFormType = z.infer<typeof fullSchema>;

const stepFieldMap: Record<number, (keyof FullFormType)[]> = {
  0: [
    'firma',
    'beschreibung',
    'zielgruppe',
    'website_vorhanden',
    'stilvorbilder',
    'was_gefaellt_gefaellt_nicht',
  ],
  1: ['ziel_der_website'],
  2: ['seiten_geplant', 'texte_bilder_vorhanden', 'fokus_inhalte'],
  3: ['logo_farben_vorhanden', 'design_wunsch', 'beispiellinks'],
  4: ['features_gewuenscht', 'drittanbieter'],
  5: ['selbst_pflegen', 'laufende_betreuung'],
  6: ['deadline', 'projekt_verantwortlich', 'budget'],
  7: ['kommunikationsweg', 'feedback_geschwindigkeit'],
};

export default function CustomerStepperForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<FullFormType>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      firma: '',
      beschreibung: '',
      zielgruppe: '',
      website_vorhanden: false,
      stilvorbilder: '',
      was_gefaellt_gefaellt_nicht: '',
      ziel_der_website: [],
      seiten_geplant: [],
      texte_bilder_vorhanden: false,
      fokus_inhalte: '',
      logo_farben_vorhanden: false,
      design_wunsch: '',
      beispiellinks: '',
      features_gewuenscht: [],
      drittanbieter: [],
      selbst_pflegen: false,
      laufende_betreuung: false,
      deadline: '',
      projekt_verantwortlich: '',
      budget: '',
      kommunikationsweg: [],
      feedback_geschwindigkeit: '',
    },
    mode: 'onChange',
  });

  async function nextStep() {
    // Validate only fields for this step
    const fields = stepFieldMap[currentStep];
    const valid = await methods.trigger(fields as any);
    if (valid) setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function prevStep() {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmitAll() {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const data = methods.getValues();
      console.log('Form data:', data);
      
      // Convert arrays to comma-separated strings for Supabase
      const processedData = {
        ...data,
        // Convert checkbox arrays to comma-separated strings
        ziel_der_website: Array.isArray(data.ziel_der_website) 
          ? data.ziel_der_website.join(', ') 
          : data.ziel_der_website,
        seiten_geplant: Array.isArray(data.seiten_geplant) 
          ? data.seiten_geplant.join(', ') 
          : data.seiten_geplant,
        features_gewuenscht: Array.isArray(data.features_gewuenscht) 
          ? data.features_gewuenscht.join(', ') 
          : data.features_gewuenscht,
        drittanbieter: Array.isArray(data.drittanbieter) 
          ? data.drittanbieter.join(', ') 
          : data.drittanbieter,
        kommunikationsweg: Array.isArray(data.kommunikationsweg) 
          ? data.kommunikationsweg.join(', ') 
          : data.kommunikationsweg,
      };
      
      console.log('Processed data for Supabase:', processedData);
      
      const { error } = await supabase.from('kunden_projekte').insert([processedData]);
      if (error) {
        console.error('Supabase error:', error);
        setSubmitError('Fehler beim Speichern: ' + error.message);
      } else {
        setSubmitSuccess(true);
      }
    } catch (e: any) {
      console.error('Unexpected error:', e);
      setSubmitError('Unbekannter Fehler: ' + (e.message || e.toString()));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...methods}>
      {/* Stepper Progress */}
      <div className="mb-8">
        {/* Desktop Stepper - Horizontal */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.title} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mb-1 ${idx === currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}>{idx + 1}</div>
              <span className={`text-xs text-center ${idx === currentStep ? 'font-semibold text-blue-700' : 'text-gray-500'}`}>{step.title}</span>
              {idx < steps.length - 1 && <div className="h-1 w-full bg-gray-200 mt-2" />}
            </div>
          ))}
        </div>

        {/* Mobile Stepper - Vertical */}
        <div className="md:hidden">
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mb-2 mx-auto ${currentStep === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                {currentStep + 1}
              </div>
              <span className={`text-sm font-medium ${currentStep === 0 ? 'text-blue-700' : 'text-gray-500'}`}>
                {steps[currentStep].title}
              </span>
            </div>
          </div>
          
          {/* Mobile Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          
          {/* Mobile Step Indicator */}
          <div className="flex justify-center space-x-1">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Step Content */}
      <div className="mb-8">
        {currentStep === 0 && (
          <div className="space-y-4">
            <FormField name="firma" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">Unternehmensname *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="z.B. Webklar GmbH" className="text-sm md:text-base py-3 md:py-2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="beschreibung" render={({ field }) => (
              <FormItem>
                <FormLabel>Kurzbeschreibung *</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Was macht das Unternehmen?" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="zielgruppe" render={({ field }) => (
              <FormItem>
                <FormLabel>Zielgruppe *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Wer soll angesprochen werden?" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="website_vorhanden" render={({ field }) => (
              <FormItem>
                <FormLabel>Bestehende Website?</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormDescription>Gibt es bereits eine Website?</FormDescription>
              </FormItem>
            )} />
            {methods.watch('website_vorhanden') && (
              <FormField name="stilvorbilder" render={({ field }) => (
                <FormItem>
                  <FormLabel>Link zur bestehenden Website</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}
            <FormField name="was_gefaellt_gefaellt_nicht" render={({ field }) => (
              <FormItem>
                <FormLabel>Was gefällt/gefällt nicht an der alten Website?</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Stärken und Schwächen der aktuellen Seite" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        )}
        {currentStep === 1 && (
          <div className="space-y-4">
            <FormField name="ziel_der_website" render={({ field }) => (
              <FormItem>
                <FormLabel>Ziele der Website *</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-3">
                  {webseitenZieleOptions.map((ziel) => (
                    <label key={ziel} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
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
                        className="accent-blue-600 w-4 h-4"
                      />
                      <span className="text-sm md:text-base">{ziel}</span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        )}
        {currentStep === 2 && (
          <div className="space-y-4">
            <FormField name="seiten_geplant" render={({ field }) => (
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
            )} />
            <FormField name="texte_bilder_vorhanden" render={({ field }) => (
              <FormItem>
                <FormLabel>Texte/Bilder vorhanden?</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="fokus_inhalte" render={({ field }) => (
              <FormItem>
                <FormLabel>Fokus-Inhalte (optional)</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Wichtige Schwerpunkte" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        )}
        {currentStep === 3 && (
          <div className="space-y-4">
            <FormField name="logo_farben_vorhanden" render={({ field }) => (
              <FormItem>
                <FormLabel>Logo/Farben vorhanden?</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="design_wunsch" render={({ field }) => (
              <FormItem>
                <FormLabel>Design-Wunsch *</FormLabel>
                <select {...field} className="w-full border rounded px-2 py-1">
                  <option value="">Bitte wählen</option>
                  {stilrichtungOptions.map((stil) => (
                    <option key={stil} value={stil}>{stil}</option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="beispiellinks" render={({ field }) => (
              <FormItem>
                <FormLabel>Beispiellinks (optional, mehrere möglich)</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Eine URL pro Zeile" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        )}
        {currentStep === 4 && (
          <div className="space-y-4">
            <FormField name="features_gewuenscht" render={({ field }) => (
              <FormItem>
                <FormLabel>Gewünschte Features *</FormLabel>
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
            )} />
            <FormField name="drittanbieter" render={({ field }) => (
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
            )} />
          </div>
        )}
        {currentStep === 5 && (
          <div className="space-y-4">
            <FormField name="selbst_pflegen" render={({ field }) => (
              <FormItem>
                <FormLabel>Selbst pflegen?</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="laufende_betreuung" render={({ field }) => (
              <FormItem>
                <FormLabel>Laufende Betreuung erwünscht?</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        )}
        {currentStep === 6 && (
          <div className="space-y-4">
            <FormField name="deadline" render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline *</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="projekt_verantwortlich" render={({ field }) => (
              <FormItem>
                <FormLabel>Projektverantwortlicher Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="budget" render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="z.B. 5.000–10.000 €" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        )}
        {currentStep === 7 && !submitSuccess && (
          <>
            <div className="space-y-4">
              <FormField name="kommunikationsweg" render={({ field }) => (
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
              )} />
              <FormField name="feedback_geschwindigkeit" render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback-Geschwindigkeit (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="z.B. innerhalb von 24h" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="flex flex-col items-center justify-center min-h-[80px] mt-6">
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
          </>
        )}
        {submitSuccess && (
          <div className="flex flex-col items-center justify-center min-h-[120px]">
            <span className="text-green-700 font-bold text-lg mb-2">Kunde erfolgreich angelegt!</span>
            <span className="text-gray-500">Du kannst das Fenster jetzt schließen oder einen neuen Kunden anlegen.</span>
          </div>
        )}
      </div>
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          className="px-4 py-3 md:px-6 md:py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-all duration-200 text-sm md:text-base font-medium"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Zurück
        </button>
        {currentStep < steps.length - 1 && (
          <button
            type="button"
            className="px-4 py-3 md:px-6 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 text-sm md:text-base font-medium"
            onClick={nextStep}
          >
            Weiter
          </button>
        )}
      </div>
    </Form>
  );
} 