import { useEffect } from "react";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { TokenProvider } from "@pusher/push-notifications-web";
import { AUTHENT_HEADER } from "../model/common";
import type { Session } from "../model/common";

const BEAMS_INSTANCE_ID = "3cedca19-9a14-461e-8c96-2e1394f80693";

export function useBeams(session: Session | null) {
  useEffect(() => {
    if (!session?.externalId || !session.token) return;

    let cancelled = false;

    const beamsClient = new PusherPushNotifications.Client({
      instanceId: BEAMS_INSTANCE_ID,
    });

    async function initializeBeams() {
      try {
        if (!("Notification" in window)) return;

        if (Notification.permission === "default") {
          await Notification.requestPermission();
        }

        if (cancelled || Notification.permission !== "granted") return;

        await beamsClient.start();

        if (cancelled) return;

        const tokenProvider = new TokenProvider({
          url: "/api/beams",
          queryParams: { user_id: session.externalId },
          headers: {
            [AUTHENT_HEADER]: session.token,
          },
        });

        await beamsClient.setUserId(session.externalId, tokenProvider);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to initialize Pusher Beams:", error);
        }
      }
    }

    void initializeBeams();

    return () => {
      cancelled = true;
    };
  }, [session?.externalId, session?.token]);
}