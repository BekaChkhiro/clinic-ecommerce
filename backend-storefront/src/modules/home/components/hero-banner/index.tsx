"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import type { Banner } from "@lib/data/banners"

type HeroBannerProps = {
  banners: Banner[]
  locale: string
}

export default function HeroBanner({ banners, locale }: HeroBannerProps) {
  const t = useTranslations("home")
  const { countryCode } = useParams()
  const [current, setCurrent] = useState(0)

  const isKa = locale === "ka"

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, banners.length])

  // Fallback hero when no banners exist
  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[50vh] small:h-[70vh] bg-brand-red flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-2xl">
          <h1 className="text-3xl small:text-5xl font-bold mb-4">
            {t("heroTitle")}
          </h1>
          <p className="text-lg small:text-xl mb-8 opacity-90">
            {t("heroSubtitle")}
          </p>
          <Link
            href={`/${countryCode}/store`}
            className="inline-block bg-white text-brand-red font-semibold px-8 py-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            {t("shopNow")}
          </Link>
        </div>
      </div>
    )
  }

  const banner = banners[current]
  const title = isKa ? banner.title_ka : banner.title_en
  const subtitle = isKa ? banner.subtitle_ka : banner.subtitle_en
  const buttonText = isKa ? banner.button_text_ka : banner.button_text_en

  return (
    <div className="relative w-full h-[50vh] small:h-[70vh] overflow-hidden bg-gray-100">
      {/* Banner Image */}
      <Image
        src={banner.image}
        alt={title || ""}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-2xl">
          {title && (
            <h1 className="text-3xl small:text-5xl font-bold mb-4 drop-shadow-lg">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg small:text-xl mb-8 opacity-90 drop-shadow-md">
              {subtitle}
            </p>
          )}
          {banner.link && buttonText && (
            <Link
              href={
                banner.link.startsWith("http")
                  ? banner.link
                  : `/${countryCode}${banner.link}`
              }
              className="inline-block bg-brand-red text-white font-semibold px-8 py-3 rounded-md hover:bg-brand-red-dark transition-colors"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            aria-label="Previous banner"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            aria-label="Next banner"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === current ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
