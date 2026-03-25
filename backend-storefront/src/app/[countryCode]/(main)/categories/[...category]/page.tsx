import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getBaseURL } from "@lib/util/env"
import { getLocale } from "next-intl/server"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  try {
    const product_categories = await listCategories()

    if (!product_categories) {
      return []
    }

    const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    const categoryHandles = product_categories.map(
      (category: any) => category.handle
    )

    const staticParams = countryCodes
      ?.map((countryCode: string | undefined) =>
        categoryHandles.map((handle: any) => ({
          countryCode,
          category: [handle],
        }))
      )
      .flat()

    return staticParams
  } catch (error) {
    console.error(
      `Failed to generate static paths for category pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const locale = await getLocale()
  const baseUrl = getBaseURL()

  try {
    const productCategory = await getCategoryByHandle(params.category)

    const title = productCategory.name
    const description =
      productCategory.description ??
      (locale === "ka"
        ? `${title} - პროდუქტები MedPharma Plus-ზე`
        : `${title} - Products at MedPharma Plus`)

    const categoryUrl = `${baseUrl}/${params.countryCode}/categories/${params.category.join("/")}`

    return {
      title,
      description,
      openGraph: {
        title: `${title} | MedPharma Plus`,
        description,
        url: categoryUrl,
        type: "website",
      },
      alternates: {
        canonical: categoryUrl,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams
  const locale = await getLocale()
  const baseUrl = getBaseURL()

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "ka" ? "მთავარი" : "Home",
        item: `${baseUrl}/${params.countryCode}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "ka" ? "მაღაზია" : "Store",
        item: `${baseUrl}/${params.countryCode}/store`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: productCategory.name,
        item: `${baseUrl}/${params.countryCode}/categories/${params.category.join("/")}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryTemplate
        category={productCategory}
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    </>
  )
}
