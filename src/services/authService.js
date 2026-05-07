import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut, 
} from "firebase/auth";
import { auth } from "./firebase";
import api from "./api";

export const loginWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const registerWithEmail = async (email, password, role) => {
  window.localStorage.setItem('pendingRole', role);
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const signInWithGoogleRedirect = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
};

export const handleRedirectResult = async () => {
  const result = await getRedirectResult(auth);
  if (result) {
    return result.user;
  }
  return null;
};

export const logout = () => signOut(auth);

export const getUserData = async () => {
  const res = await api.get('/auth/user/');
  return res.data;
};
