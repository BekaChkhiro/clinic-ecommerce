"use client"

import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import { ProductExtension } from "@lib/data/product-extension"
import { useTranslations } from "next-intl"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
  extension: ProductExtension | null
  locale: string
}

const ProductTabs = ({ product, extension, locale }: ProductTabsProps) => {
  const t = useTranslations("product")

  const tabs = [
    {
      label: t("details"),
      component: (
        <ProductInfoTab
          product={product}
          extension={extension}
          locale={locale}
        />
      ),
    },
    {
      label: t("shippingReturns"),
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple" defaultValue={[t("details")]}>
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({
  product,
  extension,
  locale,
}: {
  product: HttpTypes.StoreProduct
  extension: ProductExtension | null
  locale: string
}) => {
  const t = useTranslations("product")

  const weight = extension?.weight || (product.weight ? `${product.weight}` : null)
  const unit = extension?.unit || "გ"
  const country = extension?.manufacturer_country || product.origin_country

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {extension?.manufacturer_country && (
          <div>
            <span className="font-semibold text-ui-fg-base">{t("country")}</span>
            <p className="text-ui-fg-subtle mt-1">{extension.manufacturer_country}</p>
          </div>
        )}
        {weight && (
          <div>
            <span className="font-semibold text-ui-fg-base">{t("weight")}</span>
            <p className="text-ui-fg-subtle mt-1">
              {weight}{unit ? ` ${unit}` : ""}
            </p>
          </div>
        )}
        {product.material && (
          <div>
            <span className="font-semibold text-ui-fg-base">{t("material")}</span>
            <p className="text-ui-fg-subtle mt-1">{product.material}</p>
          </div>
        )}
        {product.type && (
          <div>
            <span className="font-semibold text-ui-fg-base">{t("type")}</span>
            <p className="text-ui-fg-subtle mt-1">{product.type.value}</p>
          </div>
        )}
        {!extension?.manufacturer_country && country && (
          <div>
            <span className="font-semibold text-ui-fg-base">{t("country")}</span>
            <p className="text-ui-fg-subtle mt-1">{country}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  const t = useTranslations("product.shipping")

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">{t("fastDeliveryTitle")}</span>
            <p className="max-w-sm text-ui-fg-subtle mt-1">
              {t("fastDeliveryDesc")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">{t("returnsTitle")}</span>
            <p className="max-w-sm text-ui-fg-subtle mt-1">
              {t("returnsDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
