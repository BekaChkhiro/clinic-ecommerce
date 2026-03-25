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

      {/* Featured Products by Collection */}
      {collections.length > 0 && (
        <div className="bg-gray-50 py-4">
          <div className="content-container">
            <h2 className="text-2xl small:text-3xl font-bold text-gray-900 pt-8 text-center">
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
