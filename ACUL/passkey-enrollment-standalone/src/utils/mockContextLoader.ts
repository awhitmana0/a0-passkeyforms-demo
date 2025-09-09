export async function loadAndSetMockContext(): Promise<void> {
  if (!import.meta.env.DEV) {
    return;
  }

  const screenName = import.meta.env.VITE_SCREEN_NAME || "passkey-enrollment";

  try {
    console.log(`[DEV] Loading mock data for screen: ${screenName}...`);
    console.log(`[DEV] Using simple mock context for standalone version`);
    (window as any).universal_login_context = {
      screen: screenName,
      client: {
        name: "Passkey Enrollment Demo"
      }
    };
  } catch (error) {
    console.error(
      `DEV_ERROR: Failed to load mock data for '${screenName}'. Error:`,
      error,
    );
    (window as any).universal_login_context = {};
  }
}