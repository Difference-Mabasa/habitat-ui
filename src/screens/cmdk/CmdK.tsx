import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { usePalette } from "@/lib/palette";

/**
 * The command palette is mounted globally in App.tsx and triggered by the
 * Nav "Search anywhere…" button or the ⌘K / Ctrl+K shortcut. This route is
 * kept as a deep link for the dev gallery and old bookmarks: it opens the
 * palette and drops the user onto /landing underneath.
 */
export default function CmdK() {
  const { openPalette } = usePalette();

  useEffect(() => {
    openPalette();
  }, [openPalette]);

  return <Navigate to="/landing" replace />;
}
