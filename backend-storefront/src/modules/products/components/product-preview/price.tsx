import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="flex items-baseline gap-2">
      <Text
        className={clx(
          "text-base font-bold",
          price.price_type === "sale" ? "text-brand-red" : "text-gray-900"
        )}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-gray-400 text-xs font-medium"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
    </div>
  )
}
