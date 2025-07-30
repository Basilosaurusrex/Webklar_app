"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/kunden-projekte`
        }
      });

      if (error) {
        console.error('❌ Login error:', error);
        toast({
          title: "Fehler",
          description: "Login fehlgeschlagen. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "E-Mail gesendet",
        description: "Prüfen Sie Ihre E-Mail für den Login-Link.",
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

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-gray-600">
            Melden Sie sich an, um auf die Admin-Funktionen zuzugreifen
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Administrator-Zugang</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail-Adresse</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@beispiel.de"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Sende E-Mail...' : 'E-Mail senden'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => router.push('/kunden-projekte')}
                className="w-full"
              >
                Direkt zu Kunden-Projekte (Test-Modus)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 