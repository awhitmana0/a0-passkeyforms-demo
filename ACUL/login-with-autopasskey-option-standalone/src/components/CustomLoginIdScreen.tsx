import React, { useEffect, useState } from "react";
import LoginIdInstance from "@auth0/auth0-acul-js/login-id";
import { applyAuth0Theme } from "@/utils/theme";
import { rebaseLinkToCurrentOrigin } from "@/utils/helpers/urlUtils";

const CustomLoginIdScreen: React.FC = () => {
  const [loginIdInstance] = useState(() => new LoginIdInstance());
  const [showPasskeyOnly, setShowPasskeyOnly] = useState(false);
  const [conditionalUIStarted, setConditionalUIStarted] = useState(false);

  const pageTitle = loginIdInstance?.screen?.texts?.pageTitle || "Login";
  document.title = pageTitle;

  // Apply theme from SDK instance when screen loads
  applyAuth0Theme(loginIdInstance);

  useEffect(() => {
    // Check for ext-passkeyonly parameter in Auth0 ACUL untrustedData
    if (loginIdInstance) {
      // Try multiple possible locations for the parameter
      const untrustedData = (loginIdInstance as any)?.untrustedData;
      const authParams = untrustedData?.authorizationParams;
      
      // Check different possible parameter names/locations
      const passkeyOnlyValue = 
        authParams?.[`ext-passkeyonly`] ||
        authParams?.['ext-passkeyonly'] ||
        untrustedData?.[`ext-passkeyonly`] ||
        untrustedData?.['ext-passkeyonly'];
        
      const isPasskeyOnly = passkeyOnlyValue === "true" || passkeyOnlyValue === true;
      setShowPasskeyOnly(isPasskeyOnly);
      
      console.log("Full untrustedData:", untrustedData);
      console.log("authorizationParams:", authParams);
      console.log("ext-passkeyonly parameter value:", passkeyOnlyValue);
      console.log("ext-passkeyonly resolved to:", isPasskeyOnly);
    }
  }, [loginIdInstance]);

  // Direct passkey login for passkey-only mode (bypasses data checks)
  const handleDirectPasskeyLogin = () => {
    console.log("Direct passkey login triggered...");
    if (loginIdInstance && loginIdInstance.passkeyLogin) {
      try {
        loginIdInstance.passkeyLogin();
      } catch (error) {
        console.error("Error triggering passkey login:", error);
      }
    }
  };

  // Start WebAuthn conditional UI for normal mode (subtle popup)
  const startConditionalUI = async () => {
    // Only start if not in passkey-only mode and not already started
    if (!showPasskeyOnly && !conditionalUIStarted) {
      console.log("Starting WebAuthn conditional UI...");
      setConditionalUIStarted(true);
      
      try {
        // Use browser's native conditional UI
        if ('credentials' in navigator && 'get' in navigator.credentials) {
          const credential = await navigator.credentials.get({
            publicKey: {
              challenge: new Uint8Array(32), // Dummy challenge for conditional UI
              rpId: window.location.hostname,
              allowCredentials: [], // Empty to allow any credential
              userVerification: 'preferred',
              timeout: 300000 // 5 minutes
            },
            mediation: 'conditional' // This triggers the subtle popup
          } as any);
          
          if (credential) {
            console.log("Conditional credential received, passing to Auth0...");
            // If we get a credential, trigger Auth0's passkey flow
            if (loginIdInstance && loginIdInstance.passkeyLogin) {
              loginIdInstance.passkeyLogin();
            }
          }
        }
      } catch (error) {
        console.log("Conditional UI cancelled or failed:", error);
        setConditionalUIStarted(false);
      }
    }
  };

  // Auto-trigger passkey login when passkey-only mode is active
  useEffect(() => {
    if (showPasskeyOnly) {
      console.log("Passkey-only mode: Auto-triggering full passkey popup...");
      // Add a small delay to ensure the UI has rendered
      setTimeout(() => {
        // For ext-passkeyonly=true, always trigger the passkey flow
        // Bypass the data checks from useLoginIdManager
        handleDirectPasskeyLogin();
      }, 500);
    }
  }, [showPasskeyOnly, loginIdInstance]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    
    console.log("Continue with email:", email);
    if (email && loginIdInstance) {
      loginIdInstance.login({ username: email.trim() });
    }
  };

  const handleGoogleLogin = () => {
    console.log("Continue with Google...");
    if (loginIdInstance && (loginIdInstance as any).socialLogin) {
      try {
        (loginIdInstance as any).socialLogin({ connection: "google-oauth2" });
      } catch (error) {
        console.error("Error triggering Google login:", error);
      }
    }
  };

  const handleClose = () => {
    console.log("Closing passkey flow and going back...");
    window.history.back();
  };

  const handleEmailClick = () => {
    console.log("Email field clicked");
    // Start conditional UI for subtle popup in normal mode
    if (!showPasskeyOnly) {
      startConditionalUI();
    }
  };

  // Get proper Auth0 links
  const signupLink = loginIdInstance?.screen?.links?.signup;
  const localizedSignupLink = rebaseLinkToCurrentOrigin(signupLink);
  const resetPasswordLink = loginIdInstance?.screen?.links?.reset_password;
  const localizedResetPasswordLink = rebaseLinkToCurrentOrigin(resetPasswordLink);

  // If ext-passkeyonly param is present, show only the passkey button
  if (showPasskeyOnly) {
    return (
      <div className="login-container">
        <div className="logo">
          <img
            src="https://awhitmana0.github.io/logo.svg"
            alt="Logo"
            className="logo-image"
          />
        </div>

        <div className="passkey-only-container">
          <h1 className="passkey-title">Sign in with Passkey</h1>
          <p className="passkey-subtitle">
            Please complete the passkey authentication
          </p>
          <button
            className="passkey-subtle-button"
            onClick={handleDirectPasskeyLogin}
          >
            Passkey pop-up not showing? Click Here
          </button>
          <button className="close-button" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  // Otherwise, render the custom designed login view
  return (
    <div className="login-container">
      <div className="logo">
        <img
          src="https://awhitmana0.github.io/logo.svg"
          alt="Logo"
          className="logo-image"
        />
      </div>

      <h1 className="welcome-title">Welcome</h1>
      <p className="subtitle">
        Log in to passkey-demo-awhit to continue to
        <br />
        Quickstart.
      </p>

      <form onSubmit={handleContinue}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email address*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="email-input"
            onClick={handleEmailClick}
            onFocus={handleEmailClick}
            autoComplete="username webauthn"
            required
          />
        </div>

        {localizedResetPasswordLink && (
          <a href={localizedResetPasswordLink} className="help-link">
            Can't log in to your account?
          </a>
        )}

        <button type="submit" className="continue-btn">
          Continue
        </button>

        <div className="signup-text">
          Don't have an account?{" "}
          {localizedSignupLink && (
            <a href={localizedSignupLink} className="signup-link">
              Sign up
            </a>
          )}
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google"
            className="google-icon-img"
          />
          Continue with Google
        </button>

      </form>
    </div>
  );
};

export default CustomLoginIdScreen;