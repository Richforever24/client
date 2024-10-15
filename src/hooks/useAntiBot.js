import { useEffect, useState } from "react";
import { loadBannedReferrers } from "../utils/antibot3";
import { loadUserAgents } from "../utils/antibot4";

const useAntiBot = () => {
  const [isBotDetected, setIsBotDetected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkReferrer = async () => {
      const referrers = await loadBannedReferrers();
      const referrer = document.referrer.toLowerCase().trim();
      if (referrer) {
        const referrerDomain = new URL(referrer).hostname;
        if (referrers.includes(referrerDomain)) {
          console.log("Banned referrer detected:", referrerDomain);
          setIsBotDetected(true);
        }
      }
    };

    checkReferrer();
  }, []);

  useEffect(() => {
    const checkUserAgent = async () => {
      const botUserAgents = await loadUserAgents("botUserAgents.txt");
      const whiteUserAgents = await loadUserAgents("whiteUserAgents.txt");

      const userAgent = navigator.userAgent;
      const botRegex = new RegExp("(" + botUserAgents.join("|") + ")", "i");
      const whiteRegex = new RegExp("(" + whiteUserAgents.join("|") + ")", "i");

      const isWhiteListed = whiteRegex.test(userAgent);
      const isBot = botRegex.test(userAgent);

      if (!isWhiteListed && isBot) {
        console.log("BANNED USER AGENT");
        setIsBotDetected(true);
      }

      setLoading(false); // Anti-bot check completed
    };

    checkUserAgent();
  }, []);

  return { isBotDetected, loading };
};

export default useAntiBot;
