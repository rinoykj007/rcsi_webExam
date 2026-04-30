import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setSent(true);
    toast.success("Reset email sent. Check your inbox.");
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-rcsi-navy text-primary-foreground grid place-items-center font-display font-bold text-xl mb-4">R</div>
          <h1 className="font-display text-3xl font-bold">Reset password</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter your email to receive a reset link</p>
        </div>

        {sent ? (
          <div className="bg-card rounded-2xl p-6 shadow-card space-y-4 text-center">
            <p className="text-sm">If an account exists for <strong>{email}</strong>, you'll receive a password reset email shortly.</p>
            <Link to="/login" className="text-rcsi-navy font-medium hover:underline text-sm">Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="bg-card rounded-2xl p-6 shadow-card space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11" />
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit" disabled={loading} className="w-full h-11 bg-rcsi-green hover:bg-rcsi-green/90 rounded-full font-semibold">
              {loading ? "Sending…" : "Send reset link"}
            </Button>
            <p className="text-sm text-center text-muted-foreground pt-2">
              Remembered? <Link to="/login" className="text-rcsi-navy font-medium hover:underline">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
