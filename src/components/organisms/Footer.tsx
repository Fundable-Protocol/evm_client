import Link from "next/link";
import Image from "next/image";

import FundableLogo from "../../../public/svgs/fundable_logo.svg";
import { FaqGradientButton } from "../modules/landing-page/FaqAccordionSection";

const links = [
  { name: "For Developers", href: "#" },
  { name: "Blog", href: "#" },
];

const socialLinks = [
  { name: "X", href: "https://x.com/FundableHQ" },
  { name: "Telegram", href: "https://t.me/fundable_finance" },
  // { name: "Discord", href: "#" },
];

const Footer = () => {
  return (
    <footer className="container mt-28">
      <div className="hidden md:grid grid-cols-2 !max-w-full font-geist-sans border-b border-fundable-dark">
        <div className="flex items-start gap-x-6">
          <Image
            src={FundableLogo}
            alt="logo"
            className="w-28 md:w-24"
            priority
          />

          <div className="flex flex-col gap-y-14">
            <div className="flex flex-col font-medium">
              {links.map((link) => (
                <Link
                  key={`footer-index-${link.name}`}
                  href={link.href}
                  className="hover:underline"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col">
              <h4 className="mb-2 text-gray-400 font-semibold text-sm">
                CONTACT US
              </h4>
              <span className="text-sm font-medium mb-0.5">
                +23470-18771795
              </span>
              <span className="text-sm font-medium">info@fundable.finance</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between items-end">
          <div className="flex gap-x-4 font-medium">
            {socialLinks.map((link) => (
              <Link
                key={`footer-social-index-${link.name}`}
                href={link.href}
                target="_"
                className="hover:underline"
              >
                <FaqGradientButton text={link.name} />
              </Link>
            ))}
          </div>

          <h4 className="text-gray-400 font-semibold text-sm">
            © {new Date().getFullYear()} — Copyright
          </h4>
        </div>
      </div>

      {/* Mobile Nav*/}

      <div className="md:hidden flex flex-col justify-center !max-w-full font-geist-sans border-b border-fundable-dark text-xs font-semibold">
        <div className="flex items-center justify-between">
          <Image
            src={FundableLogo}
            alt="logo"
            className="w-28 md:w-24"
            priority
          />
          <div className="flex gap-x-4">
            {links.map((link) => (
              <Link
                key={`footer-index-${link.name}`}
                href={link.href}
                className="hover:underline"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <h4 className="text-gray-400 text-right mt-4">
          © {new Date().getFullYear()} — Copyright
        </h4>
      </div>
    </footer>
  );
};

export default Footer;
