import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase";
import { ArrowLeft } from "lucide-react";

const GoogleLogo = (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <g>
      <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.71 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/>
      <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.36 46.1 24.55z"/>
      <path fill="#FBBC05" d="M9.67 28.65c-1.13-3.36-1.13-6.94 0-10.3l-7.98-6.2C-1.13 17.13-1.13 30.87 1.69 37.56l7.98-6.2z"/>
      <path fill="#EA4335" d="M24 48c6.18 0 11.64-2.03 15.84-5.52l-7.19-5.6c-2.01 1.35-4.6 2.15-8.65 2.15-6.38 0-11.87-3.63-14.33-8.94l-7.98 6.2C6.71 42.52 14.82 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </g>
  </svg>
);

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setSuccess(false);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccess(true);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm transition-transform duration-300 hover:scale-[1.025] hover:shadow-2xl border border-border relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center px-3 py-1.5 rounded-md bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white active:bg-red-700 active:text-white transition-all duration-200 group shadow"
          aria-label="Back"
        >
          <svg className="w-5 h-5 mr-1 group-hover:text-white group-active:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition-shadow duration-200"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition-shadow duration-200"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 active:scale-95 transition-all duration-200 shadow-sm"
          >
            Sign In
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-border"></div>
          <span className="mx-2 text-text-secondary text-sm">or</span>
          <div className="flex-grow border-t border-border"></div>
        </div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center bg-white border border-border text-gray-700 font-medium py-2 rounded-md shadow-sm hover:bg-gray-50 active:scale-95 transition-all duration-200"
        >
          {GoogleLogo}
          Sign in with Google
        </button>
        {error && <div className="text-red-600 mt-4 text-center animate-pulse">{error}</div>}
        {success && <div className="text-green-600 mt-4 text-center animate-pulse">Signed in successfully!</div>}
      </div>
    </div>
  );
} 
