import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle } from 'lucide-react';

const Login = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Lösenorden matchar inte.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Lösenordet måste vara minst 6 tecken.');
        setLoading(false);
        return;
      }
      const { data, error } = await signUp(email, password);
      if (error) {
        setError(error.message || 'Kunde inte skapa konto.');
      } else if (data?.session) {
        navigate('/admin');
      } else {
        setSignUpSuccess(true);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError('Fel e-post eller lösenord.');
      } else {
        navigate('/admin');
      }
    }
    setLoading(false);
  };

  if (signUpSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm text-center">
          <div className="bg-card border border-border rounded p-6 space-y-4">
            <CheckCircle className="h-12 w-12 text-primary mx-auto" />
            <h2 className="font-serif text-xl text-foreground">Konto skapat!</h2>
            <p className="text-muted-foreground text-sm font-sans">
              Kolla din e-post för att verifiera kontot. Klicka på länken i mejlet för att aktivera ditt konto.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSignUp(false);
                setSignUpSuccess(false);
                setPassword('');
                setConfirmPassword('');
              }}
            >
              Tillbaka till inloggning
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-primary font-serif text-2xl font-semibold tracking-wide">TOPLINER</h1>
          <p className="text-muted-foreground font-sans text-sm mt-2">Studio Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded p-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-sans text-sm">E-post</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-sans text-sm">Lösenord</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-sans text-sm">Bekräfta lösenord</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          )}
          {error && <p className="text-sm text-destructive font-sans">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isSignUp ? 'Skapa konto' : 'Logga in'}
          </Button>
          <p className="text-center text-sm text-muted-foreground font-sans">
            {isSignUp ? (
              <>Har du redan ett konto?{' '}
                <button type="button" className="text-primary hover:underline" onClick={() => { setIsSignUp(false); setError(''); }}>
                  Logga in
                </button>
              </>
            ) : (
              <>Har du inget konto?{' '}
                <button type="button" className="text-primary hover:underline" onClick={() => { setIsSignUp(true); setError(''); }}>
                  Skapa ett
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
