import type { MouseEvent } from "react";
import { Link } from "react-router-dom";

function goHome(event: MouseEvent<HTMLAnchorElement>) {
  if (window.location.pathname === "/") {
    event.preventDefault();
    window.dispatchEvent(new Event("portfolio-home"));
  }
}

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 py-4 sm:px-6 sm:py-6">
      <nav className="nav-cluster" aria-label="Site">
        <Link to="/" onClick={goHome}>
          Home
        </Link>
      </nav>
    </header>
  );
}
