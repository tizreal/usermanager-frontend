// src/hooks/useBackendWarmup.js
import { useEffect, useState } from "react";

// Render free instances can take up to ~60s to wake from a cold start
const EXPECTED_WAKE_SECONDS = 60;
const REQUEST_TIMEOUT_MS = 10000;
const RETRY_DELAY_MS = 3000;
// Stop polling after this long and report an error
const GIVE_UP_SECONDS = 180;

// status: "checking" -> first ping in flight
//         "waking"   -> server is cold, still retrying
//         "ready"    -> health check returned 200
//         "error"    -> gave up after GIVE_UP_SECONDS
export function useBackendWarmup(healthUrl) {
  const [status, setStatus] = useState("checking");
  const [secondsLeft, setSecondsLeft] = useState(EXPECTED_WAKE_SECONDS);

  useEffect(() => {
    let cancelled = false;
    let retryTimer;
    let ctrl;
    const startedAt = Date.now();

    // Countdown is only an estimate, so it bottoms out at 0 while still waking
    const countdown = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setSecondsLeft(Math.max(EXPECTED_WAKE_SECONDS - elapsed, 0));
    }, 1000);

    async function ping() {
      ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
      try {
        const res = await fetch(healthUrl, { signal: ctrl.signal });
        if (res.ok) {
          if (!cancelled) {
            setStatus("ready");
            clearInterval(countdown);
          }
          return;
        }
      } catch {
        // Network error or timeout: server is most likely still booting
      } finally {
        clearTimeout(timeout);
      }

      if (cancelled) return;

      if ((Date.now() - startedAt) / 1000 > GIVE_UP_SECONDS) {
        setStatus("error");
        clearInterval(countdown);
        return;
      }

      setStatus("waking");
      retryTimer = setTimeout(ping, RETRY_DELAY_MS);
    }

    ping();

    return () => {
      cancelled = true;
      clearInterval(countdown);
      clearTimeout(retryTimer);
      ctrl?.abort();
    };
  }, [healthUrl]);

  return { status, secondsLeft };
}
