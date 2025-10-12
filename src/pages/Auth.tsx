import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [accessRequested, setAccessRequested] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [requestedEmail, setRequestedEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      
      // Check role and redirect
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (roleData?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/client-portal');
        }
      }
    }

    setLoading(false);
  };

  const handleRequestAccess = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const lastName = formData.get('lastName') as string;

    setRequestedEmail(email);

    // Call edge function to check if user is in client_imports and send code
    const { data, error } = await supabase.functions.invoke('request-access', {
      body: { email, lastName },
    });

    if (error || data?.error) {
      toast({
        title: 'Error',
        description: data?.error || error?.message || 'Failed to request access',
        variant: 'destructive',
      });
    } else if (data?.pending) {
      toast({
        title: 'Access Pending',
        description: 'Your access request is pending approval. Please contact the office.',
      });
    } else {
      setAccessRequested(true);
      toast({
        title: 'Code Sent',
        description: 'A 6-digit access code has been sent to your email.',
      });
    }

    setLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // Call edge function to verify code and create account
    const { data, error } = await supabase.functions.invoke('verify-code', {
      body: { email: requestedEmail, code: accessCode, password },
    });

    if (error || data?.error) {
      toast({
        title: 'Error',
        description: data?.error || error?.message || 'Invalid or expired code',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Account created successfully. Logging you in...',
      });
      
      // Log the user in
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: requestedEmail,
        password,
      });

      if (!loginError) {
        navigate('/client-portal');
      }
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Password reset link sent to your email',
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 offset-header py-16 bg-muted/50">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="request">Request Access</TabsTrigger>
                <TabsTrigger value="forgot">Forgot Password</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Login to Portal</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="request">
                <Card>
                  <CardHeader>
                    <CardTitle>Request Portal Access</CardTitle>
                    <CardDescription>Enter your information to request access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!accessRequested ? (
                      <form onSubmit={handleRequestAccess} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="request-email">Email</Label>
                          <Input id="request-email" name="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" name="lastName" type="text" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? 'Requesting...' : 'Request Access'}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyCode} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="code">6-Digit Access Code</Label>
                          <Input
                            id="code"
                            name="code"
                            type="text"
                            maxLength={6}
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Create Password</Label>
                          <Input id="new-password" name="password" type="password" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm Password</Label>
                          <Input id="confirm-password" name="confirmPassword" type="password" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setAccessRequested(false)}
                        >
                          Back
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="forgot">
                <Card>
                  <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>Enter your email to receive a reset link</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">Email</Label>
                        <Input id="forgot-email" name="email" type="email" required />
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
