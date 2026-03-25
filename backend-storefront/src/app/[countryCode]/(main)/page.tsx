import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

import FeaturedProducts from "@modules/home/components/featured-products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getLocale } from "@lib/data/locale-actions"
import { getBaseURL } from "@lib/util/env"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

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
  const isKa = locale === "ka"
  const t = await getTranslations("home")

  const [region, collectionsResult] = await Promise.all([
    getRegion(countryCode),
    listCollections({ fields: "id, handle, title" }),
  ])

  if (!region) {
    return null
  }

  const collections = collectionsResult?.collections || []

  return (
    <>
      {/* Hero Banner — Static Image */}
      <div className="relative w-full h-[280px] small:h-[420px] medium:h-[480px] overflow-hidden">
        <Image
          src="/medpharma.jpg"
          alt="MedPharma Plus"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay with brand text */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="content-container">
            <div className="max-w-lg">
              <h1 className="text-3xl small:text-4xl medium:text-5xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
                MedPharma<span className="text-brand-red-light"> Plus</span>
              </h1>
              <p className="text-base small:text-lg text-white/90 mb-6 drop-shadow-md leading-relaxed">
                {isKa
                  ? "სპეციალური დიეტური პროდუქტები ევროპული ხარისხით"
                  : "Specialty dietary products with European quality"}
              </p>
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
              >
                {t("shopNow")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>

      {/* Product Carousels by Collection */}
      {collections.length > 0 && (
        <div className="py-8 small:py-12">
          <ul className="flex flex-col">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      )}

      {/* Contact Block */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="content-container py-12 small:py-16">
          <div className="grid grid-cols-1 small:grid-cols-2 gap-10 items-center">
            {/* Left: Info */}
            <div>
              <h2 className="text-2xl small:text-3xl font-bold text-gray-900 mb-3">
                {isKa ? "დაგვიკავშირდით" : "Get in Touch"}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {isKa
                  ? "გაქვთ კითხვები პროდუქციის ან მიწოდების შესახებ? ჩვენი გუნდი მზადაა დაგეხმაროთ."
                  : "Have questions about products or delivery? Our team is ready to help."}
              </p>

              <div className="flex flex-col gap-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {isKa ? "ტელეფონი" : "Phone"}
                    </p>
                    <p className="text-sm text-gray-600">+995 32 200 00 00</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {isKa ? "ელ-ფოსტა" : "Email"}
                    </p>
                    <p className="text-sm text-gray-600">info@medpharma.ge</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {isKa ? "სამუშაო საათები" : "Working Hours"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isKa ? "ორშ-პარ: 09:00-20:00, შაბ: 10:00-18:00" : "Mon-Fri: 09:00-20:00, Sat: 10:00-18:00"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {isKa ? "მისამართი" : "Address"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {isKa ? "თბილისი, საქართველო" : "Tbilisi, Georgia"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: CTA Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex flex-col items-center text-center gap-y-4">
                <div className="w-14 h-14 bg-brand-red rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  MedPharma Plus
                </h3>
                <p className="text-sm text-gray-600 max-w-sm">
                  {isKa
                    ? "ინოვაცია, ხარისხი, ზრუნვა — სანდო პარტნიორი თქვენი ჯანმრთელობისა და სილამაზის სამსახურში."
                    : "Innovation, Quality, Care — Your trusted partner for health and beauty."}
                </p>

                <div className="flex flex-col gap-3 w-full mt-2">
                  <LocalizedClientLink
                    href="/pages/about"
                    className="w-full inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-semibold px-5 py-3 rounded-lg transition-colors"
                  >
                    {isKa ? "ჩვენ შესახებ" : "About Us"}
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/pages/contact"
                    className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:border-brand-red hover:text-brand-red font-semibold px-5 py-3 rounded-lg transition-colors"
                  >
                    {isKa ? "დაგვიწერეთ" : "Contact Us"}
                  </LocalizedClientLink>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-100 mt-2 w-full justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {isKa ? "სწრაფი მიწოდება" : "Fast Delivery"}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {isKa ? "სერთიფიცირებული" : "Certified"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
