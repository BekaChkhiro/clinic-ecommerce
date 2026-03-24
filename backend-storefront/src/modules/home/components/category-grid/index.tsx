import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { CustomCategory } from "@lib/data/custom-categories"

type CategoryGridProps = {
  categories: CustomCategory[]
  locale: string
  title: string
}

export default function CategoryGrid({
  categories,
  locale,
  title,
}: CategoryGridProps) {
  const isKa = locale === "ka"

  // Only show top-level categories (no parent) with sort order
  const topCategories = categories
    .filter((c) => !c.parent_id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 6)

  if (topCategories.length === 0) return null

  return (
    <div className="content-container py-12 small:py-16">
      <h2 className="text-2xl small:text-3xl font-bold text-gray-900 mb-8 text-center">
        {title}
      </h2>
      <div className="grid grid-cols-2 small:grid-cols-3 gap-4 small:gap-6">
        {topCategories.map((category) => {
          const name = isKa ? category.name_ka : (category.name_en || category.name_ka)

          return (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-brand-gray-light"
            >
              {category.image ? (
                <Image
                  src={category.image}
                  alt={name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 to-brand-red/5" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-base small:text-lg drop-shadow-md">
                  {name}
                </h3>
              </div>
            </LocalizedClientLink>
          )
        })}
      </div>
    </div>
  )
}
