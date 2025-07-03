import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(true);
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
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
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
            Sign Up
          </button>
        </form>
        {error && <div className="text-red-600 mt-4 text-center animate-pulse">{error}</div>}
        {success && <div className="text-green-600 mt-4 text-center animate-pulse">Account created! You can now sign in.</div>}
      </div>
    </div>
  );
} 
