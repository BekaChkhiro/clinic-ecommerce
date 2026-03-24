import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import Breadcrumbs from "@modules/products/components/breadcrumbs"
import DietaryTags from "@modules/products/components/dietary-tags"
import ProductDisclaimer from "@modules/products/components/product-disclaimer"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { ProductExtension } from "@lib/data/product-extension"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
  extension: ProductExtension | null
  locale: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
  extension,
  locale,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div className="content-container py-4">
        <Breadcrumbs product={product} extension={extension} locale={locale} />
      </div>
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-6 relative"
        data-testid="product-container"
      >
        <div className="block w-full relative small:w-3/5">
          <ImageGallery images={images} />
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[400px] w-full py-8 gap-y-6 small:pl-8">
          <ProductInfo product={product} extension={extension} locale={locale} />
          {extension && <DietaryTags extension={extension} locale={locale} />}
          <ProductOnboardingCta />
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
                locale={locale}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} locale={locale} />
          </Suspense>
          {extension && <ProductDisclaimer extension={extension} locale={locale} />}
        </div>
      </div>
      <div className="content-container my-8">
        <ProductTabs product={product} extension={extension} locale={locale} />
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} locale={locale} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
