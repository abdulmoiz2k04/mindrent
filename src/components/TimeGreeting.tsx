"use client";

import { useEffect, useState } from "react";

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 11) {
    return "good morning, take it slow";
  }

  if (hour >= 11 && hour < 14) {
    return "hope your morning was kind";
  }

  if (hour >= 14 && hour < 17) {
    return "mid-afternoon slump?";
  }

  if (hour >= 17 && hour < 21) {
    return "evening. you made it.";
  }

  return "late night, be gentle";
}

export function TimeGreeting() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setGreeting(getGreeting(new Date().getHours()));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!greeting) {
    return null;
  }

  return (
    <span className="text-xs font-semibold italic lowercase leading-4 text-brand-purple/55">
      {greeting}
    </span>
  );
}
