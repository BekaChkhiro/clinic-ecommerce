import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { Banner } from "@lib/data/banners"

type PromoBannersProps = {
  banners: Banner[]
  locale: string
}

export default function PromoBanners({ banners, locale }: PromoBannersProps) {
  const isKa = locale === "ka"

  // Filter banners positioned for homepage that aren't the hero (use category/product position banners as promos)
  // Or take extra homepage banners beyond the hero slider
  if (banners.length === 0) return null

  // Layout: 1 banner = full width, 2 = side by side, 3+ = grid
  const gridCols =
    banners.length === 1
      ? "grid-cols-1"
      : banners.length === 2
        ? "grid-cols-1 small:grid-cols-2"
        : "grid-cols-1 small:grid-cols-2 medium:grid-cols-3"

  return (
    <div className="content-container py-12 small:py-16">
      <div className={`grid ${gridCols} gap-4 small:gap-6`}>
        {banners.map((banner) => {
          const title = isKa ? banner.title_ka : banner.title_en
          const subtitle = isKa ? banner.subtitle_ka : banner.subtitle_en
          const buttonText = isKa
            ? banner.button_text_ka
            : banner.button_text_en

          const content = (
            <div className="relative overflow-hidden rounded-lg aspect-[16/7] bg-brand-gray-light group">
              <Image
                src={banner.image}
                alt={title || ""}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center p-6 small:p-8">
                {title && (
                  <h3 className="text-white font-bold text-lg small:text-xl mb-2 drop-shadow-md">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-white/90 text-sm small:text-base mb-4 drop-shadow-sm">
                    {subtitle}
                  </p>
                )}
                {buttonText && (
                  <span className="inline-block bg-brand-red text-white text-sm font-medium px-4 py-2 rounded-md w-fit group-hover:bg-brand-red-dark transition-colors">
                    {buttonText}
                  </span>
                )}
              </div>
            </div>
          )

          if (banner.link) {
            return (
              <LocalizedClientLink
                key={banner.id}
                href={banner.link.startsWith("http") ? banner.link : banner.link}
              >
                {content}
              </LocalizedClientLink>
            )
          }

          return <div key={banner.id}>{content}</div>
        })}
      </div>
    </div>
  )
}
