import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import LanguageSwitcher from "@modules/layout/components/language-switcher"
import WishlistIcon from "@modules/wishlist/components/wishlist-icon"
import { getTranslations } from "next-intl/server"

export default async function Nav() {
  const [regions, locales, currentLocale, t] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    getTranslations(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Utility Bar */}
      <div className="hidden small:block bg-gray-50 border-b border-gray-100">
        <div className="content-container flex justify-between items-center h-8 text-xs text-gray-500">
          <div className="flex items-center gap-x-4">
            <span className="flex items-center gap-x-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              {t("header.phone")}
            </span>
            <span className="flex items-center gap-x-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {t("header.workingHours")}
            </span>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Nav */}
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Left: Hamburger + Desktop Links */}
          <div className="flex-1 basis-0 h-full flex items-center gap-x-6">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
            <div className="hidden small:flex items-center gap-x-5 h-full">
              <LocalizedClientLink
                href="/store"
                className="text-sm text-gray-600 hover:text-brand-red transition-colors"
              >
                {t("nav.store")}
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/pages/about"
                className="text-sm text-gray-600 hover:text-brand-red transition-colors"
              >
                {t("nav.about")}
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/pages/contact"
                className="text-sm text-gray-600 hover:text-brand-red transition-colors"
              >
                {t("nav.contact")}
              </LocalizedClientLink>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-x-1.5 hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              <svg className="w-6 h-6 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 8h-2V6h-2v2h-2V6h-2v2H9V6H7v2H5a1 1 0 0 0-1 1v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9a1 1 0 0 0-1-1Zm-1 11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-9h12v9ZM12 2a1 1 0 0 0-1 1v1h2V3a1 1 0 0 0-1-1Z"/>
                <rect x="10.5" y="13" width="3" height="1.5" rx="0.2"/>
                <rect x="11.25" y="12.25" width="1.5" height="3" rx="0.2"/>
              </svg>
              <span className="font-bold text-lg tracking-tight text-gray-900">
                MedPharma<span className="text-brand-red"> Plus</span>
              </span>
            </LocalizedClientLink>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-x-4 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-4 h-full">
              <WishlistIcon />
              <LocalizedClientLink
                className="text-gray-600 hover:text-brand-red transition-colors"
                href="/account"
                data-testid="nav-account-link"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </LocalizedClientLink>
            </div>
            <div className="small:hidden flex items-center gap-x-3">
              <LanguageSwitcher />
              <WishlistIcon />
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base relative"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
