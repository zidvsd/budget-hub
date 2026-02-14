"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useNotifications } from "@/store/useNotifications";
import { useAuth } from "@/hooks/useAuth"; // Use your existing auth hook
import { toast } from "sonner";
import { Notification } from "../types/notifications";
import { useOrders } from "@/store/useOrders";

export function NotificationListener() {
  const { fetchOrders } = useOrders();
  const { user: currentUser } = useAuth(); // Get the logged-in user

  const { addNotification, fetchNotifications } = useNotifications();

  useEffect(() => {
    if (!currentUser?.id) return;

    // 1. Initial Load: Fetch existing unread notifications
    fetchNotifications(currentUser.id);

    // 2. Realtime Subscription: Listen for new ones
    const channel = supabase
      .channel(`user-changes-${currentUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          const raw = payload.new;
          if (raw.order_id) {
            // Passing 'true' for the force parameter if your store supports it
            fetchOrders("user", currentUser.id, true);
          }
          // payload.new contains the exact row just inserted into the 'notifications' table
          const newNotif: Notification = {
            id: String(raw.id),
            user_id: String(raw.user_id),
            title: String(raw.title || ""),
            message: String(raw.message || ""),
            is_read: Boolean(raw.is_read),
            created_at: raw.created_at, //
            order_id: raw.order_id,
          };

          addNotification(newNotif as any);

          toast.info(newNotif.title, {
            description: newNotif.message,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, addNotification, fetchNotifications]);

  return null; // Invisible component
}
