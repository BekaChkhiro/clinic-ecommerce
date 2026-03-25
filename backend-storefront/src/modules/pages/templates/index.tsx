import { CmsPage } from "@lib/data/pages"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type PageTemplateProps = {
  page: CmsPage
  locale: string
}

export default function PageTemplate({ page, locale }: PageTemplateProps) {
  const isKa = locale === "ka"
  const title = isKa ? page.title_ka : page.title_en || page.title_ka
  const content = isKa ? page.content_ka : page.content_en || page.content_ka

  return (
    <div className="py-12">
      <div className="content-container max-w-4xl mx-auto">
        <nav className="mb-8 text-sm text-ui-fg-subtle">
          <LocalizedClientLink href="/" className="hover:text-ui-fg-base">
            {isKa ? "მთავარი" : "Home"}
          </LocalizedClientLink>
          <span className="mx-2">/</span>
          <span className="text-ui-fg-base">{title}</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>

        <div
          className="cms-content text-gray-600 leading-relaxed [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_a]:text-[#A90000] [&_a]:underline hover:[&_a]:no-underline [&_strong]:text-gray-900 [&_strong]:font-semibold [&_table]:w-full [&_table]:border-collapse [&_table]:mb-4 [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-gray-200 [&_td]:p-2"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  )
}
