import type { ApiClient } from "./client";

export type NotificationType = "WELCOME" | "SYSTEM";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  actionUrl: string | null;
  actionLabel: string | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPage {
  content: NotificationItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface NotificationsApi {
  list(page?: number, size?: number): Promise<NotificationPage>;
  unreadCount(): Promise<number>;
  markAsRead(id: string): Promise<NotificationItem>;
  markAllAsRead(): Promise<void>;
  remove(id: string): Promise<void>;
}

interface RawCount {
  count: number;
}

export function createNotificationsApi(client: ApiClient): NotificationsApi {
  return {
    async list(page = 0, size = 20) {
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      return client.get<NotificationPage>(`/notifications?${params.toString()}`);
    },
    async unreadCount() {
      const raw = await client.get<RawCount>("/notifications/unread-count");
      return raw.count;
    },
    async markAsRead(id) {
      return client.patch<NotificationItem>(`/notifications/${id}/read`, undefined);
    },
    async markAllAsRead() {
      await client.patch<void>("/notifications/read-all", undefined);
    },
    async remove(id) {
      await client.delete<void>(`/notifications/${id}`);
    },
  };
}
