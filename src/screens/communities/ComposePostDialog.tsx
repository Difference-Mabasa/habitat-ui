import { useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Avatar from "@/components/Avatar";
import Eyebrow from "@/components/Eyebrow";
import Chip from "@/components/Chip";
import Icon from "@/components/Icon";
import Textarea from "@/components/Textarea";
import { toast } from "@/lib/toast";
import { POST_TAGS, type PostTag } from "./feedData";

const MAX_CHARS = 480;

export interface ComposePostDialogProps {
  open: boolean;
  onClose: () => void;
  /** Area to attach to the post — defaults to the current user's area. */
  defaultArea?: string;
}

export default function ComposePostDialog({
  open,
  onClose,
  defaultArea = "Brixton",
}: ComposePostDialogProps) {
  const [body, setBody] = useState("");
  const [tag, setTag] = useState<PostTag | null>(null);
  const [area, setArea] = useState(defaultArea);
  const canPost = body.trim().length > 0 && tag != null;
  const remaining = MAX_CHARS - body.length;

  const submit = () => {
    toast.success("Posted to your feed.");
    setBody("");
    setTag(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={560}
      title="Create a post"
      footer={
        <>
          <span style={{ fontSize: 12, color: remaining < 0 ? "var(--danger)" : "var(--slate)" }} className="tabular">
            {remaining} / {MAX_CHARS}
          </span>
          <div style={{ flex: 1 }} />
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="accent" leftIcon="check" disabled={!canPost} onClick={submit}>
            Post
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Avatar name="Sipho Dlamini" size="md" tone="neutral" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Sipho Dlamini</div>
          <div style={{ fontSize: 11, color: "var(--slate)", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
            <Icon name="pin" size={11} />
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                fontFamily: "inherit",
                fontSize: 11,
                color: "var(--slate)",
                padding: 0,
                appearance: "none",
                cursor: "pointer",
              }}
            >
              {["Brixton", "Melville", "Westdene", "Yeoville", "Orlando West", "Maboneng"].map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <span>· Public</span>
          </div>
        </div>
      </div>

      <Textarea
        rows={5}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What's happening in your hood?"
        style={{ marginTop: 16 }}
      />

      <div style={{ marginTop: 16 }}>
        <Eyebrow style={{ marginBottom: 8 }}>Tag · required</Eyebrow>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {POST_TAGS.map((t) => (
            <Chip key={t} active={tag === t} onClick={() => setTag(t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>
    </Modal>
  );
}
