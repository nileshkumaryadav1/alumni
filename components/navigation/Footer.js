import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { whatsapp, facebook, instagram, linkedin, github, youtube } = {
    whatsapp: "https://wa.me/1234567890",
    facebook: "https://www.facebook.com/yourpage",
    instagram: "https://www.instagram.com/yourpage",
    linkedin: "https://www.linkedin.com/in/yourpage",
    github: "https://github.com/yourpage",
    youtube: "https://www.youtube.com/yourpage",
  };

  return (
    <footer
      className="px-6 py-10 md:py-12 sm:px-16 text-center space-y-6"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* 📌 Navigation Links */}
      <nav aria-label="Footer navigation">
        <ul className="flex justify-center flex-wrap gap-4">
          {[
            { href: "/", label: "Home" },
            { href: "/alumni", label: "Explore" },
            { href: "/networking", label: "Network" },
            { href: "/events", label: "Events" },
            { href: "/dashboard", label: "Profile" },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm transition"
                style={{ color: "var(--secondary)" }}
              >
                <span className="hover:text-[var(--accent)] transition">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 🌐 Social Icons */}
      <div className="flex justify-center gap-6">
        {whatsapp && (
          <Link
            href={whatsapp}
            target="_blank"
            aria-label="WhatsApp"
            style={{ color: "var(--secondary)" }}
          >
            <FaWhatsapp
              size={24}
              className="hover:text-[var(--accent)] transition"
            />
          </Link>
        )}
        {facebook && (
          <Link
            href={facebook}
            target="_blank"
            aria-label="Facebook"
            style={{ color: "var(--secondary)" }}
          >
            <Facebook
              size={24}
              className="hover:text-[var(--accent)] transition"
            />
          </Link>
        )}
        {instagram && (
          <Link
            href={instagram}
            target="_blank"
            aria-label="Instagram"
            style={{ color: "var(--secondary)" }}
          >
            <Instagram
              size={24}
              className="hover:text-[var(--highlight)] transition"
            />
          </Link>
        )}
        {linkedin && (
          <Link
            href={linkedin}
            target="_blank"
            aria-label="LinkedIn"
            style={{ color: "var(--secondary)" }}
          >
            <Linkedin
              size={24}
              className="hover:text-[var(--highlight)] transition"
            />
          </Link>
        )}
        {github && (
          <Link
            href={github}
            target="_blank"
            aria-label="GitHub"
            style={{ color: "var(--secondary)" }}
          >
            <Github
              size={24}
              className="hover:text-[var(--foreground)] transition"
            />
          </Link>
        )}
        {youtube && (
          <Link
            href={youtube}
            target="_blank"
            aria-label="YouTube"
            style={{ color: "var(--secondary)" }}
          >
            <Youtube
              size={24}
              className="hover:text-[var(--accent)] transition"
            />
          </Link>
        )}
      </div>

      {/* 🚀 Copyright */}
      <div className="pb-8">
        <p
          className="text-sm md:flex justify-center items-center gap-2"
          style={{ color: "var(--secondary)" }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="w-5 h-5 inline-block border rounded-full"
          />{" "}
          &copy; {currentYear} Alumni Management ·
          <p className="py-1 hover:text-[var(--accent)] transition">
            {" "}
            Built with ❤️ by Bit Hackers
            {/* <Link
              href="https://nileshkumar.vercel.app/"
              target="_blank"
              className="underline hover:text-[var(--accent)] transition"
            >
              Bit Hackers
            </Link> */}
          </p>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
