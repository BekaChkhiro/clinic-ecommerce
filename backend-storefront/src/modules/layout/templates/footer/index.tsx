import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"
import { getTranslations } from "next-intl/server"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const [{ collections }, productCategories, t] = await Promise.all([
    listCollections({ fields: "*products" }),
    listCategories(),
    getTranslations(),
  ])

  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Main Footer */}
      <div className="content-container">
        <div className="grid grid-cols-1 small:grid-cols-12 gap-12 py-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="small:col-span-4">
            <LocalizedClientLink
              href="/"
              className="inline-flex items-center gap-x-2"
            >
              <svg className="w-6 h-6 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 8h-2V6h-2v2h-2V6h-2v2H9V6H7v2H5a1 1 0 0 0-1 1v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9a1 1 0 0 0-1-1Zm-1 11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-9h12v9ZM12 2a1 1 0 0 0-1 1v1h2V3a1 1 0 0 0-1-1Z"/>
                <rect x="10.5" y="13" width="3" height="1.5" rx="0.2"/>
                <rect x="11.25" y="12.25" width="1.5" height="3" rx="0.2"/>
              </svg>
              <span className="text-xl font-bold tracking-tight text-white">
                MedPharma<span className="text-brand-red"> Plus</span>
              </span>
            </LocalizedClientLink>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed max-w-xs">
              {t("footer.slogan")}
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a href="tel:+995" className="flex items-center gap-x-3 text-sm text-gray-400 hover:text-white transition-colors group">
                <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-brand-red/10 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </span>
                {t("footer.phone")}
              </a>
              <div className="flex items-center gap-x-3 text-sm text-gray-400">
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </span>
                {t("footer.workingHours")}
              </div>
              <a href="mailto:info@medpharma.ge" className="flex items-center gap-x-3 text-sm text-gray-400 hover:text-white transition-colors group">
                <span className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-brand-red/10 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </span>
                {t("footer.email")}
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="small:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Categories */}
            {productCategories && productCategories.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
                  {t("footer.categories")}
                </h4>
                <ul className="space-y-2.5" data-testid="footer-categories">
                  {productCategories.slice(0, 6).map((c) => {
                    if (c.parent_category) return null
                    return (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Collections */}
            {collections && collections.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
                  {t("footer.collections")}
                </h4>
                <ul className="space-y-2.5">
                  {collections.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
                {t("footer.company")}
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <LocalizedClientLink
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    href="/pages/about"
                  >
                    {t("footer.about")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    href="/pages/contact"
                  >
                    {t("footer.contact")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    href="/pages/branches"
                  >
                    {t("nav.branches")}
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white mb-4">
                {t("footer.customerService")}
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <LocalizedClientLink
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    href="/pages/faq"
                  >
                    {t("footer.faq")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    href="/pages/shipping"
                  >
                    {t("footer.shipping")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    href="/pages/privacy-policy"
                  >
                    {t("footer.privacyPolicy")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    href="/pages/terms-and-conditions"
                  >
                    {t("footer.termsConditions")}
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col small:flex-row justify-between items-center gap-4 py-8">
          <Text className="text-xs text-gray-500">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </Text>

          {/* Social Icons */}
          <div className="flex items-center gap-x-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand-red/20 flex items-center justify-center text-gray-500 hover:text-white transition-all duration-200"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand-red/20 flex items-center justify-center text-gray-500 hover:text-white transition-all duration-200"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
              </svg>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand-red/20 flex items-center justify-center text-gray-500 hover:text-white transition-all duration-200"
              aria-label="TikTok"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
