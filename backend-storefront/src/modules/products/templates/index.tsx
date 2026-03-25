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
      {/* Breadcrumbs */}
      <div className="content-container py-4">
        <Breadcrumbs product={product} extension={extension} locale={locale} />
      </div>

      {/* Main Product Section */}
      <div
        className="content-container pb-8"
        data-testid="product-container"
      >
        <div className="grid grid-cols-1 small:grid-cols-12 gap-8">
          {/* Left: Image Gallery */}
          <div className="small:col-span-7 group">
            <ImageGallery images={images} />
          </div>

          {/* Right: Product Info */}
          <div className="small:col-span-5">
            <div className="flex flex-col gap-y-6 small:sticky small:top-32">
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
        </div>
      </div>

      {/* Tabs */}
      <div className="content-container py-8 border-t border-gray-100">
        <ProductTabs product={product} extension={extension} locale={locale} />
      </div>

      {/* Related Products */}
      <div
        className="content-container py-12 small:py-16"
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
