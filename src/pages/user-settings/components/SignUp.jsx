// src/pages/user-settings/components/SignUp.jsx
import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Icon from "../../../components/AppIcon";

function getFriendlyError(code, message) {
  if (code === "auth/email-already-in-use") return "An account with this email already exists.";
  if (code === "auth/invalid-email") return "Please enter a valid email address.";
  if (code === "auth/weak-password") return "Password must be at least 6 characters.";
  if (code === "auth/missing-password") return "Please enter a password.";
  if (code === "auth/missing-email") return "Please enter your email address.";
  if (message && message.toLowerCase().includes("already in use")) return "An account with this email already exists.";
  if (message && message.toLowerCase().includes("password")) return "Password must be at least 6 characters.";
  return "Something went wrong. Please try again.";
}

function validateEmail(email) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignUp() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [data, setData] = useState({
    fullName: "", dob: "", email: "", password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  function validateFields(values) {
    const errs = {};
    if (!values.fullName) errs.fullName = "Full name is required.";
    if (!values.dob) errs.dob = "Date of birth is required.";
    if (!values.email) errs.email = "Email is required.";
    else if (!validateEmail(values.email)) errs.email = "Please enter a valid email address.";
    if (!values.password) errs.password = "Password is required.";
    else if (values.password.length < 6) errs.password = "Password must be at least 6 characters.";
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(validateFields({ ...data, [name]: value }));
    setError("");
    setEmailExists(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setEmailExists(false);
    const errs = validateFields(data);
    setFieldErrors(errs);
    setTouched({ fullName: true, dob: true, email: true, password: true });
    if (Object.keys(errs).length > 0) {
      setLoading(false);
      return;
    }
    try {
      setError("");
      await signup(data);
      nav("/user-settings"); // redirect to profile
    } catch (err) {
      const friendly = getFriendlyError(err.code, err.message);
      setError(friendly);
      if (friendly.toLowerCase().includes("already exists")) {
        setEmailExists(true);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleGoToLogin() {
    nav("/signin");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface py-8">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 border border-border">
        <h2 className="text-2xl font-heading font-bold mb-6 text-center">Sign Up</h2>
        {error && (
          <div className="mb-4 p-3 rounded bg-red-600 text-white text-sm border border-red-700 text-center">
            {error}
            {emailExists && (
              <div className="mt-2">
                <Button
                  type="button"
                  variant="link"
                  className="text-white underline"
                  onClick={handleGoToLogin}
                  size="sm"
                >
                  Log In
                </Button>
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {touched.fullName && fieldErrors.fullName && (
              <div className="mb-1 p-2 rounded bg-red-600 text-white text-xs">{fieldErrors.fullName}</div>
            )}
            <Input
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={data.fullName}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>
          <div>
            {touched.dob && fieldErrors.dob && (
              <div className="mb-1 p-2 rounded bg-red-600 text-white text-xs">{fieldErrors.dob}</div>
            )}
            <Input
              name="dob"
              type="date"
              placeholder="Date of Birth"
              value={data.dob}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            {touched.email && fieldErrors.email && (
              <div className="mb-1 p-2 rounded bg-red-600 text-white text-xs">{fieldErrors.email}</div>
            )}
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div>
            {touched.password && fieldErrors.password && (
              <div className="mb-1 p-2 rounded bg-red-600 text-white text-xs">{fieldErrors.password}</div>
            )}
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              disabled={loading}
            />
          </div>
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            {loading ? <Icon name="Loader2" className="animate-spin mr-2" size={18} /> : null}
            Sign Up
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 font-medium underline ml-1"
            onClick={handleGoToLogin}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
