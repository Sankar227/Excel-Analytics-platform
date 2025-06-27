import React, { useEffect } from "react";

const GoogleCallback = () => {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
      window.opener.postMessage(
        { code },
        "https://excel-analytics-platform-frontend-7gp4.onrender.com"
      );
      window.close();
    } else {
      window.close(); // No code, close anyway
    }
  }, []);

  return <p>Processing login...</p>;
};

export default GoogleCallback;
