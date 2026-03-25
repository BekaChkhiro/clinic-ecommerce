"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import LanguageSwitcher from "../language-switcher"

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const t = useTranslations()

  const links = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.store"), href: "/store" },
    { name: t("nav.about"), href: "/pages/about" },
    { name: t("nav.contact"), href: "/pages/contact" },
    { name: t("nav.faq"), href: "/pages/faq" },
    { name: t("nav.branches"), href: "/pages/branches" },
  ]

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 -ml-2 rounded-lg hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
        data-testid="nav-menu-button"
      >
        {open ? (
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[64px] bg-black/20 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-lg z-50 animate-fade-in-top">
            <div className="content-container py-4">
              <nav className="flex flex-col">
                {links.map((link) => (
                  <LocalizedClientLink
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center py-3 px-2 text-base font-medium text-gray-700 hover:text-brand-red hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {link.name}
                  </LocalizedClientLink>
                ))}
              </nav>

              {/* Bottom section: language + account */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 px-2">
                <LocalizedClientLink
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-x-2 text-sm text-gray-600 hover:text-brand-red transition-colors"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  {t("nav.account")}
                </LocalizedClientLink>
                <LanguageSwitcher />
              </div>

              {/* Contact info */}
              <div className="flex items-center gap-x-4 mt-3 pt-3 border-t border-gray-100 px-2 text-xs text-gray-400">
                <span className="flex items-center gap-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  {t("header.phone")}
                </span>
                <span className="flex items-center gap-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  {t("header.workingHours")}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
