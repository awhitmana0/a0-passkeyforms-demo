import React from "react";
import UnconfiguredScreen from "./UnconfiguredScreen";

interface ScreenErrorBoundaryProps {
  children: React.ReactNode;
  screenName: string;
  theme?: "default" | "rei" | "themed";
}

interface ScreenErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ScreenErrorBoundary extends React.Component<
  ScreenErrorBoundaryProps,
  ScreenErrorBoundaryState
> {
  constructor(props: ScreenErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ScreenErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {
    // Error logging could be added here for production monitoring
  }

  render() {
    if (this.state.hasError) {
      return (
        <UnconfiguredScreen
          screenName={this.props.screenName}
          theme={this.props.theme}
        />
      );
    }

    return this.props.children;
  }
}

export default ScreenErrorBoundary;