import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// // Force light mode on startup
// document.documentElement.classList.remove("dark");
// localStorage.setItem("rcsi-theme", "light");

createRoot(document.getElementById("root")!).render(<App />);
