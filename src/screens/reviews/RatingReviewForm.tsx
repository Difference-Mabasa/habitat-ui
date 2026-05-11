import { useState } from "react";
import StarRating from "@/components/StarRating";
import Chip from "@/components/Chip";
import Textarea from "@/components/Textarea";
import Checkbox from "@/components/Checkbox";
import Button from "@/components/Button";

export interface SubratingDef {
  id: string;
  label: string;
  /** Initial value. */
  initial: number;
}

export interface RatingReviewFormProps {
  subratings: SubratingDef[];
  tags: string[];
  initialOverall?: number;
  initialSelected?: string[];
  initialBody?: string;
  initialShowName?: boolean;
  onSubmit?: (review: {
    overall: number;
    subratings: Record<string, number>;
    tags: string[];
    body: string;
    showName: boolean;
  }) => void;
}

export default function RatingReviewForm({
  subratings,
  tags,
  initialOverall = 4,
  initialSelected = [],
  initialBody = "",
  initialShowName = true,
  onSubmit,
}: RatingReviewFormProps) {
  const [overall, setOverall] = useState(initialOverall);
  const [subs, setSubs] = useState<Record<string, number>>(
    Object.fromEntries(subratings.map((s) => [s.id, s.initial])),
  );
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));
  const [body, setBody] = useState(initialBody);
  const [showName, setShowName] = useState(initialShowName);

  const toggleTag = (t: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  return (
    <div>
      {/* Overall stars */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Overall stay</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <StarRating value={overall} size="lg" interactive onChange={setOverall} />
          <span style={{ fontSize: 13, color: "var(--slate)" }}>
            {overall} / 5{overall >= 4 ? " — would recommend" : ""}
          </span>
        </div>
      </div>

      {/* Subratings */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {subratings.map((s) => (
          <div key={s.id}>
            <div style={{ fontSize: 12, color: "var(--slate)", marginBottom: 6 }}>{s.label}</div>
            <StarRating
              value={subs[s.id] ?? s.initial}
              interactive
              onChange={(v) => setSubs((prev) => ({ ...prev, [s.id]: v }))}
            />
          </div>
        ))}
      </div>

      {/* Tags */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>What stood out?</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tags.map((t) => (
            <Chip key={t} active={selected.has(t)} onClick={() => toggleTag(t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>

      {/* Free text */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Tell future tenants</div>
        <Textarea
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ resize: "none" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 16,
          borderTop: "1px solid var(--hairline)",
        }}
      >
        <Checkbox
          label="Show my name with this review"
          checked={showName}
          onChange={(e) => setShowName(e.target.checked)}
        />
        <Button
          variant="accent"
          rightIcon="arrR"
          onClick={() =>
            onSubmit?.({
              overall,
              subratings: subs,
              tags: Array.from(selected),
              body,
              showName,
            })
          }
        >
          Submit review
        </Button>
      </div>
    </div>
  );
}
