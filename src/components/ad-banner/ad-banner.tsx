'use client';

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdBanner() {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adsenseSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

  useEffect(() => {
    if (!adsenseClientId || !adsenseSlotId || !window.adsbygoogle) {
      return;
    }

    try {
      window.adsbygoogle.push({});
    } catch {
      // Ignore duplicate init attempts during dev refreshes.
    }
  }, [adsenseClientId, adsenseSlotId]);

  if (!adsenseClientId || !adsenseSlotId) {
    return null;
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", width: "100%", height: "60px" }}
      data-ad-client={adsenseClientId}
      data-ad-slot={adsenseSlotId}
      data-ad-format="auto"
    />
  );
}
