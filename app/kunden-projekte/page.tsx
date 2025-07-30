"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  User, 
  Building, 
  Phone, 
  Mail, 
  FileText, 
  Clock, 
  Play,
  CheckCircle,
  AlertCircle,
  Users,
  Target,
  Globe,
  Palette,
  Settings,
  TrendingUp
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

export default function KundenProjektePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      console.log('🔍 Fetching customers with appointments...');
      
      const { data, error } = await supabase
        .from('kunden_projekte')
        .select('*')
        .not('termin_datum', 'is', null)
        .order('id', { ascending: false });

      if (error) {
        console.error('❌ Error fetching customers:', error);
        return;
      }

      console.log('✅ Customers fetched:', data?.length || 0);
      setCustomers(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (customerId: string, status: 'pending' | 'running' | 'completed') => {
    try {
      console.log(`🔄 Updating appointment status for ${customerId} to ${status}`);
      
      const updateData: any = { appointment_status: status };
      
      if (status === 'running') {
        updateData.started_by = 'admin@example.com'; // TODO: Get from auth
        updateData.started_at = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('kunden_projekte')
        .update(updateData)
        .eq('id', customerId);

      if (error) {
        console.error('❌ Error updating status:', error);
        return;
      }

      console.log('✅ Status updated successfully');
      fetchCustomers(); // Refresh data
    } catch (error) {
      console.error('❌ Error:', error);
    }
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

  const getStatusActions = (customer: Customer) => {
    switch (customer.appointment_status) {
      case 'pending':
        return (
          <Button 
            onClick={() => updateAppointmentStatus(customer.id, 'running')}
            className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Termin starten
          </Button>
        );
      case 'running':
        return (
          <div className="flex gap-2">
            <Button 
              onClick={() => router.push(`/kunden-projekte/${customer.id}`)}
              className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Befragung
            </Button>
            <Button 
              onClick={() => updateAppointmentStatus(customer.id, 'completed')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Beenden
            </Button>
          </div>
        );
      case 'completed':
        return (
          <div className="flex gap-2">
            <Button 
              onClick={() => router.push(`/kunden-projekte/${customer.id}`)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Projekt anzeigen
            </Button>
            <Button 
              onClick={() => updateAppointmentStatus(customer.id, 'pending')}
              variant="outline"
              size="sm"
            >
              Zurücksetzen
            </Button>
          </div>
        );
      default:
        return (
          <Button 
            onClick={() => updateAppointmentStatus(customer.id, 'running')}
            className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Termin starten
          </Button>
        );
    }
  };

  const getCompletionStatus = (customer: Customer) => {
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

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = (customer.ansprechpartn || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.firma || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.appointment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Kunden-Projekte</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Lade Projekte...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Kunden-Projekte</h1>
              <p className="text-lg text-gray-600">
                Professionelle Projektverwaltung und Kundenbefragung
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gesamt Projekte</p>
                    <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Wartend</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {customers.filter(c => c.appointment_status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Play className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aktiv</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {customers.filter(c => c.appointment_status === 'running').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Abgeschlossen</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {customers.filter(c => c.appointment_status === 'completed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Nach Kunde, Firma oder E-Mail suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-sm"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <SelectValue placeholder="Status filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="pending">Wartend</SelectItem>
              <SelectItem value="running">Aktiv</SelectItem>
              <SelectItem value="completed">Abgeschlossen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        {filteredCustomers.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {customers.length === 0 
                  ? "Keine Projekte gefunden" 
                  : "Keine Projekte entsprechen den Filterkriterien"}
              </h3>
              <p className="text-gray-600">
                {customers.length === 0 
                  ? "Erstellen Sie Ihr erstes Kundenprojekt über die Terminbuchung."
                  : "Versuchen Sie andere Suchkriterien oder Filter."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredCustomers.map((customer) => {
              const completion = getCompletionStatus(customer);
              return (
                <Card key={customer.id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Building className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-gray-800">
                              {customer.ansprechpartn || customer.firma || 'Unbekannter Kunde'}
                            </CardTitle>
                            <p className="text-sm text-gray-600">
                              {customer.firma && customer.ansprechpartn ? `${customer.firma} - ${customer.ansprechpartn}` : customer.firma || customer.ansprechpartn}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{customer.email || 'E-Mail nicht angegeben'}</span>
                          </div>
                          {customer.telefon && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{customer.telefon}</span>
                            </div>
                          )}
                          {customer.termin_datum && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(customer.termin_datum).toLocaleString('de-DE')}</span>
                            </div>
                          )}
                        </div>

                        {/* Completion Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Befragung Fortschritt</span>
                            <span className="text-sm text-gray-600">{completion.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                completion.percentage >= 80 ? 'bg-green-500' :
                                completion.percentage >= 50 ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${completion.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {completion.filledFields} von {completion.totalFields} Feldern ausgefüllt
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3">
                        {getStatusBadge(customer.appointment_status || 'pending', customer.started_by)}
                        {getStatusActions(customer)}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 