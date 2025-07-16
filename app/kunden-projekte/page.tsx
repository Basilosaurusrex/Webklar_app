import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import CustomerStepperForm from '@/components/CustomerStepperForm';

export default function KundenProjektePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Kundenprojekt anlegen</h1>
        <CustomerStepperForm />
      </div>
    </main>
  );
} 