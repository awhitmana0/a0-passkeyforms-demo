import React, { useEffect, Suspense } from "react";
import { getCurrentScreen } from "@auth0/auth0-acul-js";
import UnconfiguredScreen from "./shared/components/UnconfiguredScreen";
import ScreenErrorBoundary from "./shared/components/ScreenErrorBoundary";

const PasskeyEnrollmentScreen = React.lazy(
  () => import("./components/PasskeyEnrollmentScreen"),
);

const App: React.FC = () => {
  const [screen, setScreen] = React.useState("");

  useEffect(() => {
    const current = getCurrentScreen();
    setScreen(current!);
    console.log("Current screen from Auth0 ACUL:", current);
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case "passkey-enrollment":
      case "passkeys":
        return <PasskeyEnrollmentScreen />;
      default:
        if (!screen) {
          return <div>Loading...</div>;
        }
        return <UnconfiguredScreen screenName={screen} theme="themed" />;
    }
  };

  return (
    <div className="passkey-enrollment-theme">
      <ScreenErrorBoundary screenName={screen} theme="themed">
        <Suspense fallback={<div>Loading...</div>}>{renderScreen()}</Suspense>
      </ScreenErrorBoundary>
    </div>
  );
};

export default App;