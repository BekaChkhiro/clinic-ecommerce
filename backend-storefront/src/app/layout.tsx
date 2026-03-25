import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { WishlistProvider } from "@lib/context/wishlist-context"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "MedPharma Plus | მედფარმა პლუსი",
    template: "%s | MedPharma Plus",
  },
  description:
    "სპეციალური დიეტური პროდუქტების ონლაინ მაღაზია - შაქრის შემცვლელები, დაბალცილებიანი PKU პროდუქტები, ჯანსაღი სნეკები",
  openGraph: {
    type: "website",
    locale: "ka_GE",
    alternateLocale: "en_US",
    siteName: "MedPharma Plus",
  },
  alternates: {
    languages: {
      ka: "/",
      en: "/",
    },
  },
}

function OrganizationJsonLd() {
  const baseUrl = getBaseURL()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MedPharma Plus",
    alternateName: "მედფარმა პლუსი აფთიაქი",
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description:
      "სპეციალური დიეტური პროდუქტების ონლაინ მაღაზია - შაქრის შემცვლელები, დაბალცილებიანი PKU პროდუქტები",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Georgian", "English"],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default async function RootLayout(props: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      data-mode="light"
      className={locale === "ka" ? "font-georgian" : "font-sans"}
    >
      <body>
        <OrganizationJsonLd />
        <NextIntlClientProvider messages={messages}>
          <WishlistProvider>
            <main className="relative">{props.children}</main>
          </WishlistProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
