import React from "react";

const ServerStatusBanner = ({ status, secondsLeft }) => {
  if (status === "ready") {
    return (
      <div className="w-full max-w-lg mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 text-center">
        Server is awake and ready.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full max-w-lg mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 text-center">
        The server isn't responding. Please refresh the page to try again.
      </div>
    );
  }

  // "checking" or "waking"
  return (
    <div className="w-full max-w-lg mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-3">
      <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      <span>
        {status === "checking" ? (
          "Connecting to the server..."
        ) : (
          <>
            Waking up the server (it sleeps when idle on the free hosting tier).
            {secondsLeft > 0
              ? ` About ${secondsLeft}s left.`
              : " Almost there..."}
          </>
        )}
      </span>
    </div>
  );
};

export default ServerStatusBanner;
