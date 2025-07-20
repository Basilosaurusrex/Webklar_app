"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { 
  Building, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Target, 
  Globe, 
  Palette, 
  Settings, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  ArrowLeft,
  Save,
  Eye,
  Edit,
  Users,
  TrendingUp,
  Zap,
  Star
} from 'lucide-react';

interface Customer {
  id: string;
  berater?: string;
  firma?: string;
  ansprechpartn?: string;
  telefon?: string;
  email?: string;
  beschreibung?: string;
  zielgruppe?: string;
  website_vorha?: boolean;
  was_gefaellt_c?: string;
  ziel_der_websi?: string;
  seiten_geplant?: string;
  texte_bilder_v?: boolean;
  fokus_inhalte?: string;
  logo_farben_v?: boolean;
  stilvorbilder?: string;
  design_wunsch?: string;
  features_gewu?: string;
  drittanbieter?: string;
  selbst_pflegen?: boolean;
  laufende_betre?: boolean;
  deadline?: string;
  projekt_verant?: string;
  budget?: string;
  kommunikation?: string;
  feedback_gesc?: string;
  beispiellinks?: string;
  benoetigte_fur?: string;
  webseiten_ziel?: string;
  geplante_seite?: string;
  termin_datum?: string;
  erstellt_am: string;
  appointment_status?: 'pending' | 'running' | 'completed';
  started_by?: string;
  started_at?: string;
}

interface CustomerDetailPageProps {
  params: {
    id: string;
  };
}



