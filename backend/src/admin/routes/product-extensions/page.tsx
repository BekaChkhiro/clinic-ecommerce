import { defineRouteConfig } from "@medusajs/admin-sdk"
import { SparklesSolid } from "@medusajs/icons"
import { useEffect, useState, useCallback } from "react"
import {
  Container,
  Heading,
  Table,
  Button,
  Badge,
  Text,
  toast,
} from "@medusajs/ui"

type ProductWithExtension = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  status: string
  product_extension: {
    id: string
    name_ka: string
    name_en: string | null
    is_sugar_free: boolean
    is_low_protein: boolean
    is_diabetic_friendly: boolean
    is_gluten_free: boolean
    product_type: string
    manufacturer_country: string | null
    apex_id: string | null
  } | null
}

const ProductExtensionsPage = () => {
  const [products, setProducts] = useState<ProductWithExtension[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "with" | "without">("all")

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/admin/product-extensions?limit=200", {
        credentials: "include",
      })
      const data = await res.json()
      setProducts(data.products || [])
    } catch {
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filtered = products.filter((p) => {
    if (filter === "with") return p.product_extension !== null
    if (filter === "without") return p.product_extension === null
    return true
  })

  const withExtCount = products.filter((p) => p.product_extension).length
  const withoutExtCount = products.filter((p) => !p.product_extension).length

  const dietaryBadges = (ext: ProductWithExtension["product_extension"]) => {
    if (!ext) return null
    const badges: { label: string; color: "green" | "blue" | "purple" | "orange" }[] = []
    if (ext.is_sugar_free) badges.push({ label: "SF", color: "green" })
    if (ext.is_low_protein) badges.push({ label: "PKU", color: "blue" })
    if (ext.is_diabetic_friendly) badges.push({ label: "DIA", color: "purple" })
    if (ext.is_gluten_free) badges.push({ label: "GF", color: "orange" })
    return badges.length > 0 ? (
      <div style={{ display: "flex", gap: 4 }}>
        {badges.map((b) => (
          <Badge key={b.label} color={b.color} size="2xsmall">
            {b.label}
          </Badge>
        ))}
      </div>
    ) : (
      <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>—</Text>
    )
  }

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "4px 12px",
    borderRadius: 6,
    border: "1px solid var(--border-base, #e5e5e5)",
    background: active ? "var(--bg-interactive, #000)" : "transparent",
    color: active ? "#fff" : "var(--fg-base)",
    cursor: "pointer",
    fontSize: 13,
  })

  return (
    <Container>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <Heading level="h1">Product Extensions</Heading>
          <Text size="small" style={{ color: "var(--fg-subtle)", marginTop: 4 }}>
            Manage bilingual names, dietary tags, and custom product data
          </Text>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div style={{
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px solid var(--border-base, #e5e5e5)",
          flex: 1,
        }}>
          <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>Total Products</Text>
          <Text size="large" weight="plus">{products.length}</Text>
        </div>
        <div style={{
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px solid var(--border-base, #e5e5e5)",
          flex: 1,
        }}>
          <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>With Extension</Text>
          <Text size="large" weight="plus" style={{ color: "var(--fg-positive, green)" }}>{withExtCount}</Text>
        </div>
        <div style={{
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px solid var(--border-base, #e5e5e5)",
          flex: 1,
        }}>
          <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>Missing Extension</Text>
          <Text size="large" weight="plus" style={{ color: withoutExtCount > 0 ? "var(--fg-error, red)" : undefined }}>
            {withoutExtCount}
          </Text>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <button style={filterBtnStyle(filter === "all")} onClick={() => setFilter("all")}>
          All ({products.length})
        </button>
        <button style={filterBtnStyle(filter === "with")} onClick={() => setFilter("with")}>
          With Extension ({withExtCount})
        </button>
        <button style={filterBtnStyle(filter === "without")} onClick={() => setFilter("without")}>
          Missing Extension ({withoutExtCount})
        </button>
      </div>

      {loading ? (
        <Text>Loading...</Text>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Text style={{ color: "var(--fg-subtle)" }}>
            {filter === "without"
              ? "All products have extensions!"
              : filter === "with"
              ? "No products have extensions yet."
              : "No products found."}
          </Text>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ width: 48 }}>Img</Table.HeaderCell>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>Name (KA)</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Dietary</Table.HeaderCell>
              <Table.HeaderCell>Country</Table.HeaderCell>
              <Table.HeaderCell>APEX</Table.HeaderCell>
              <Table.HeaderCell style={{ textAlign: "right" }}>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filtered.map((product) => (
              <Table.Row
                key={product.id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.location.href = `/app/products/${product.id}`
                }}
              >
                <Table.Cell>
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt=""
                      style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4 }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                    />
                  ) : (
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      background: "var(--bg-subtle, #f3f3f3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      color: "var(--fg-subtle)",
                    }}>
                      —
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Text weight="plus" size="small">{product.title}</Text>
                  <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>{product.handle}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small">
                    {product.product_extension?.name_ka || (
                      <span style={{ color: "var(--fg-muted)" }}>—</span>
                    )}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  {product.product_extension ? (
                    <Badge color="grey" size="2xsmall">
                      {product.product_extension.product_type}
                    </Badge>
                  ) : (
                    <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>—</Text>
                  )}
                </Table.Cell>
                <Table.Cell>{dietaryBadges(product.product_extension)}</Table.Cell>
                <Table.Cell>
                  <Text size="small">
                    {product.product_extension?.manufacturer_country || (
                      <span style={{ color: "var(--fg-muted)" }}>—</span>
                    )}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="xsmall" style={{ fontFamily: "monospace" }}>
                    {product.product_extension?.apex_id || (
                      <span style={{ color: "var(--fg-muted)" }}>—</span>
                    )}
                  </Text>
                </Table.Cell>
                <Table.Cell style={{ textAlign: "right" }}>
                  {product.product_extension ? (
                    <Badge color="green" size="2xsmall">Extended</Badge>
                  ) : (
                    <Badge color="red" size="2xsmall">Missing</Badge>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Product Extensions",
  icon: SparklesSolid,
})

export default ProductExtensionsPage
