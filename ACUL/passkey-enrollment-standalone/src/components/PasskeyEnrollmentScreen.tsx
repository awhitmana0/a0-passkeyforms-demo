import React, { useEffect } from "react";
import PasskeyEnrollment from "@auth0/auth0-acul-js/passkey-enrollment";

const PasskeyEnrollmentScreen: React.FC = () => {
  useEffect(() => {
    const skipPasskeyEnrollment = async () => {
      try {
        const screenInstance = new PasskeyEnrollment();
        await screenInstance.abortPasskeyEnrollment();
      } catch (error) {
        console.error("Error aborting passkey enrollment:", error);
      }
    };

    skipPasskeyEnrollment();
  }, []);

  return null;
};

export default PasskeyEnrollmentScreen;