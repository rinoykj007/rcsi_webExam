import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { signIn } = useAuthStore();
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { setErr(error); return; }
    toast.success("Welcome back!");
    nav("/", { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-rcsi-navy text-primary-foreground grid place-items-center font-display font-bold text-xl mb-4">R</div>
          <h1 className="font-display text-3xl font-bold">Sign in</h1>
          <p className="text-muted-foreground text-sm mt-1">Continue your RCSI prep journey</p>
        </div>

        <form onSubmit={onSubmit} className="bg-card rounded-2xl p-6 shadow-card space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-11" />
          </div>
          <div className="flex justify-end -mt-2">
            <Link to="/forgot-password" className="text-xs text-rcsi-navy font-medium hover:underline">Forgot password?</Link>
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button type="submit" disabled={loading} className="w-full h-11 bg-rcsi-green hover:bg-rcsi-green/90 rounded-full font-semibold">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>
          <GoogleSignInButton label="Sign in with Google" />
          <p className="text-sm text-center text-muted-foreground pt-2">
            No account? <Link to="/signup" className="text-rcsi-navy font-medium hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
