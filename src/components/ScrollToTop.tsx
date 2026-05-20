import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router doesn't scroll the window when you navigate between routes —
 * by default the page keeps its current scroll position from the previous
 * route. Mount this component once inside <BrowserRouter> and every route
 * change will jump the window back to the top.
 *
 * If the URL has a `#hash` we let the browser handle it normally so anchor
 * links keep working.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    // `instant` avoids a long smooth-scroll on every link click — feels snappier.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
