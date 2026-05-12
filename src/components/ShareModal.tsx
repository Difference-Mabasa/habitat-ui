import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";
import Eyebrow from "./Eyebrow";
import Icon, { type IconName } from "./Icon";
import { toast } from "@/lib/toast";

export interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  /** Absolute URL — built by the caller (origin + path). */
  url: string;
  /** Title used as the share subject + Web Share API title. */
  title?: string;
  /** Body / preview used by Web Share API. */
  body?: string;
}

interface ShareTarget {
  id: string;
  label: string;
  icon: IconName;
  build: (url: string, title: string, body: string) => string;
}

const TARGETS: ShareTarget[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "chat",
    build: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    id: "email",
    label: "Email",
    icon: "chat",
    build: (url, title, body) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${body}\n\n${url}`)}`,
  },
  {
    id: "twitter",
    label: "X / Twitter",
    icon: "arrUR",
    build: (url, title) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
];

export default function ShareModal({ open, onClose, url, title = "Check this out on Habitat", body = "" }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      toast.success("Link copied.");
    } catch {
      toast.warn("Couldn't copy — select the link manually.");
    }
  };

  const native = async () => {
    if (!navigator.share) {
      toast.info("Native share unavailable on this device.");
      return;
    }
    try {
      await navigator.share({ title, text: body, url });
      onClose();
    } catch {
      /* user dismissed */
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={480}
      title="Share post"
      footer={
        <>
          <div style={{ flex: 1 }} />
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </>
      }
    >
      <Eyebrow style={{ marginBottom: 8 }}>Link</Eyebrow>
      <div style={{ display: "flex", gap: 8 }}>
        <Input value={url} readOnly className="mono" style={{ flex: 1 }} />
        <Button variant="accent" leftIcon={copied ? "check" : "doc"} onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      {typeof navigator !== "undefined" && "share" in navigator ? (
        <Button
          variant="secondary"
          leftIcon="arrUR"
          onClick={native}
          style={{ width: "100%", justifyContent: "center", marginTop: 14 }}
        >
          Share via device
        </Button>
      ) : null}

      <div style={{ marginTop: 18 }}>
        <Eyebrow style={{ marginBottom: 8 }}>Or send via</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {TARGETS.map((t) => (
            <a
              key={t.id}
              href={t.build(url, title, body)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: 14,
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                textDecoration: "none",
                color: "var(--ink)",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              <Icon name={t.icon} size={18} style={{ color: "var(--slate)" }} />
              {t.label}
            </a>
          ))}
        </div>
      </div>
    </Modal>
  );
}
