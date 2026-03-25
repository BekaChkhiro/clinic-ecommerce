import { Suspense } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import LanguageSwitcher from "@modules/layout/components/language-switcher"
import MobileMenu from "@modules/layout/components/mobile-menu"
import WishlistIcon from "@modules/wishlist/components/wishlist-icon"
import { getTranslations } from "next-intl/server"

export default async function Nav() {
  const t = await getTranslations()

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      {/* Top Utility Bar — Desktop only */}
      <div className="hidden small:block bg-gray-50 border-b border-gray-100">
        <div className="content-container flex justify-between items-center h-9 text-xs text-gray-500">
          <div className="flex items-center gap-x-5">
            <span className="flex items-center gap-x-1.5">
              <svg className="w-3.5 h-3.5 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              {t("header.phone")}
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-x-1.5">
              <svg className="w-3.5 h-3.5 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {t("header.workingHours")}
            </span>
          </div>
          <div className="flex items-center gap-x-4">
            <span className="text-gray-400">{t("footer.slogan")}</span>
            <span className="text-gray-300">|</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="relative bg-white border-b border-gray-200 shadow-sm">
        <div className="content-container flex items-center justify-between h-16">

          {/* Left: Logo */}
          <div className="flex items-center gap-x-8">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-x-2 hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              {/* Pharmacy Cross Icon */}
              <div className="w-9 h-9 bg-brand-red rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-tight tracking-tight text-gray-900">
                  MedPharma<span className="text-brand-red"> Plus</span>
                </span>
                <span className="text-[10px] text-gray-400 leading-tight hidden xsmall:block">
                  APOTEKA
                </span>
              </div>
            </LocalizedClientLink>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden small:flex items-center gap-x-1 h-full">
            {[
              { name: t("nav.home"), href: "/" },
              { name: t("nav.store"), href: "/store" },
              { name: t("nav.about"), href: "/pages/about" },
              { name: t("nav.contact"), href: "/pages/contact" },
              { name: t("nav.faq"), href: "/pages/faq" },
              { name: t("nav.branches"), href: "/pages/branches" },
            ].map((link) => (
              <LocalizedClientLink
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium text-gray-600 hover:text-brand-red rounded-lg hover:bg-red-50/50 transition-all duration-200"
              >
                {link.name}
              </LocalizedClientLink>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-x-1">
            {/* Desktop icons */}
            <div className="hidden small:flex items-center gap-x-1">
              <WishlistIcon />
              <LocalizedClientLink
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-brand-red hover:bg-red-50/50 transition-all duration-200"
                href="/account"
                data-testid="nav-account-link"
                title={t("nav.account")}
              >
                <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </LocalizedClientLink>
            </div>

            {/* Cart — always visible */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-brand-red hover:bg-red-50/50 transition-all duration-200 relative"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>

            {/* Mobile: Wishlist + Hamburger */}
            <div className="flex small:hidden items-center">
              <WishlistIcon />
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
