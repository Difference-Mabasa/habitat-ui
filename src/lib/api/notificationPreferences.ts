import type { ApiClient } from "./client";

export type NotificationCategory =
  | "SYSTEM"
  | "ACCOUNT"
  | "ONBOARDING"
  | "MESSAGING"
  | "BILLING"
  | "MARKETING";

export type NotificationChannel = "IN_APP" | "EMAIL" | "SMS";

export interface PreferenceCell {
  category: NotificationCategory;
  channel: NotificationChannel;
  enabled: boolean;
  /** Cells the user can't change (currently SYSTEM × IN_APP only). */
  locked: boolean;
}

export interface NotificationPreferenceMatrix {
  categories: NotificationCategory[];
  channels: NotificationChannel[];
  cells: PreferenceCell[];
}

export interface NotificationPreferencesApi {
  matrix(): Promise<NotificationPreferenceMatrix>;
  update(payload: {
    category: NotificationCategory;
    channel: NotificationChannel;
    enabled: boolean;
  }): Promise<void>;
}

export function createNotificationPreferencesApi(client: ApiClient): NotificationPreferencesApi {
  return {
    async matrix() {
      return client.get<NotificationPreferenceMatrix>("/preferences/notifications");
    },
    async update(payload) {
      await client.patch<void>("/preferences/notifications", payload);
    },
  };
}

/** Human-friendly label per category. */
export const CATEGORY_LABEL: Record<NotificationCategory, string> = {
  SYSTEM: "Account & security",
  ACCOUNT: "Account changes",
  ONBOARDING: "Getting started",
  MESSAGING: "Messages & replies",
  BILLING: "Billing & payments",
  MARKETING: "Recommendations & promos",
};

/** Short description shown under each category row. */
export const CATEGORY_DESCRIPTION: Record<NotificationCategory, string> = {
  SYSTEM: "Security alerts, password resets, legal updates. In-app delivery can't be muted.",
  ACCOUNT: "Profile changes, role grants, email verification.",
  ONBOARDING: "Welcome nudges and reminders to complete your profile.",
  MESSAGING: "Direct messages, replies on your posts, application responses.",
  BILLING: "Invoices, rent due, payouts, refunds.",
  MARKETING: "Listing recommendations, price-drop alerts, referral offers.",
};

export const CHANNEL_LABEL: Record<NotificationChannel, string> = {
  IN_APP: "In-app",
  EMAIL: "Email",
  SMS: "SMS",
};
