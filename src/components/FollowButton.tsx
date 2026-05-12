import { useState } from "react";
import Button from "./Button";

export interface FollowButtonProps {
  /** Initial state — true if the current user already follows this user. */
  initialFollowing?: boolean;
  /** Display name of the target — shown in toast / a11y label. */
  name?: string;
  size?: "sm" | "md" | "lg";
  /** Fired after the toggle. Receives the new following state. */
  onChange?: (following: boolean) => void;
}

export default function FollowButton({
  initialFollowing = false,
  size = "sm",
  onChange,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [hover, setHover] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !following;
    setFollowing(next);
    onChange?.(next);
  };

  if (following) {
    return (
      <Button
        variant={hover ? "ghost" : "secondary"}
        size={size}
        onClick={toggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={hover ? { color: "var(--danger)" } : undefined}
        aria-pressed
      >
        {hover ? "Unfollow" : "Following"}
      </Button>
    );
  }

  return (
    <Button variant="accent" size={size} onClick={toggle} leftIcon="plus">
      Follow
    </Button>
  );
}