export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    fetchCustomer();
  }, [params.id]);

  const fetchCustomer = async () => {
    try {
      console.log('🔍 Fetching customer details:', params.id);
      
      const { data, error } = await supabase
        .from('kunden_projekte')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('❌ Error fetching customer:', error);
        return;
      }

      console.log('✅ Customer details fetched:', data);
      setCustomer(data);
      setFormData(data);
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (status: 'pending' | 'running' | 'completed') => {
    try {
      console.log(`🔄 Updating appointment status to ${status}`);
      
      const updateData: any = { appointment_status: status };
      
      if (status === 'running') {
        updateData.started_by = 'admin@example.com';
        updateData.started_at = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('kunden_projekte')
        .update(updateData)
        .eq('id', params.id);

      if (error) {
        console.error('❌ Error updating status:', error);
        return;
      }

      console.log('✅ Status updated successfully');
      fetchCustomer();
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  const saveCustomerData = async () => {
    setSaving(true);
    try {
      console.log('💾 Saving customer data:', formData);
      
      const { error } = await supabase
        .from('kunden_projekte')
        .update(formData)
        .eq('id', params.id);

      if (error) {
        console.error('❌ Error updating customer:', error);
        return;
      }

      console.log('✅ Customer updated successfully');
      fetchCustomer();
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusBadge = (status: string, startedBy?: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Termin wartet
          </Badge>
        );
      case 'running':
        return (
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-500 flex items-center gap-1">
              <Play className="w-3 h-3" />
              Termin läuft
            </Badge>
            {startedBy && (
              <span className="text-sm text-gray-600">({startedBy})</span>
            )}
          </div>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Termin abgeschlossen
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Termin wartet
          </Badge>
        );
    }
  };

  const getCompletionStatus = () => {
    if (!customer) return { percentage: 0, filledFields: 0, totalFields: 0 };
    
    const fields = [
      customer.firma, customer.ansprechpartn, customer.telefon, customer.email,
      customer.beschreibung, customer.zielgruppe, customer.ziel_der_websi,
      customer.seiten_geplant, customer.fokus_inhalte, customer.design_wunsch,
      customer.features_gewu, customer.budget, customer.deadline
    ];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    const totalFields = fields.length;
    const percentage = Math.round((filledFields / totalFields) * 100);
    
    return { filledFields, totalFields, percentage };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Kunden-Projekt</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Lade Projektdaten...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Projekt nicht gefunden</h1>
            <p className="text-gray-600 mb-6">Das angeforderte Projekt konnte nicht gefunden werden.</p>
            <Button 
              onClick={() => router.push('/kunden-projekte')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Übersicht
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const completion = getCompletionStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/kunden-projekte')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Zurück
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {customer.ansprechpartn || customer.firma || 'Unbekannter Kunde'}
                  </h1>
                  <p className="text-gray-600">
                    {customer.firma && customer.ansprechpartn ? `${customer.firma} - ${customer.ansprechpartn}` : customer.firma || customer.ansprechpartn}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {getStatusBadge(customer.appointment_status || 'pending', customer.started_by)}
              {customer.appointment_status === 'pending' && (
                <Button 
                  onClick={() => updateAppointmentStatus('running')}
                  className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Termin starten
                </Button>
              )}
              {customer.appointment_status === 'running' && (
                <Button 
                  onClick={() => updateAppointmentStatus('completed')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Termin beenden
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="bg-white/80 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Befragung Fortschritt</h3>
                <span className="text-sm font-medium text-gray-600">{completion.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    completion.percentage >= 80 ? 'bg-green-500' :
                    completion.percentage >= 50 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${completion.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {completion.filledFields} von {completion.totalFields} Feldern ausgefüllt
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Übersicht', icon: Eye },
            { id: 'contact', label: 'Kontaktdaten', icon: User },
            { id: 'project', label: 'Projektinfo', icon: FileText },
            { id: 'design', label: 'Design & Features', icon: Palette },
            { id: 'technical', label: 'Technische Details', icon: Settings },
            { id: 'timeline', label: 'Zeitplan & Budget', icon: Calendar }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeSection === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveSection(tab.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid gap-6">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="grid gap-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Projektübersicht
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Firma</Label>
                      <p className="text-gray-800">{customer.firma || 'Nicht angegeben'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Ansprechpartner</Label>
                      <p className="text-gray-800">{customer.ansprechpartn || 'Nicht angegeben'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">E-Mail</Label>
                      <p className="text-gray-800">{customer.email || 'Nicht angegeben'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Telefon</Label>
                      <p className="text-gray-800">{customer.telefon || 'Nicht angegeben'}</p>
                    </div>
                  </div>
                  
                  {customer.beschreibung && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Projektbeschreibung</Label>
                      <p className="text-gray-800">{customer.beschreibung}</p>
                    </div>
                  )}
                  
                  {customer.termin_datum && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600">Termin</Label>
                      <p className="text-gray-800">{new Date(customer.termin_datum).toLocaleString('de-DE')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Contact Section */}
          {activeSection === 'contact' && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Kontaktdaten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firma">Firma *</Label>
                    <Input
                      id="firma"
                      value={formData.firma || ''}
                      onChange={(e) => handleInputChange('firma', e.target.value)}
                      placeholder="Firmenname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ansprechpartn">Ansprechpartner *</Label>
                    <Input
                      id="ansprechpartn"
                      value={formData.ansprechpartn || ''}
                      onChange={(e) => handleInputChange('ansprechpartn', e.target.value)}
                      placeholder="Name des Ansprechpartners"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@beispiel.de"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefon">Telefon</Label>
                    <Input
                      id="telefon"
                      type="tel"
                      value={formData.telefon || ''}
                      onChange={(e) => handleInputChange('telefon', e.target.value)}
                      placeholder="+49 123 456789"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Section */}
          {activeSection === 'project' && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Projektinformationen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="beschreibung">Projektbeschreibung *</Label>
                  <Textarea
                    id="beschreibung"
                    value={formData.beschreibung || ''}
                    onChange={(e) => handleInputChange('beschreibung', e.target.value)}
                    placeholder="Beschreiben Sie Ihr Projekt, Ihre Ziele und Anforderungen..."
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zielgruppe">Zielgruppe</Label>
                    <Input
                      id="zielgruppe"
                      value={formData.zielgruppe || ''}
                      onChange={(e) => handleInputChange('zielgruppe', e.target.value)}
                      placeholder="Ihre Zielgruppe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ziel_der_websi">Ziel der Website</Label>
                    <Input
                      id="ziel_der_websi"
                      value={formData.ziel_der_websi || ''}
                      onChange={(e) => handleInputChange('ziel_der_websi', e.target.value)}
                      placeholder="Hauptziel der Website"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seiten_geplant">Geplante Seiten</Label>
                  <Input
                    id="seiten_geplant"
                    value={formData.seiten_geplant || ''}
                    onChange={(e) => handleInputChange('seiten_geplant', e.target.value)}
                    placeholder="z.B. Home, Über uns, Kontakt, Blog..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Design Section */}
          {activeSection === 'design' && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Design & Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="design_wunsch">Design-Wünsche</Label>
                  <Textarea
                    id="design_wunsch"
                    value={formData.design_wunsch || ''}
                    onChange={(e) => handleInputChange('design_wunsch', e.target.value)}
                    placeholder="Beschreiben Sie Ihre Design-Vorstellungen..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stilvorbilder">Stilvorbilder</Label>
                  <Input
                    id="stilvorbilder"
                    value={formData.stilvorbilder || ''}
                    onChange={(e) => handleInputChange('stilvorbilder', e.target.value)}
                    placeholder="Websites die Ihnen gefallen"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="features_gewu">Gewünschte Features</Label>
                  <Textarea
                    id="features_gewu"
                    value={formData.features_gewu || ''}
                    onChange={(e) => handleInputChange('features_gewu', e.target.value)}
                    placeholder="Welche Funktionen soll die Website haben?"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="logo_farben_v"
                      checked={formData.logo_farben_v || false}
                      onCheckedChange={(checked) => handleInputChange('logo_farben_v', checked)}
                    />
                    <Label htmlFor="logo_farben_v">Logo & Farben vorhanden</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="texte_bilder_v"
                      checked={formData.texte_bilder_v || false}
                      onCheckedChange={(checked) => handleInputChange('texte_bilder_v', checked)}
                    />
                    <Label htmlFor="texte_bilder_v">Texte & Bilder vorhanden</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technical Section */}
          {activeSection === 'technical' && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Technische Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="drittanbieter">Drittanbieter-Integrationen</Label>
                  <Input
                    id="drittanbieter"
                    value={formData.drittanbieter || ''}
                    onChange={(e) => handleInputChange('drittanbieter', e.target.value)}
                    placeholder="z.B. Google Analytics, Newsletter, Zahlungssysteme..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="benoetigte_fur">Benötigte Funktionen</Label>
                  <Textarea
                    id="benoetigte_fur"
                    value={formData.benoetigte_fur || ''}
                    onChange={(e) => handleInputChange('benoetigte_fur', e.target.value)}
                    placeholder="Spezielle technische Anforderungen..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="selbst_pflegen"
                      checked={formData.selbst_pflegen || false}
                      onCheckedChange={(checked) => handleInputChange('selbst_pflegen', checked)}
                    />
                    <Label htmlFor="selbst_pflegen">Selbst pflegen möchten</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="laufende_betre"
                      checked={formData.laufende_betre || false}
                      onCheckedChange={(checked) => handleInputChange('laufende_betre', checked)}
                    />
                    <Label htmlFor="laufende_betre">Laufende Betreuung gewünscht</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline Section */}
          {activeSection === 'timeline' && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Zeitplan & Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline || ''}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input
                      id="budget"
                      value={formData.budget || ''}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="Budget-Rahmen"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projekt_verant">Projektverantwortlicher</Label>
                  <Input
                    id="projekt_verant"
                    value={formData.projekt_verant || ''}
                    onChange={(e) => handleInputChange('projekt_verant', e.target.value)}
                    placeholder="Name des Projektverantwortlichen"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="kommunikation">Kommunikationsweg</Label>
                  <Input
                    id="kommunikation"
                    value={formData.kommunikation || ''}
                    onChange={(e) => handleInputChange('kommunikation', e.target.value)}
                    placeholder="Bevorzugter Kommunikationsweg"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={saveCustomerData}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Speichern...' : 'Daten speichern'}
          </Button>
        </div>
      </div>
    </div>
  );
} 