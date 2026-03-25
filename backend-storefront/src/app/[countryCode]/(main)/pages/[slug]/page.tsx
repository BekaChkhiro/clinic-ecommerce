import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { getPageBySlug, listPages } from "@lib/data/pages"
import { getLocale } from "@lib/data/locale-actions"
import { getBaseURL } from "@lib/util/env"
import PageTemplate from "@modules/pages/templates"

type Props = {
  params: Promise<{ countryCode: string; slug: string }>
}

export async function generateStaticParams() {
  const pages = await listPages()

  return pages.map((page) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const page = await getPageBySlug(slug)
  const locale = (await getLocale()) || "ka"
  const isKa = locale === "ka"
  const baseUrl = getBaseURL()

  if (!page) {
    return {
      title: "Page Not Found",
    }
  }

  const title = isKa
    ? page.meta_title_ka || page.title_ka
    : page.meta_title_en || page.title_en || page.title_ka
  const description = isKa
    ? page.meta_description_ka
    : page.meta_description_en

  return {
    title: `${title} | MedPharma Plus`,
    description: description || undefined,
    openGraph: {
      title: title,
      description: description || undefined,
      url: `${baseUrl}/pages/${slug}`,
      siteName: "MedPharma Plus",
      type: "website",
      locale: isKa ? "ka_GE" : "en_US",
    },
    alternates: {
      canonical: `${baseUrl}/pages/${slug}`,
    },
  }
}

export default async function CmsPage(props: Props) {
  const { slug } = await props.params
  const page = await getPageBySlug(slug)

  if (!page) {
    notFound()
  }

  const locale = (await getLocale()) || "ka"

  return <PageTemplate page={page} locale={locale} />
}
