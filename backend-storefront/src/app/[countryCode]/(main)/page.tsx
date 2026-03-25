import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import HeroBanner from "@modules/home/components/hero-banner"
import FeaturedProducts from "@modules/home/components/featured-products"
import CategoryGrid from "@modules/home/components/category-grid"
import PromoBanners from "@modules/home/components/promo-banners"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listBanners } from "@lib/data/banners"
import { listCustomCategories } from "@lib/data/custom-categories"
import { getLocale } from "@lib/data/locale-actions"
import { getBaseURL } from "@lib/util/env"

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"
  const baseUrl = getBaseURL()

  return {
    title: isKa
      ? "მედფარმა პლუსი - სპეციალური დიეტური პროდუქტები"
      : "MedPharma Plus - Specialty Dietary Products",
    description: isKa
      ? "სპეციალური დიეტური პროდუქტების ონლაინ მაღაზია - შაქრის შემცვლელები, დაბალცილებიანი PKU პროდუქტები, უგლუტენო პროდუქტები"
      : "Online store for specialty dietary products - sugar substitutes, low protein PKU products, gluten-free products",
    openGraph: {
      title: isKa
        ? "მედფარმა პლუსი - სპეციალური დიეტური პროდუქტები"
        : "MedPharma Plus - Specialty Dietary Products",
      description: isKa
        ? "სპეციალური დიეტური პროდუქტების ონლაინ მაღაზია"
        : "Online store for specialty dietary products",
      url: baseUrl,
      siteName: "MedPharma Plus",
      type: "website",
      locale: isKa ? "ka_GE" : "en_US",
    },
    alternates: {
      canonical: baseUrl,
    },
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const locale = (await getLocale()) || "ka"
  const t = await getTranslations("home")

  // Fetch all data in parallel
  const [region, collectionsResult, heroBanners, promoBanners, categories] =
    await Promise.all([
      getRegion(countryCode),
      listCollections({ fields: "id, handle, title" }),
      listBanners("homepage").catch(() => []),
      listBanners("category").catch(() => []),
      listCustomCategories().catch(() => []),
    ])

  if (!region) {
    return null
  }

  const collections = collectionsResult?.collections || []

  return (
    <>
      {/* Hero Banner Slider */}
      <HeroBanner banners={heroBanners} locale={locale} />

      {/* Category Cards Grid */}
      <CategoryGrid
        categories={categories}
        locale={locale}
        title={t("topCategories")}
      />

      {/* Trust Badges */}
      <div className="bg-white py-10 border-y border-gray-100">
        <div className="content-container">
          <div className="grid grid-cols-2 small:grid-cols-4 gap-6 small:gap-8">
            <div className="flex flex-col items-center text-center gap-y-2">
              <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{t("trustDelivery")}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-y-2">
              <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{t("trustQuality")}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-y-2">
              <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{t("trustSupport")}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-y-2">
              <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{t("trustCertified")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products by Collection */}
      {collections.length > 0 && (
        <div className="bg-gray-50 py-8 small:py-12">
          <div className="content-container">
            <h2 className="text-2xl small:text-3xl font-bold text-gray-900 pt-4 pb-2 text-center">
              {t("featuredProducts")}
            </h2>
          </div>
          <ul className="flex flex-col">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      )}

      {/* Promotional Banners */}
      <PromoBanners banners={promoBanners} locale={locale} />
    </>
  )
}
