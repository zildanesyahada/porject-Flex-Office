import { Link } from "react-router-dom";
import { Container } from "@/components/ui";

const columns = [
  {
    title: "Explore",
    links: [
      { to: "/rooms", label: "Browse rooms" },
      { to: "/rooms?type=meeting-room", label: "Meeting rooms" },
      { to: "/rooms?type=coworking", label: "Coworking" },
      { to: "/rooms?type=private-office", label: "Private offices" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About us" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/faq", label: "FAQ" },
      { to: "/policy", label: "Cancellation policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <Container className="grid grid-cols-[1.5fr_repeat(3,1fr)] gap-12 py-14">
        <div className="flex max-w-xs flex-col gap-3">
          <img src="/images/logo.svg" alt="FlexOffice" className="h-8 w-fit brightness-0 invert" />
          <p className="text-[13px] leading-relaxed">
            Book meeting rooms, coworking spaces, and private offices across two buildings.
          </p>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white">{col.title}</h3>
            {col.links.map((l) => (
              <Link key={l.to} to={l.to} className="text-[13px] transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
        ))}
      </Container>

      <div className="border-t border-white/10 py-5 text-center text-[13px]">
        © {new Date().getFullYear()} FlexOffice. All rights reserved.
      </div>
    </footer>
  );
}
