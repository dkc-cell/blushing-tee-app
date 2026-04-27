import React, { useEffect, useState } from 'react';
import { COLORS } from '../constants';
import { supabase } from '../lib/supabase';
import {
  backupLocalDataToCloud,
  restoreCloudData,
} from '../services/cloudBackupService';

const fieldStyle = {
  width: '100%',
  padding: '13px 14px',
  borderRadius: '12px',
  border: `2px solid ${COLORS.mistyBlue}`,
  fontSize: '16px',
  fontFamily: 'inherit',
  color: COLORS.charcoal,
  background: '#FFFFFF',
  boxSizing: 'border-box',
};

const buttonBaseStyle = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: '14px',
  border: 'none',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
};

const getFriendlyBackupError = (backupError) => {
  const message = backupError?.message || '';

  if (
    message.includes('schema cache') ||
    message.includes("Could not find the table")
  ) {
    return 'Cloud backup tables are not set up yet. Run supabase-schema.sql in the Supabase SQL Editor, then try again.';
  }

  return message || 'Unable to back up your local data. Please try again.';
};

export default function AccountBackupScreen({
  user,
  authLoading,
  isSupabaseConfigured,
  isPasswordRecovery,
  onPasswordRecoveryComplete,
  rounds,
  courses,
  onRestoreData,
  onBack,
}) {
  const [mode, setMode] = useState('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const localRoundCount = rounds.length;
  const localCourseCount = courses.length;
  const hasLocalData = localRoundCount > 0 || localCourseCount > 0;

  useEffect(() => {
    if (!user) return;

    setPassword('');
    setMessage('');
    setError('');
  }, [user]);

  const resetStatus = () => {
    setMessage('');
    setError('');
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    resetStatus();

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const authCall =
        mode === 'create'
          ? supabase.auth.signUp({
              email: email.trim(),
              password,
              options: {
                emailRedirectTo: window.location.origin + '/app',
              },
            })
          : supabase.auth.signInWithPassword({
              email: email.trim(),
              password,
            });

      const { error: authError } = await authCall;

      if (authError) throw authError;

      setPassword('');
      setMessage(
        mode === 'create'
          ? 'Check your email to confirm your account, then come back to sign in.'
          : 'You are signed in.'
      );
    } catch (authError) {
      setError(authError.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    resetStatus();

    if (!email.trim()) {
      setError('Enter your email address first.');
      return;
    }

    setSubmitting(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: window.location.origin + '/app?password-reset=1',
        }
      );

      if (resetError) throw resetError;

      setPassword('');
      setMessage('Check your email for a password reset link.');
    } catch (resetError) {
      setError(resetError.message || 'Unable to send reset email. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewPasswordSubmit = async (event) => {
    event.preventDefault();
    resetStatus();

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        throw new Error('This password reset link is expired or incomplete. Request a new reset email and use the latest link.');
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setNewPassword('');
      onPasswordRecoveryComplete();
      window.history.replaceState({}, document.title, '/app');
      setMessage('Your password has been updated.');
    } catch (updateError) {
      setError(updateError.message || 'Unable to update your password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    resetStatus();
    setSubmitting(true);

    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setMessage('You are signed out. Local data is still available on this device.');
    } catch (signOutError) {
      setError(signOutError.message || 'Unable to sign out. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackupLocalData = async () => {
    resetStatus();

    if (localRoundCount === 0 && localCourseCount === 0) {
      setMessage('There is no local round or course data to back up yet.');
      return;
    }

    setBackupLoading(true);

    try {
      const result = await backupLocalDataToCloud({ user, rounds, courses });
      setMessage(
        `Backed up ${result.roundsBackedUp} round${
          result.roundsBackedUp === 1 ? '' : 's'
        } and ${result.coursesBackedUp} course${
          result.coursesBackedUp === 1 ? '' : 's'
        } to your account.`
      );
    } catch (backupError) {
      setError(getFriendlyBackupError(backupError));
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestoreCloudData = async () => {
    resetStatus();

    const shouldRestore = window.confirm(
      'Restore cloud backup to this device? This will replace the local rounds and courses currently stored on this device.'
    );

    if (!shouldRestore) return;

    setRestoreLoading(true);

    try {
      const restoredData = await restoreCloudData({ user });

      if (
        restoredData.rounds.length === 0 &&
        restoredData.courses.length === 0
      ) {
        setMessage('No cloud backup data was found for this account.');
        return;
      }

      onRestoreData(restoredData);
      setMessage(
        `Restored ${restoredData.rounds.length} round${
          restoredData.rounds.length === 1 ? '' : 's'
        } and ${restoredData.courses.length} course${
          restoredData.courses.length === 1 ? '' : 's'
        } to this device.`
      );
    } catch (restoreError) {
      setError(getFriendlyBackupError(restoreError));
    } finally {
      setRestoreLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLORS.cream,
        paddingBottom: '80px',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '20px 24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '24px',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: COLORS.darkTeal,
            fontSize: '18px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '8px',
          }}
        >
          ← Back
        </button>
        <h2
          style={{
            color: COLORS.darkTeal,
            fontSize: '28px',
            fontWeight: 'bold',
            margin: 0,
          }}
        >
          Account & Backup
        </h2>
        <p style={{ color: COLORS.charcoal, fontSize: '17px', margin: '6px 0 0' }}>
          Keep using local mode, or sign in when you want cloud backup.
        </p>
      </div>

      <div style={{ padding: '0 24px', display: 'grid', gap: '18px' }}>
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '22px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <h3 style={{ color: COLORS.darkTeal, margin: '0 0 12px', fontSize: '20px' }}>
            Local data on this device
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              style={{
                background: `${COLORS.blush}24`,
                borderRadius: '14px',
                padding: '14px',
                textAlign: 'center',
              }}
            >
              <div style={{ color: COLORS.darkTeal, fontSize: '30px', fontWeight: 800 }}>
                {localRoundCount}
              </div>
              <div style={{ color: COLORS.charcoal, fontWeight: 600 }}>Rounds</div>
            </div>
            <div
              style={{
                background: `${COLORS.mistyBlue}33`,
                borderRadius: '14px',
                padding: '14px',
                textAlign: 'center',
              }}
            >
              <div style={{ color: COLORS.darkTeal, fontSize: '30px', fontWeight: 800 }}>
                {localCourseCount}
              </div>
              <div style={{ color: COLORS.charcoal, fontWeight: 600 }}>Courses</div>
            </div>
          </div>
          <p style={{ color: COLORS.charcoal, lineHeight: 1.55, margin: '14px 0 0' }}>
            Local mode stays private and works without an account. Cloud backup will be optional.
          </p>
        </section>

        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '22px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {!isSupabaseConfigured ? (
            <div>
              <h3 style={{ color: COLORS.darkTeal, margin: '0 0 10px', fontSize: '20px' }}>
                Cloud backup is not configured
              </h3>
              <p style={{ color: COLORS.charcoal, lineHeight: 1.6, margin: 0 }}>
                Add your Supabase URL and publishable key to enable account creation.
              </p>
            </div>
          ) : authLoading ? (
            <p style={{ color: COLORS.charcoal, margin: 0 }}>Checking account status...</p>
          ) : isPasswordRecovery ? (
            <div>
              <h3 style={{ color: COLORS.darkTeal, margin: '0 0 10px', fontSize: '20px' }}>
                Set New Password
              </h3>
              <p style={{ color: COLORS.charcoal, lineHeight: 1.6, margin: '0 0 16px' }}>
                Enter a new password for your account.
              </p>
              <form onSubmit={handleNewPasswordSubmit} style={{ display: 'grid', gap: '12px' }}>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="New password"
                  autoComplete="new-password"
                  style={fieldStyle}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    ...buttonBaseStyle,
                    backgroundColor: COLORS.darkTeal,
                    color: COLORS.cream,
                    opacity: submitting ? 0.65 : 1,
                  }}
                >
                  {submitting ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          ) : user ? (
            <div>
              <h3 style={{ color: COLORS.darkTeal, margin: '0 0 10px', fontSize: '20px' }}>
                Signed in
              </h3>
              <p style={{ color: COLORS.charcoal, lineHeight: 1.6, margin: '0 0 16px' }}>
                {user.email}
              </p>
              <p style={{ color: '#5f6f73', lineHeight: 1.6, margin: '0 0 18px' }}>
                {hasLocalData
                  ? 'Cloud backup is optional. Your local data stays on this device unless you back it up.'
                  : 'Your account is ready. Record a round or save a course, then come back here to back it up.'}
              </p>
              <button
                type="button"
                onClick={handleBackupLocalData}
                disabled={!hasLocalData || backupLoading || restoreLoading || submitting}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: COLORS.darkTeal,
                  color: COLORS.cream,
                  cursor:
                    !hasLocalData || backupLoading || restoreLoading || submitting
                      ? 'default'
                      : 'pointer',
                  opacity: !hasLocalData || backupLoading || restoreLoading || submitting ? 0.65 : 1,
                  marginBottom: '10px',
                }}
              >
                {backupLoading
                  ? 'Backing Up...'
                  : hasLocalData
                  ? 'Back Up Local Data'
                  : 'No Local Data to Back Up Yet'}
              </button>
              <button
                type="button"
                onClick={handleRestoreCloudData}
                disabled={backupLoading || restoreLoading || submitting}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: COLORS.blush,
                  color: COLORS.charcoal,
                  opacity: backupLoading || restoreLoading || submitting ? 0.65 : 1,
                  marginBottom: '10px',
                }}
              >
                {restoreLoading ? 'Restoring...' : 'Restore Cloud Backup'}
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={submitting || backupLoading || restoreLoading}
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: COLORS.mistyBlue,
                  color: COLORS.darkTeal,
                  opacity: submitting || backupLoading || restoreLoading ? 0.65 : 1,
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  marginBottom: '18px',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMode('signIn');
                    resetStatus();
                  }}
                  style={{
                    ...buttonBaseStyle,
                    backgroundColor: mode === 'signIn' ? COLORS.darkTeal : COLORS.mistyBlue,
                    color: mode === 'signIn' ? COLORS.cream : COLORS.darkTeal,
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('create');
                    resetStatus();
                  }}
                  style={{
                    ...buttonBaseStyle,
                    backgroundColor: mode === 'create' ? COLORS.darkTeal : COLORS.mistyBlue,
                    color: mode === 'create' ? COLORS.cream : COLORS.darkTeal,
                  }}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} style={{ display: 'grid', gap: '12px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  autoComplete="email"
                  style={fieldStyle}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
                  style={fieldStyle}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    ...buttonBaseStyle,
                    backgroundColor: COLORS.darkTeal,
                    color: COLORS.cream,
                    opacity: submitting ? 0.65 : 1,
                  }}
                >
                  {submitting
                    ? 'Please wait...'
                    : mode === 'create'
                    ? 'Create Account'
                    : 'Sign In'}
                </button>
              </form>
              {mode === 'signIn' && (
                <button
                  type="button"
                  onClick={handlePasswordResetRequest}
                  disabled={submitting}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: COLORS.darkTeal,
                    cursor: submitting ? 'default' : 'pointer',
                    fontSize: '15px',
                    fontWeight: 700,
                    marginTop: '12px',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>
          )}

          {message && (
            <p style={{ color: COLORS.darkTeal, lineHeight: 1.55, margin: '16px 0 0' }}>
              {message}
            </p>
          )}
          {error && (
            <p style={{ color: '#A9444A', lineHeight: 1.55, margin: '16px 0 0' }}>
              {error}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
