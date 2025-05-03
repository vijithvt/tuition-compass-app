
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LoginFormProps {
  onLogin: () => void;
  onCancel: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        onLogin();
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Tutor Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="tutor@example.com"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="password" className="font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="password"
              required
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2" 
              />
              Remember me
            </label>
            <a href="#" className="text-primary hover:underline">Forgot password?</a>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onCancel}
              className="sm:flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="sm:flex-1"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </div>
      </form>
      
      <div className="mt-4 text-sm text-center text-gray-600">
        <p className="mb-2">Demo credentials for admin login:</p>
        <p>Email: admin@example.com</p>
        <p>Password: password123</p>
      </div>
    </div>
  );
};

export default LoginForm;
