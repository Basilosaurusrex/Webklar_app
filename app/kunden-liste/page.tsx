'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  RefreshCw, 
  Building, 
  Calendar, 
  Users, 
  Globe, 
  Euro, 
  Clock,
  ArrowLeft,
  Plus,
  Filter,
  Download
} from "lucide-react";
import { colors } from "@/lib/colors";

interface KundenProjekt {
  id: string;
  erstellt_am: string;
  firma: string;
  beschreibung: string;
  zielgruppe: string;
  website_vorhanden: boolean;
  stilvorbilder: string;
  was_gefaellt_gefaellt_nicht: string;
  ziel_der_website: string;
  seiten_geplant: string;
  texte_bilder_vorhanden: boolean;
  fokus_inhalte: string;
  logo_farben_vorhanden: boolean;
  design_wunsch: string;
  beispiellinks: string;
  features_gewuenscht: string;
  drittanbieter: string;
  selbst_pflegen: boolean;
  laufende_betreuung: boolean;
  deadline: string;
  projekt_verantwortlich: string;
  budget: string;
  kommunikationsweg: string;
  feedback_geschwindigkeit: string;
}

export default function KundenListePage() {
  const [kunden, setKunden] = useState<KundenProjekt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchKunden();
  }, []);

  async function fetchKunden() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kunden_projekte')
        .select('*')
        .order('erstellt_am', { ascending: false });

      if (error) {
        setError('Fehler beim Laden der Daten: ' + error.message);
      } else {
        setKunden(data || []);
      }
    } catch (e: any) {
      setError('Unbekannter Fehler: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredKunden = kunden.filter(kunde =>
    kunde.firma?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kunde.beschreibung?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kunde.zielgruppe?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('de-DE');
  }

  function formatBoolean(value: boolean) {
    return value ? 'Ja' : 'Nein';
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center !bg-[#FEFAE0]" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p style={{ color: colors.primary }}>Lade Kundendaten...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center !bg-[#FEFAE0]" style={{ backgroundColor: colors.background }}>
        <div className="text-center max-w-md mx-auto p-6 rounded-2xl shadow-lg" style={{ backgroundColor: colors.white }}>
          <p className="mb-4" style={{ color: colors.primary }}>{error}</p>
          <Button
            onClick={fetchKunden}
            className="rounded-full font-medium"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.background
            }}
          >
            Erneut versuchen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen !bg-[#FEFAE0]" style={{ backgroundColor: colors.background }}>
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`
          }}></div>
        </div>

        <div className="relative z-10 px-4 sm:px-8 py-8 max-w-7xl mx-auto">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              className="rounded-full font-medium hover:scale-105 transition-all duration-300"
              style={{ color: colors.primary }}
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                Kundenprojekte
              </h1>
              <p className="text-sm" style={{ color: colors.secondary }}>
                Übersicht aller Kundenprojekte und deren Status
              </p>
            </div>

            <Button 
              className="rounded-full font-medium px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.background
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Neues Projekt
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-6 rounded-2xl shadow-lg backdrop-blur-sm" style={{ backgroundColor: `${colors.white}CC` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.secondary }}>Gesamt Projekte</p>
                  <p className="text-2xl font-bold" style={{ color: colors.primary }}>{kunden.length}</p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: colors.primary }}>
                  <Building className="w-6 h-6" style={{ color: colors.background }} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl shadow-lg backdrop-blur-sm" style={{ backgroundColor: `${colors.white}CC` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.secondary }}>Aktive Projekte</p>
                  <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                    {kunden.filter(k => k.laufende_betreuung).length}
                  </p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: colors.secondary }}>
                  <Clock className="w-6 h-6" style={{ color: colors.background }} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl shadow-lg backdrop-blur-sm" style={{ backgroundColor: `${colors.white}CC` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.secondary }}>Neue diese Woche</p>
                  <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                    {kunden.filter(k => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(k.erstellt_am) > weekAgo;
                    }).length}
                  </p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: colors.tertiary }}>
                  <Calendar className="w-6 h-6" style={{ color: colors.primary }} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl shadow-lg backdrop-blur-sm" style={{ backgroundColor: `${colors.white}CC` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.secondary }}>Durchschnitt Budget</p>
                  <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                    {(() => {
                      const budgets = kunden
                        .filter(k => k.budget)
                        .map(k => parseInt(k.budget.replace(/[^\d]/g, '')))
                        .filter(b => !isNaN(b));
                      return budgets.length > 0 
                        ? `${Math.round(budgets.reduce((a, b) => a + b, 0) / budgets.length)}€`
                        : '-';
                    })()}
                  </p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: colors.primary }}>
                  <Euro className="w-6 h-6" style={{ color: colors.background }} />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: colors.secondary }} />
              <input
                type="text"
                placeholder="Nach Firma, Beschreibung oder Zielgruppe suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border-2 focus:outline-none focus:ring-2 transition-all duration-300"
                style={{ 
                  borderColor: colors.secondary,
                  backgroundColor: colors.white,
                  color: colors.primary
                }}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="rounded-full"
                style={{ 
                  borderColor: colors.secondary,
                  color: colors.secondary,
                  backgroundColor: colors.white
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              <Button 
                onClick={fetchKunden}
                className="rounded-full font-medium"
                style={{ 
                  backgroundColor: colors.secondary,
                  color: colors.background
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Aktualisieren
              </Button>
              
              <Button 
                variant="outline" 
                className="rounded-full"
                style={{ 
                  borderColor: colors.secondary,
                  color: colors.secondary,
                  backgroundColor: colors.white
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: colors.white }}>
            {filteredKunden.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondary }}>
                  <Building className="w-8 h-8" style={{ color: colors.background }} />
                </div>
                <p className="text-lg font-medium mb-2" style={{ color: colors.primary }}>
                  {searchTerm ? 'Keine Kunden gefunden' : 'Noch keine Kundenprojekte vorhanden'}
                </p>
                <p className="text-sm" style={{ color: colors.secondary }}>
                  {searchTerm ? 'Versuchen Sie einen anderen Suchbegriff.' : 'Erstellen Sie Ihr erstes Kundenprojekt.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: colors.background }}>
                      <th className="text-left p-4 font-semibold" style={{ color: colors.primary }}>Firma</th>
                      <th className="text-left p-4 font-semibold" style={{ color: colors.primary }}>Erstellt am</th>
                      <th className="text-left p-4 font-semibold" style={{ color: colors.primary }}>Zielgruppe</th>
                      <th className="text-left p-4 font-semibold" style={{ color: colors.primary }}>Website vorhanden</th>
                      <th className="text-left p-4 font-semibold" style={{ color: colors.primary }}>Deadline</th>
                      <th className="text-left p-4 font-semibold" style={{ color: colors.primary }}>Budget</th>
                      <th className="text-left p-4 font-semibold" style={{ color: colors.primary }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKunden.map((kunde, index) => (
                      <tr 
                        key={kunde.id} 
                        className="border-b transition-all duration-200 hover:scale-[1.01] cursor-pointer"
                        style={{ 
                          borderColor: colors.background,
                          backgroundColor: index % 2 === 0 ? colors.white : colors.background
                        }}
                      >
                        <td className="p-4">
                          <div className="font-medium" style={{ color: colors.primary }}>{kunde.firma}</div>
                          <div className="text-sm truncate max-w-xs" style={{ color: colors.secondary }}>
                            {kunde.beschreibung}
                          </div>
                        </td>
                        <td className="p-4 text-sm" style={{ color: colors.secondary }}>
                          {formatDate(kunde.erstellt_am)}
                        </td>
                        <td className="p-4 text-sm" style={{ color: colors.secondary }}>
                          {kunde.zielgruppe}
                        </td>
                        <td className="p-4 text-sm" style={{ color: colors.secondary }}>
                          {formatBoolean(kunde.website_vorhanden)}
                        </td>
                        <td className="p-4 text-sm" style={{ color: colors.secondary }}>
                          {kunde.deadline ? formatDate(kunde.deadline) : '-'}
                        </td>
                        <td className="p-4 text-sm" style={{ color: colors.secondary }}>
                          {kunde.budget || '-'}
                        </td>
                        <td className="p-4">
                          <Badge 
                            className="rounded-full font-medium"
                            style={{ 
                              backgroundColor: kunde.laufende_betreuung ? colors.secondary : colors.tertiary,
                              color: kunde.laufende_betreuung ? colors.background : colors.primary
                            }}
                          >
                            {kunde.laufende_betreuung ? 'Aktiv' : 'In Bearbeitung'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: colors.secondary }}>
              {filteredKunden.length} von {kunden.length} Kundenprojekten
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 