import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "HOME" },
  { to: "/working", label: "WORKING" },
  { to: "/about", label: "ABOUT US" },
  { to: "/contacts", label: "CONTACTS" },
  { to: "/blogs", label: "BLOGS" },
  { to: "/faqs", label: "FAQs" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav
      style={{
        background: "#0f2f4a", // SAME BLUE THEME
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 999
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: 26,
            fontWeight: 700,
            color: "#ffffff",
            textDecoration: "none"
          }}
        >
          Fake Product Review Detection
        </Link>

        <ul
          style={{
            display: "flex",
            gap: 28,
            listStyle: "none",
            alignItems: "center",
            margin: 0,
            padding: 0
          }}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  color:
                    pathname === to
                      ? "#38bdf8"
                      : "rgba(255,255,255,0.75)",
                  borderBottom:
                    pathname === to
                      ? "2px solid #38bdf8"
                      : "2px solid transparent",
                  paddingBottom: 4,
                  transition: "0.2s"
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}