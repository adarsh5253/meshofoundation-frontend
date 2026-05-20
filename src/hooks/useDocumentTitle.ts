import { useEffect } from "react";

/**
 * Set <title> while a component is mounted, restore the previous title on
 * unmount. Lightweight alternative to react-helmet for pages that just need
 * to update the title.
 *
 *   useDocumentTitle("Privacy Policy — Mesho Foundation");
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    if (!title) return;
    const prev = document.title;
    document.title = title;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
