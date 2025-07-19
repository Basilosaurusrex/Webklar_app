"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, X } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { colors } from '@/lib/colors';

interface AppointmentSlot {
  date: Date;
  time: string;
  available: boolean;
  booked: boolean;
}

interface AppointmentCalendarProps {
  onSlotSelect: (date: Date, time: string) => void;
  selectedSlot?: { date: Date; time: string } | null;
}

export default function AppointmentCalendar({ onSlotSelect, selectedSlot }: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Generate available time slots (2-hour slots, Mo-Fr 9-17 Uhr)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 15; hour += 2) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  // Generate available dates for the next 4 weeks
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let currentDate = new Date(today);
    
    // Start from next Monday if today is weekend
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0) { // Sunday
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (dayOfWeek === 6) { // Saturday
      currentDate.setDate(currentDate.getDate() + 2);
    }

    for (let i = 0; i < 28; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      
      // Only include weekdays (Monday = 1, Friday = 5)
      if (date.getDay() >= 1 && date.getDay() <= 5) {
        dates.push(date);
      }
    }
    return dates;
  };

  // Fetch booked appointments from Supabase
  const fetchBookedSlots = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kunden_projekte')
        .select('termin_datum')
        .not('termin_datum', 'is', null);

      if (error) {
        console.error('Error fetching booked slots:', error);
        return;
      }

      const booked = data?.map(item => {
        const date = new Date(item.termin_datum);
        return `${date.toISOString().split('T')[0]}_${date.getHours().toString().padStart(2, '0')}:00`;
      }) || [];

      setBookedSlots(booked);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate available slots
  const generateAvailableSlots = () => {
    const dates = generateAvailableDates();
    const timeSlots = generateTimeSlots();
    const slots: AppointmentSlot[] = [];

    dates.forEach(date => {
      timeSlots.forEach(time => {
        const slotKey = `${date.toISOString().split('T')[0]}_${time}`;
        const isBooked = bookedSlots.includes(slotKey);
        
        slots.push({
          date: new Date(date),
          time,
          available: !isBooked,
          booked: isBooked
        });
      });
    });

    setAvailableSlots(slots);
  };

  useEffect(() => {
    fetchBookedSlots();
  }, []);

  useEffect(() => {
    if (bookedSlots.length > 0) {
      generateAvailableSlots();
    }
  }, [bookedSlots]);

  // Group slots by date
  const groupedSlots = availableSlots.reduce((groups, slot) => {
    const dateKey = slot.date.toISOString().split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(slot);
    return groups;
  }, {} as Record<string, AppointmentSlot[]>);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  const isSlotSelected = (slot: AppointmentSlot) => {
    if (!selectedSlot) return false;
    return selectedSlot.date.toISOString().split('T')[0] === slot.date.toISOString().split('T')[0] &&
           selectedSlot.time === slot.time;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className="p-6 rounded-2xl shadow-lg backdrop-blur-sm"
        style={{ backgroundColor: `${colors.background}F0` }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="w-6 h-6" style={{ color: colors.primary }} />
          <h3 className="text-xl font-bold" style={{ color: colors.primary }}>
            Termin auswählen
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" 
                 style={{ borderColor: colors.primary }}></div>
            <p style={{ color: colors.secondary }}>Lade verfügbare Termine...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedSlots).map(([dateKey, slots]) => {
              const date = new Date(dateKey);
              const availableSlotsForDate = slots.filter(slot => slot.available);
              
              if (availableSlotsForDate.length === 0) return null;

              return (
                <div key={dateKey} className="border rounded-xl p-4" 
                     style={{ borderColor: colors.tertiary }}>
                  <h4 className="font-semibold mb-3" style={{ color: colors.primary }}>
                    {formatDate(date)}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlotsForDate.map((slot, index) => (
                      <Button
                        key={index}
                        variant={isSlotSelected(slot) ? "default" : "outline"}
                        size="sm"
                        className="flex items-center space-x-2"
                        onClick={() => onSlotSelect(slot.date, slot.time)}
                        disabled={slot.booked}
                        style={{
                          backgroundColor: isSlotSelected(slot) ? colors.primary : 'transparent',
                          color: isSlotSelected(slot) ? colors.background : colors.primary,
                          borderColor: colors.tertiary
                        }}
                      >
                        <Clock className="w-4 h-4" />
                        <span>{slot.time}</span>
                        {isSlotSelected(slot) && <CheckCircle className="w-4 h-4" />}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedSlot && (
          <div className="mt-6 p-4 rounded-xl border-2" 
               style={{ 
                 backgroundColor: `${colors.primary}20`,
                 borderColor: colors.primary 
               }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold" style={{ color: colors.primary }}>
                  Ausgewählter Termin:
                </p>
                <p className="text-sm" style={{ color: colors.secondary }}>
                  {formatDate(selectedSlot.date)} um {selectedSlot.time} Uhr
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSlotSelect(new Date(), '')}
                style={{ color: colors.primary }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-center" style={{ color: colors.secondary }}>
          <p>• Termine sind 2 Stunden lang</p>
          <p>• Mo-Fr 9:00-17:00 Uhr</p>
          <p>• Nur verfügbare Termine werden angezeigt</p>
        </div>
      </div>
    </div>
  );
} 