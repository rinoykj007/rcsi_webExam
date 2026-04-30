import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    // Supabase auto-handles the recovery token in the URL hash and emits a PASSWORD_RECOVERY event
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // If user already has a session from the recovery link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setErr("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    toast.success("Password updated. Please sign in.");
    await supabase.auth.signOut();
    nav("/login", { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center px-6 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-rcsi-navy text-primary-foreground grid place-items-center font-display font-bold text-xl mb-4">R</div>
          <h1 className="font-display text-3xl font-bold">Set new password</h1>
          <p className="text-muted-foreground text-sm mt-1">Choose a strong password you haven't used before</p>
        </div>

        <form onSubmit={onSubmit} className="bg-card rounded-2xl p-6 shadow-card space-y-4">
          <div>
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" required autoComplete="new-password"
              value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-11" />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" required autoComplete="new-password"
              value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1.5 h-11" />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          {!ready && <p className="text-xs text-muted-foreground">Verifying reset link…</p>}
          <Button type="submit" disabled={loading || !ready} className="w-full h-11 bg-rcsi-green hover:bg-rcsi-green/90 rounded-full font-semibold">
            {loading ? "Updating…" : "Update password"}
          </Button>
          <p className="text-sm text-center text-muted-foreground pt-2">
            <Link to="/login" className="text-rcsi-navy font-medium hover:underline">Back to sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
