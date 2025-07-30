"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, X } from "lucide-react";
import { colors } from '@/lib/colors';
import { supabase } from '@/lib/supabaseClient';

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
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(false);

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

  // Generate available slots (with Supabase integration)
  const generateAvailableSlots = async () => {
    const dates = generateAvailableDates();
    const timeSlots = generateTimeSlots();
    const slots: AppointmentSlot[] = [];

    try {
      // Get booked appointments from Supabase - look for termin_datum column
      const { data: bookedAppointments, error } = await supabase
        .from('kunden_projekte')
        .select('termin_datum')
        .not('termin_datum', 'is', null);

      if (error) {
        console.error('Error fetching booked appointments:', error);
        console.log('Falling back to all available slots');
        // Fallback to all available
        dates.forEach(date => {
          timeSlots.forEach(time => {
            slots.push({
              date: new Date(date),
              time,
              available: true,
              booked: false
            });
          });
        });
      } else {
        console.log('Found booked appointments:', bookedAppointments);
        console.log('Number of booked appointments:', bookedAppointments?.length || 0);
        
        // Create a set of booked times for quick lookup
        const bookedTimes = new Set();
        bookedAppointments?.forEach(appointment => {
          if (appointment.termin_datum) {
            const appointmentDate = new Date(appointment.termin_datum);
            console.log('Processing booked appointment:', appointment.termin_datum);
            console.log('Appointment date object:', appointmentDate);
            console.log('Appointment hours:', appointmentDate.getHours());
            console.log('Appointment local time:', appointmentDate.toLocaleString('de-DE'));
            
            // Use local time consistently - don't convert to UTC
            const year = appointmentDate.getFullYear();
            const month = appointmentDate.getMonth();
            const day = appointmentDate.getDate();
            const hours = appointmentDate.getHours();
            
            // Create time string using local time components
            const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const hourString = hours.toString().padStart(2, '0') + ':00';
            const timeString = `${dateString}T${hourString}:00:00`;
            bookedTimes.add(timeString);
            console.log('Booked appointment found (local time):', timeString);
          }
        });
        
        console.log('All booked time strings:', Array.from(bookedTimes));

        // Generate slots with availability check
        dates.forEach(date => {
          timeSlots.forEach(time => {
            const [hours] = time.split(':').map(Number);
            // Create slot datetime in local time
            const slotDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, 0, 0, 0);
            
            // Create time string using local time components (same as booked appointments)
            const year = slotDateTime.getFullYear();
            const month = slotDateTime.getMonth();
            const day = slotDateTime.getDate();
            const slotHours = slotDateTime.getHours();
            
            const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const hourString = slotHours.toString().padStart(2, '0') + ':00';
            const timeString = `${dateString}T${hourString}:00:00`;
            
            const isBooked = bookedTimes.has(timeString);
            
            console.log(`Slot ${dateString} ${time}:`, {
              slotDateTime: slotDateTime.toISOString(),
              timeString,
              isBooked,
              bookedTimes: Array.from(bookedTimes)
            });
            
            if (isBooked) {
              console.log('Slot is booked:', timeString);
            }
            
            slots.push({
              date: new Date(date),
              time,
              available: !isBooked,
              booked: isBooked
            });
          });
        });
      }
    } catch (err) {
      console.error('Error checking availability:', err);
      // Fallback to all available
      dates.forEach(date => {
        timeSlots.forEach(time => {
          slots.push({
            date: new Date(date),
            time,
            available: true,
            booked: false
          });
        });
      });
    }

    setAvailableSlots(slots);
  };

  useEffect(() => {
    setLoading(true);
    // Simulate loading time
    setTimeout(() => {
      generateAvailableSlots();
      setLoading(false);
    }, 500);
  }, []);

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
            {Object.entries(groupedSlots).slice(0, 3).map(([dateKey, slots]) => {
              const date = new Date(dateKey);
              // Show all slots, not just available ones
              const allSlotsForDate = slots;
              
              if (allSlotsForDate.length === 0) return null;

              return (
                <div key={dateKey} className="border rounded-xl p-4" 
                     style={{ borderColor: colors.tertiary }}>
                  <h4 className="font-semibold mb-3" style={{ color: colors.primary }}>
                    {formatDate(date)}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {allSlotsForDate.map((slot, index) => (
                      <Button
                        key={index}
                        variant={isSlotSelected(slot) ? "default" : "outline"}
                        size="sm"
                        className="flex items-center space-x-2"
                        onClick={() => onSlotSelect(slot.date, slot.time)}
                        disabled={slot.booked || !slot.available}
                        style={{
                          backgroundColor: isSlotSelected(slot) ? colors.primary : 
                                       slot.booked ? '#f3f4f6' : 'transparent',
                          color: isSlotSelected(slot) ? colors.background : 
                                slot.booked ? '#9ca3af' : colors.primary,
                          borderColor: slot.booked ? '#d1d5db' : colors.tertiary
                        }}
                      >
                        <Clock className="w-4 h-4" />
                        <span>{slot.time}</span>
                        {isSlotSelected(slot) && <CheckCircle className="w-4 h-4" />}
                        {slot.booked && <span className="text-xs">(Gebucht)</span>}
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
          <p>• Termine sind 1 Stunden lang</p>
          <p>• Mo-Fr 9:00-17:00 Uhr</p>
          <p>• Nur verfügbare Termine werden angezeigt</p>
        </div>
      </div>
    </div>
  );
} 