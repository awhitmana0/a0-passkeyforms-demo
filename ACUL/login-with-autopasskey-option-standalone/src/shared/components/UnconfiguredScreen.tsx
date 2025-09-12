import React from "react";

interface UnconfiguredScreenProps {
  screenName: string;
  theme?: "default" | "rei" | "themed";
}

const UnconfiguredScreen: React.FC<UnconfiguredScreenProps> = ({
  screenName,
  theme = "default",
}) => {
  const getThemeStyles = () => {
    switch (theme) {
      case "themed":
        return {
          container: "min-h-screen flex flex-col",
          background: { backgroundColor: "#f9fafb" },
          card: "max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-200",
          title: {},
          button:
            "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        };
      default:
        return {
          container: "min-h-screen flex items-center justify-center",
          background: { backgroundColor: "#f3f4f6" },
          card: "max-w-md w-full bg-white p-6 rounded-lg shadow border",
          title: {},
          button:
            "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
        };
    }
  };

  const styles = getThemeStyles();

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className={styles.container} style={styles.background}>
      <div className="flex items-center justify-center py-12 px-4">
        <div className={styles.card}>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Screen Not Configured
            </h1>
            <p className="text-gray-600 mb-4">
              The screen{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                {screenName}
              </span>{" "}
              is not configured.
            </p>
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <p className="text-sm text-gray-600">
                Please implement this screen or check your Auth0 ACUL
                configuration.
              </p>
            </div>
            <button onClick={reloadPage} className={styles.button}>
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnconfiguredScreen;