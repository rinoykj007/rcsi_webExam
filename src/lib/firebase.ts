import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXRLwod7FfxFxBjfcDJVaHWTjUDouPwOI",
  authDomain: "rcsiexam.firebaseapp.com",
  projectId: "rcsiexam",
  storageBucket: "rcsiexam.firebasestorage.app",
  messagingSenderId: "323159043771",
  appId: "1:323159043771:web:5ff36a1013a4476262c39e",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const firebaseDb = getFirestore(app);
