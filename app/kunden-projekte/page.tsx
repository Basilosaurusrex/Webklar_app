"use client";
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Building,
  Target,
  Users,
  Calendar,
  MessageCircle,
  Phone
} from "lucide-react";
import CustomerStepperForm from '@/components/CustomerStepperForm';
import { colors } from "@/lib/colors";

export default function KundenProjektePage() {
  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: colors.background }}>
      {/* Main Content Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`
          }}></div>
        </div>

        {/* Animated Background Lines */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1000 600">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.tertiary} />
                <stop offset="50%" stopColor={colors.secondary} />
                <stop offset="100%" stopColor={colors.primary} />
              </linearGradient>
            </defs>
            <line
              x1="0"
              y1="100"
              x2="1000"
              y2="100"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              className="animate-pulse"
            />
            <line
              x1="0"
              y1="300"
              x2="1000"
              y2="300"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              opacity="0.6"
            />
          </svg>
        </div>

        <div className="relative z-20 px-4 sm:px-8 py-8 max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 text-xs sm:text-sm">
              {['Kundenprojekt', '8 Schritte', 'Maßgeschneidert', 'Persönlich'].map((item) => (
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
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.primary }}>
              <span className="relative inline-block">
                Kundenprojekt
                <div 
                  className="absolute -inset-2 rounded-xl blur-sm opacity-20"
                  style={{ backgroundColor: colors.secondary }}
                ></div>
              </span>{" "}
              anlegen
            </h1>
            
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto" style={{ color: colors.secondary }}>
              Gemeinsam entwickeln wir die perfekte digitale Strategie für Ihr Unternehmen. Schritt für Schritt zum Erfolg.
            </p>
          </div>

          {/* Form Container */}
          <div className="relative">
            {/* Form Card */}
            <div className="rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm" style={{ backgroundColor: `${colors.white}CC` }}>
              <div className="p-8">
                <CustomerStepperForm />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full opacity-20" style={{ backgroundColor: colors.primary }}></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 rounded-full opacity-20" style={{ backgroundColor: colors.secondary }}></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 rounded-full opacity-20" style={{ backgroundColor: colors.tertiary }}></div>
          </div>

          {/* Bottom Info */}
          <div className="text-center mt-8">
            <p className="text-sm" style={{ color: colors.secondary }}>
              Ihre Daten werden sicher gespeichert und nur für die Projektabwicklung verwendet.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 