// src/pages/user-settings/components/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const DEFAULT_USER_IMG = "/assets/images/default-user.png";

export default function UserProfile() {
  const {
    currentUser,
    logout,
    updateUserProfile
  } = useAuth();

  const [profile, setProfile]     = useState(null);
  const [fullName, setFullName]   = useState("");
  const [dob, setDob]             = useState("");
  const [msg, setMsg]             = useState("");
  const [editing, setEditing]     = useState(false);
  const [loading, setLoading]     = useState(true);

  // load Firestore user-doc
  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    getDoc(doc(db, "users", currentUser.uid)).then(snap => {
      const data = snap.data();
      setProfile(data);
      setFullName(data.fullName);
      setDob(data.dob);
      setLoading(false);
    });
  }, [currentUser]);

  if (!currentUser) return <p className="text-center py-8">Please log in.</p>;
  if (loading || !profile) return <p className="text-center py-8">Loading…</p>;

  async function handleProfileUpdate(e) {
    e.preventDefault();
    try {
      await updateUserProfile({ fullName, dob });
      setMsg("Profile updated");
      setEditing(false);
      setProfile({ ...profile, fullName, dob });
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 border border-border">
      <div className="flex flex-col items-center mb-6">
        <img
          src={currentUser.photoURL || DEFAULT_USER_IMG}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-accent mb-3"
        />
        <h2 className="text-2xl font-heading font-bold text-primary mb-1">
          {profile.fullName || currentUser.displayName || "Your Name"}
        </h2>
        <p className="text-sm text-text-secondary mb-1">{profile.email}</p>
        <p className="text-xs text-muted-foreground">User ID: {profile.uid}</p>
      </div>

      {msg && <div className="mb-4 p-2 rounded bg-green-100 text-green-700 text-sm border border-green-200 text-center">{msg}</div>}

      {!editing ? (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-primary">Full Name:</span>
              <span className="text-text-secondary">{profile.fullName}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-primary">Date of Birth:</span>
              <span className="text-text-secondary">{profile.dob}</span>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              className="px-4 py-2 rounded bg-accent text-white font-medium hover:bg-accent/90 transition"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 text-white font-medium hover:bg-red-700 transition"
              onClick={logout}
            >
              Sign Out
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-base"
              required
            />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-accent text-white font-medium hover:bg-accent/90 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
      