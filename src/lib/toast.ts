import type { ReactNode } from "react";

export type ToastTone = "success" | "error" | "info" | "warn";

export interface Toast {
  id: string;
  tone: ToastTone;
  message: ReactNode;
  duration: number;
}

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();

function emit() {
  for (const fn of listeners) fn(toasts);
}

function push(tone: ToastTone, message: ReactNode, duration = 4000): string {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  toasts = [...toasts, { id, tone, message, duration }];
  emit();
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration);
  }
  return id;
}

function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export const toast = {
  success: (message: ReactNode, duration?: number) => push("success", message, duration),
  error: (message: ReactNode, duration?: number) => push("error", message, duration),
  info: (message: ReactNode, duration?: number) => push("info", message, duration),
  warn: (message: ReactNode, duration?: number) => push("warn", message, duration),
  dismiss,
};

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  listener(toasts);
  return () => {
    listeners.delete(listener);
  };
}
