import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { getProductExtension, ProductExtension } from "@lib/data/product-extension"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import { getLocale } from "next-intl/server"
import { getBaseURL } from "@lib/util/env"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images?.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images!.map((i) => [i.id, true]))
  return product.images!.filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)
  const locale = await getLocale()

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const extension = await getProductExtension(product.id!)

  const title =
    locale === "ka" && extension?.name_ka
      ? extension.name_ka
      : extension?.name_en || product.title

  const description =
    locale === "ka" && extension?.description_ka
      ? extension.description_ka
      : extension?.description_en || product.description || ""

  const metaTitle =
    locale === "ka"
      ? extension?.meta_title_ka || title
      : extension?.meta_title_en || title

  const metaDescription =
    locale === "ka"
      ? extension?.meta_description_ka || description
      : extension?.meta_description_en || description

  const baseUrl = getBaseURL()

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: `${metaTitle} | MedPharma Plus`,
      description: metaDescription,
      images: product.thumbnail ? [product.thumbnail] : [],
      type: "website",
      url: `${baseUrl}/${params.countryCode}/products/${handle}`,
    },
    alternates: {
      canonical: `${baseUrl}/${params.countryCode}/products/${handle}`,
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams
  const locale = await getLocale()

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  if (!pricedProduct) {
    notFound()
  }

  const [images, extension] = await Promise.all([
    Promise.resolve(getImagesForVariant(pricedProduct, selectedVariantId)),
    getProductExtension(pricedProduct.id!),
  ])

  const baseUrl = getBaseURL()
  const productUrl = `${baseUrl}/${params.countryCode}/products/${params.handle}`

  const productName =
    locale === "ka" && extension?.name_ka
      ? extension.name_ka
      : extension?.name_en || pricedProduct.title || ""

  const productDescription =
    locale === "ka" && extension?.description_ka
      ? extension.description_ka
      : extension?.description_en || pricedProduct.description || ""

  const price = pricedProduct.variants?.[0]?.calculated_price
  const amount = price?.calculated_amount
  const currencyCode = price?.currency_code || "GEL"

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: productDescription,
    image: pricedProduct.images?.map((i) => i.url) || [],
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: "MedPharma Plus",
    },
    ...(amount != null && {
      offers: {
        "@type": "Offer",
        price: amount,
        priceCurrency: currencyCode.toUpperCase(),
        availability:
          (pricedProduct.variants?.[0] as any)?.inventory_quantity > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: productUrl,
      },
    }),
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
        name: productName,
        item: productUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
        images={images ?? []}
        extension={extension}
        locale={locale}
      />
    </>
  )
}
