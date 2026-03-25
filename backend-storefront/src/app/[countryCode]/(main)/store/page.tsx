import { Metadata } from "next"
import { getLocale } from "next-intl/server"

import { SortOptions } from "@modules/store/components/sort-dropdown"
import StoreTemplate from "@modules/store/templates"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const isKa = locale === "ka"

  return {
    title: isKa ? "მაღაზია" : "Store",
    description: isKa
      ? "გაეცანით ჩვენს სპეციალურ დიეტურ პროდუქტებს - შაქრის შემცვლელები, PKU პროდუქტები, უგლუტენო პროდუქტები"
      : "Browse our specialty dietary products - sugar substitutes, PKU products, gluten-free products",
  }
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category?: string
    brand?: string
    dietary?: string
    inStock?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, ...filters } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      filters={{ sortBy, page, ...filters }}
    />
  )
}
