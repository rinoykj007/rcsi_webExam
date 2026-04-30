import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { motion } from "framer-motion";

const Splash = () => {
  const { user, loading } = useAuthStore();
  const nav = useNavigate();
  useEffect(() => { if (!loading && user) nav("/", { replace: true }); }, [user, loading, nav]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-rcsi-navy text-primary-foreground grid place-items-center px-6">
      {/* decorative blobs */}
      <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-rcsi-purple/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-rcsi-green/20 blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative text-center max-w-md">
        <div className="mx-auto mb-8 h-20 w-20 rounded-3xl bg-gradient-to-br from-rcsi-purple to-rcsi-green grid place-items-center font-display font-extrabold text-3xl shadow-elevated">
          R
        </div>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl mb-3">RCSI Exam Agent</h1>
        <p className="text-lg text-primary-foreground/70 mb-10">Prepare. Practice. Pass.</p>
        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="bg-rcsi-green hover:bg-rcsi-green/90 text-primary-foreground rounded-full h-12 text-base font-semibold">
            <Link to="/login">Begin Your Journey</Link>
          </Button>
          <Link to="/signup" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition">
            New here? Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Splash;
