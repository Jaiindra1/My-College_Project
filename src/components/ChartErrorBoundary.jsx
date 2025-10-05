import React from "react";

class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Chart rendering error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-6 rounded-lg bg-red-50 text-red-600 font-medium">
          ⚠️ Oops! Chart failed to load. Please refresh or try again later.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ChartErrorBoundary;
