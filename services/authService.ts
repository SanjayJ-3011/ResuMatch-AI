import { auth, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

const mapFirebaseUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    email: firebaseUser.email || '',
    role: firebaseUser.email?.includes('admin') ? 'admin' : 'user', // Basic role check
    avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email?.split('@')[0]}&background=059669&color=fff`
  };
};

export const AuthService = {
  login: async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUser(userCredential.user);
  },

  signup: async (email: string, password: string, name: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      name: name,
      role: 'user', // Default role
      savedAnalyses: [], // Array of analysis doc IDs
      lastAnalysisAt: null, // Last resume analysis timestamp
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return mapFirebaseUser(user);
  },

  logout: async () => {
    await signOut(auth);
  },

  // Helper to subscribe to auth changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback(mapFirebaseUser(firebaseUser));
      } else {
        callback(null);
      }
    });
  },

  getCurrentUser: (): User | null => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      return mapFirebaseUser(firebaseUser);
    }
    return null;
  }
};