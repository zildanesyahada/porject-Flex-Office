import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MotionConfig, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Button, Container } from "@/components/ui";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms" },
  { to: "/#featured", label: "Featured", isAnchor: true },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const linkClass = (active: boolean) =>
  cn(
    "group relative pb-1 text-sm font-medium transition-colors duration-200",
    active ? "text-primary" : "text-text-secondary hover:text-primary",
  );

function NavUnderline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary transition-transform duration-300 ease-out motion-reduce:transition-none",
        active
          ? "origin-left scale-x-100"
          : "origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100",
      )}
    />
  );
}

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  // Scroll turun (lewat 80px) -> sembunyi. Scroll naik -> muncul lagi.
  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current > previous && current > 80) setHidden(true);
    else if (current < previous) setHidden(false);
  });

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: hidden ? "-100%" : 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur"
      >
        <Container className="grid h-[58px] grid-cols-[1fr_auto_1fr] items-center">
          <Link to="/" aria-label="FlexOffice home" className="justify-self-start">
            <img src="assets/images/logo.png" alt="FlexOffice" className="h-8" />
          </Link>

          <nav className="flex items-center gap-9" aria-label="Main">
            {links.map(({ to, label, isAnchor }) =>
              isAnchor ? (
                <a key={to} href={to} className={linkClass(false)}>
                  {label}
                  <NavUnderline active={false} />
                </a>
              ) : (
                <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => linkClass(isActive)}>
                  {({ isActive }) => (
                    <>
                      {label}
                      <NavUnderline active={isActive} />
                    </>
                  )}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3 justify-self-end">
            <Button asChild variant="outline" size="sm">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </Container>
      </motion.header>
    </MotionConfig>
  );
}
