"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  telefon?: string;
  termin_datum?: string;
  projekt_beschreibung?: string;
  created_at: string;
  updated_at: string;
  has_appointment: boolean;
  appointment_status: 'pending' | 'running' | 'completed';
  started_by?: string;
  started_at?: string;
}

interface CustomerQuestionnaireProps {
  customerId: string;
  onSave?: () => void;
}

export default function CustomerQuestionnaire({ customerId, onSave }: CustomerQuestionnaireProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefon: '',
    termin_datum: '',
    projekt_beschreibung: ''
  });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      console.log('🔍 Fetching customer:', customerId);
      
      const { data, error } = await supabase
        .from('kunden_projekte')
        .select('*')
        .eq('id', customerId)
        .single();

      if (error) {
        console.error('❌ Error fetching customer:', error);
        toast({
          title: "Fehler",
          description: "Kunde konnte nicht geladen werden.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Customer fetched:', data);
      setCustomer(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        telefon: data.telefon || '',
        termin_datum: data.termin_datum ? new Date(data.termin_datum).toISOString().slice(0, 16) : '',
        projekt_beschreibung: data.projekt_beschreibung || ''
      });
    } catch (error) {
      console.error('❌ Error:', error);
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('💾 Saving customer data:', formData);
      
      const updateData = {
        name: formData.name,
        email: formData.email,
        telefon: formData.telefon || null,
        termin_datum: formData.termin_datum ? new Date(formData.termin_datum).toISOString() : null,
        projekt_beschreibung: formData.projekt_beschreibung || null,
        has_appointment: !!formData.termin_datum,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('kunden_projekte')
        .update(updateData)
        .eq('id', customerId);

      if (error) {
        console.error('❌ Error updating customer:', error);
        toast({
          title: "Fehler",
          description: "Daten konnten nicht gespeichert werden.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Customer updated successfully');
      toast({
        title: "Erfolg",
        description: "Kundendaten wurden erfolgreich gespeichert.",
      });

      if (onSave) {
        onSave();
      } else {
        router.push('/kunden-projekte');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Kunden-Daten bearbeiten</h1>
          <p>Lade Kundendaten...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Kunde nicht gefunden</h1>
          <p>Der angeforderte Kunde konnte nicht gefunden werden.</p>
          <Button 
            onClick={() => router.push('/kunden-projekte')}
            className="mt-4"
          >
            Zurück zur Übersicht
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Kunden-Daten bearbeiten</h1>
          <p className="text-gray-600">
            Bearbeiten Sie die Daten für {customer.name}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kundendaten</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    placeholder="Vollständiger Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    placeholder="email@beispiel.de"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefon">Telefon</Label>
                  <Input
                    id="telefon"
                    type="tel"
                    value={formData.telefon}
                    onChange={(e) => handleInputChange('telefon', e.target.value)}
                    placeholder="+49 123 456789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termin_datum">Termin</Label>
                  <Input
                    id="termin_datum"
                    type="datetime-local"
                    value={formData.termin_datum}
                    onChange={(e) => handleInputChange('termin_datum', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projekt_beschreibung">Projektbeschreibung</Label>
                <Textarea
                  id="projekt_beschreibung"
                  value={formData.projekt_beschreibung}
                  onChange={(e) => handleInputChange('projekt_beschreibung', e.target.value)}
                  placeholder="Beschreiben Sie das Projekt oder die Anforderungen..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? 'Speichern...' : 'Daten speichern'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/kunden-projekte')}
                  disabled={saving}
                >
                  Abbrechen
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 