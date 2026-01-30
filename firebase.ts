import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLFqPP_iv7jJBR9YQk2n9uYJZtiZMcQtI",
  authDomain: "resumatch-ai-6210f.firebaseapp.com",
  projectId: "resumatch-ai-6210f",
  storageBucket: "resumatch-ai-6210f.firebasestorage.app",
  messagingSenderId: "970838975779",
  appId: "1:970838975779:web:55aa552a708f9aaec61896"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
