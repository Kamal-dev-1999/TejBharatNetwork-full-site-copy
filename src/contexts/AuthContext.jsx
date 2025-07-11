// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updatePassword
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [bookmarks, setBookmarks]     = useState([]);
  const [loading, setLoading]         = useState(true);

  // ——— AUTH & PROFILE METHODS ———

  async function signup({ email, password, fullName, dob }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(cred.user, { displayName: fullName });
    await setDoc(doc(db, "users", cred.user.uid), {
      uid:       cred.user.uid,
      fullName,
      dob,
      email,
      bookmarks: []
    });
    return cred.user;
  }

  function login({ email, password }) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function googleLogin() {
    const provider = new GoogleAuthProvider();
    const result   = await signInWithPopup(auth, provider);
    const user     = result.user;
    const uRef     = doc(db, "users", user.uid);
    const snap     = await getDoc(uRef);
    if (!snap.exists()) {
      await setDoc(uRef, {
        uid:       user.uid,
        fullName:  user.displayName,
        dob:       null,
        email:     user.email,
        bookmarks: []
      });
    }
    return user;
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateUserPassword(newPassword) {
    return updatePassword(auth.currentUser, newPassword);
  }

  async function updateUserProfile({ fullName, dob }) {
    await firebaseUpdateProfile(auth.currentUser, { displayName: fullName });
    const uRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(uRef, { fullName, dob });
  }

  // ——— BOOKMARK METHODS ———

  /** Add an article ID to the user’s bookmarks */
  async function addBookmark(articleId) {
    if (!currentUser) throw new Error("Not authenticated");
    const uRef = doc(db, "users", currentUser.uid);
    await updateDoc(uRef, { bookmarks: arrayUnion(articleId) });
    setBookmarks(prev => [...prev, articleId]);
  }

  /** Remove an article ID from the user’s bookmarks */
  async function removeBookmark(articleId) {
    if (!currentUser) throw new Error("Not authenticated");
    const uRef = doc(db, "users", currentUser.uid);
    await updateDoc(uRef, { bookmarks: arrayRemove(articleId) });
    setBookmarks(prev => prev.filter(id => id !== articleId));
  }

  /** Toggle bookmark state for an article ID */
  function toggleBookmark(articleId) {
    return isBookmarked(articleId)
      ? removeBookmark(articleId)
      : addBookmark(articleId);
  }

  /** Check if an article ID is bookmarked */
  function isBookmarked(articleId) {
    return bookmarks.includes(articleId);
  }

  // ——— SYNC ON AUTH CHANGE ———

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setCurrentUser(user);

      if (user) {
        const uRef = doc(db, "users", user.uid);
        const snap = await getDoc(uRef);
        const data = snap.exists() ? snap.data() : {};
        setBookmarks(data.bookmarks || []);
      } else {
        setBookmarks([]);
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    // auth/profile
    signup,
    login,
    googleLogin,
    logout,
    resetPassword,
    updateUserPassword,
    updateUserProfile,
    // bookmarks
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
