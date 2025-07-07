import { useEffect } from "react";

const AutoRefresh = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload(); // 👈 full page refresh
    }, 30 * 1000); // 30 sec

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return null; // This component doesn't render anything
};

export default AutoRefresh;
