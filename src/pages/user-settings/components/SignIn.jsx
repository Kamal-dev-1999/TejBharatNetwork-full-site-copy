// src/pages/user-settings/components/SignIn.jsx
import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Icon from "../../../components/AppIcon";

function getFriendlyError(code, message) {
  if (code === "auth/user-not-found") return "No account found with this email.";
  if (code === "auth/wrong-password") return "Incorrect password. Please try again.";
  if (code === "auth/invalid-email") return "Please enter a valid email address.";
  if (code === "auth/too-many-requests") return "Too many failed attempts. Please try again later.";
  if (code === "auth/missing-password") return "Please enter your password.";
  if (code === "auth/missing-email") return "Please enter your email address.";
  if (message && message.toLowerCase().includes("password")) return "Password is incorrect or too short.";
  if (message && message.toLowerCase().includes("email")) return "Please enter a valid email address.";
  return "Something went wrong. Please try again.";
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignIn() {
  const { login, googleLogin, resetPassword } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  function validateFields(values) {
    const errs = {};
    if (!values.email) errs.email = "Email is required.";
    else if (!validateEmail(values.email)) errs.email = "Please enter a valid email address.";
    if (!values.password) errs.password = "Password is required.";
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    setTouched(prev => ({ ...prev, [name]: true }));
    setFieldErrors(validateFields({ email: name === "email" ? value : email, password: name === "password" ? value : password }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTouched({ email: true, password: true });
    const errs = validateFields({ email, password });
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setLoading(false);
      return;
    }
    try {
      setError(""); setMessage("");
      await login({ email, password });
      nav("/user-settings");
    } catch (err) {
      setError(getFriendlyError(err.code, err.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      setError(""); setMessage("");
      await googleLogin();
      nav("/user-settings");
    } catch (err) {
      setError(getFriendlyError(err.code, err.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    setTouched(prev => ({ ...prev, email: true }));
    if (!email || !validateEmail(email)) {
      setFieldErrors(prev => ({ ...prev, email: !email ? "Email is required." : "Please enter a valid email address." }));
      return;
    }
    try {
      setError("");
      await resetPassword(email);
      setMessage("Check your inbox for reset link");
    } catch (err) {
      setError(getFriendlyError(err.code, err.message));
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface py-8">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 border border-border">
        <h2 className="text-2xl font-heading font-bold mb-6 text-center">Sign In</h2>
        {error && (
          <div className="mb-4 p-3 rounded bg-red-600 text-white text-sm border border-red-700 text-center">{error}</div>
        )}
        {message && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm border border-green-200">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {touched.email && fieldErrors.email && (
              <div className="mb-1 p-2 rounded bg-red-600 text-white text-xs">{fieldErrors.email}</div>
            )}
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
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
              value={password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            {loading ? <Icon name="Loader2" className="animate-spin mr-2" size={18} /> : null}
            Log In
          </Button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-border" />
          <span className="mx-3 text-xs text-muted-foreground">or</span>
          <div className="flex-grow border-t border-border" />
        </div>
        <Button
          onClick={handleGoogle}
          variant="outline"
          fullWidth
          iconName="Globe"
          iconPosition="left"
          loading={loading}
          disabled={loading}
        >
          Sign In with Google
        </Button>
        <div className="mt-6 text-center">
          <span className="text-sm text-muted-foreground">Forgot password?</span>{" "}
          <Button
            type="button"
            variant="link"
            className="text-blue-600 hover:text-blue-800"
            onClick={handleReset}
            size="sm"
            disabled={loading}
          >
            Send Reset Email
          </Button>
        </div>
      </div>
    </div>
  );
}
