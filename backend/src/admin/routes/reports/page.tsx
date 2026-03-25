import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChartBar } from "@medusajs/icons"
import { useEffect, useState, useCallback } from "react"
import { Container, Heading, Text, Badge, Button, toast } from "@medusajs/ui"

type ReportData = {
  summary: {
    total_orders: number
    recent_orders: number
    total_revenue: number
    recent_revenue: number
    avg_order_value: number
    total_products: number
    days_back: number
  }
  order_statuses: Record<string, number>
  daily_revenue: { date: string; revenue: number; orders: number }[]
  top_products: { title: string; quantity: number; revenue: number }[]
  product_types: Record<string, number>
  dietary_tags: {
    sugar_free: number
    low_protein: number
    diabetic_friendly: number
    gluten_free: number
  }
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "#f59e0b" },
  CONFIRMED: { label: "Confirmed", color: "#3b82f6" },
  PACKED: { label: "Packed", color: "#8b5cf6" },
  COURIER_ASSIGNED: { label: "Courier", color: "#6366f1" },
  SHIPPED: { label: "Shipped", color: "#06b6d4" },
  DELIVERED: { label: "Delivered", color: "#22c55e" },
  CANCELLED: { label: "Cancelled", color: "#ef4444" },
}

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  SUPPLEMENT: "Supplement",
  SPECIAL_FOOD: "Special Food",
  MEDICATION: "Medication",
  COSMETIC: "Cosmetic",
  DEVICE: "Device",
  OTHER: "Other",
}

function formatCurrency(amount: number): string {
  // Medusa stores amounts in smallest unit (tetri for GEL)
  const gel = amount / 100
  return `${gel.toLocaleString("ka-GE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₾`
}

// Simple bar chart using HTML/CSS
function BarChart({
  data,
  maxHeight = 120,
}: {
  data: { label: string; value: number; color?: string }[]
  maxHeight?: number
}) {
  const maxVal = Math.max(...data.map((d) => d.value), 1)

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: maxHeight }}>
      {data.map((d, i) => {
        const height = Math.max((d.value / maxVal) * maxHeight, 2)
        return (
          <div
            key={i}
            title={`${d.label}: ${d.value}`}
            style={{
              flex: 1,
              height,
              background: d.color || "var(--fg-interactive, #6366f1)",
              borderRadius: "3px 3px 0 0",
              minWidth: 4,
              cursor: "default",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => {
              ;(e.target as HTMLElement).style.opacity = "0.75"
            }}
            onMouseLeave={(e) => {
              ;(e.target as HTMLElement).style.opacity = "1"
            }}
          />
        )
      })}
    </div>
  )
}

// Stat card component
function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  return (
    <div
      style={{
        background: "var(--bg-base, #fff)",
        border: "1px solid var(--border-base, #e5e5e5)",
        borderRadius: 12,
        padding: "20px 24px",
        flex: "1 1 200px",
        minWidth: 180,
      }}
    >
      <Text size="small" style={{ color: "var(--fg-subtle)" }}>
        {label}
      </Text>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginTop: 4,
          color: color || "var(--fg-base)",
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      {sub && (
        <Text size="xsmall" style={{ color: "var(--fg-muted)", marginTop: 4 }}>
          {sub}
        </Text>
      )}
    </div>
  )
}

// Horizontal bar for status/type breakdowns
function HorizontalBar({
  items,
}: {
  items: { label: string; value: number; color: string }[]
}) {
  const total = items.reduce((s, i) => s + i.value, 0)
  if (total === 0) {
    return (
      <Text size="small" style={{ color: "var(--fg-muted)" }}>
        No data yet
      </Text>
    )
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          height: 28,
          borderRadius: 8,
          overflow: "hidden",
          background: "var(--bg-subtle, #f5f5f5)",
        }}
      >
        {items
          .filter((i) => i.value > 0)
          .map((item, idx) => (
            <div
              key={idx}
              title={`${item.label}: ${item.value}`}
              style={{
                width: `${(item.value / total) * 100}%`,
                background: item.color,
                minWidth: item.value > 0 ? 4 : 0,
                transition: "width 0.3s ease",
              }}
            />
          ))}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 16px",
          marginTop: 12,
        }}
      >
        {items
          .filter((i) => i.value > 0)
          .map((item, idx) => (
            <div
              key={idx}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: item.color,
                }}
              />
              <Text size="xsmall">
                {item.label}: {item.value}
              </Text>
            </div>
          ))}
      </div>
    </div>
  )
}

const ReportsPage = () => {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [daysBack, setDaysBack] = useState(30)

  const fetchReport = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/admin/reports?days=${daysBack}`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch reports")
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      toast.error(err.message || "Failed to load reports")
    } finally {
      setLoading(false)
    }
  }, [daysBack])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  if (loading) {
    return (
      <Container>
        <Heading level="h1">Reports Dashboard</Heading>
        <Text style={{ marginTop: 16, color: "var(--fg-muted)" }}>
          Loading reports...
        </Text>
      </Container>
    )
  }

  if (!data) {
    return (
      <Container>
        <Heading level="h1">Reports Dashboard</Heading>
        <Text style={{ marginTop: 16, color: "var(--fg-error)" }}>
          Failed to load report data.
        </Text>
        <Button variant="secondary" onClick={fetchReport} style={{ marginTop: 12 }}>
          Retry
        </Button>
      </Container>
    )
  }

  const { summary, order_statuses, daily_revenue, top_products, product_types, dietary_tags } =
    data

  // Prepare chart data
  const revenueChartData = daily_revenue.map((d) => ({
    label: d.date,
    value: d.revenue,
  }))

  const ordersChartData = daily_revenue.map((d) => ({
    label: d.date,
    value: d.orders,
    color: "#22c55e",
  }))

  const statusItems = Object.entries(order_statuses).map(([key, count]) => ({
    label: STATUS_LABELS[key]?.label || key,
    value: count,
    color: STATUS_LABELS[key]?.color || "#888",
  }))

  const typeItems = Object.entries(product_types).map(([key, count], i) => ({
    label: PRODUCT_TYPE_LABELS[key] || key,
    value: count,
    color: ["#6366f1", "#f59e0b", "#ef4444", "#22c55e", "#06b6d4", "#8b5cf6"][
      i % 6
    ],
  }))

  const sectionStyle = {
    background: "var(--bg-base, #fff)",
    border: "1px solid var(--border-base, #e5e5e5)",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  }

  return (
    <Container>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Heading level="h1">Reports Dashboard</Heading>
        <div style={{ display: "flex", gap: 8 }}>
          {[7, 14, 30, 90].map((d) => (
            <Button
              key={d}
              variant={daysBack === d ? "primary" : "secondary"}
              size="small"
              onClick={() => setDaysBack(d)}
            >
              {d}d
            </Button>
          ))}
          <Button variant="secondary" size="small" onClick={fetchReport}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard
          label="Total Orders"
          value={summary.total_orders}
          sub={`${summary.recent_orders} in last ${summary.days_back} days`}
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(summary.total_revenue)}
          sub={`${formatCurrency(summary.recent_revenue)} in last ${summary.days_back} days`}
          color="#22c55e"
        />
        <StatCard
          label="Avg Order Value"
          value={formatCurrency(summary.avg_order_value)}
        />
        <StatCard
          label="Total Products"
          value={summary.total_products}
        />
      </div>

      {/* Revenue Chart */}
      <div style={sectionStyle}>
        <Heading level="h2" style={{ marginBottom: 4 }}>
          Revenue ({summary.days_back} days)
        </Heading>
        <Text size="small" style={{ color: "var(--fg-muted)", marginBottom: 16 }}>
          Daily revenue in GEL
        </Text>
        {daily_revenue.some((d) => d.revenue > 0) ? (
          <>
            <BarChart data={revenueChartData} maxHeight={140} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>
                {daily_revenue[0]?.date}
              </Text>
              <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>
                {daily_revenue[daily_revenue.length - 1]?.date}
              </Text>
            </div>
          </>
        ) : (
          <Text size="small" style={{ color: "var(--fg-muted)" }}>
            No revenue data for this period
          </Text>
        )}
      </div>

      {/* Orders Chart */}
      <div style={sectionStyle}>
        <Heading level="h2" style={{ marginBottom: 4 }}>
          Orders ({summary.days_back} days)
        </Heading>
        <Text size="small" style={{ color: "var(--fg-muted)", marginBottom: 16 }}>
          Daily order count
        </Text>
        {daily_revenue.some((d) => d.orders > 0) ? (
          <>
            <BarChart data={ordersChartData} maxHeight={100} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>
                {daily_revenue[0]?.date}
              </Text>
              <Text size="xsmall" style={{ color: "var(--fg-muted)" }}>
                {daily_revenue[daily_revenue.length - 1]?.date}
              </Text>
            </div>
          </>
        ) : (
          <Text size="small" style={{ color: "var(--fg-muted)" }}>
            No orders for this period
          </Text>
        )}
      </div>

      {/* Two column layout */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        {/* Order Status Breakdown */}
        <div style={{ ...sectionStyle, flex: "1 1 400px", marginBottom: 0 }}>
          <Heading level="h2" style={{ marginBottom: 16 }}>
            Order Status Breakdown
          </Heading>
          <HorizontalBar items={statusItems} />
        </div>

        {/* Product Type Breakdown */}
        <div style={{ ...sectionStyle, flex: "1 1 400px", marginBottom: 0 }}>
          <Heading level="h2" style={{ marginBottom: 16 }}>
            Product Types
          </Heading>
          <HorizontalBar items={typeItems} />
        </div>
      </div>

      {/* Two column layout */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        {/* Top Products */}
        <div style={{ ...sectionStyle, flex: "1 1 400px", marginBottom: 0 }}>
          <Heading level="h2" style={{ marginBottom: 16 }}>
            Top Products
          </Heading>
          {top_products.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {top_products.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom:
                      i < top_products.length - 1
                        ? "1px solid var(--border-base, #e5e5e5)"
                        : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: "var(--bg-subtle, #f5f5f5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--fg-muted)",
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <Text
                      size="small"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.title}
                    </Text>
                  </div>
                  <div style={{ display: "flex", gap: 12, flexShrink: 0, marginLeft: 8 }}>
                    <Badge color="grey" size="small">
                      {p.quantity} sold
                    </Badge>
                    <Text
                      size="small"
                      weight="plus"
                      style={{ color: "var(--fg-subtle)", minWidth: 80, textAlign: "right" }}
                    >
                      {formatCurrency(p.revenue)}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Text size="small" style={{ color: "var(--fg-muted)" }}>
              No product sales data yet
            </Text>
          )}
        </div>

        {/* Dietary Tags */}
        <div style={{ ...sectionStyle, flex: "1 1 400px", marginBottom: 0 }}>
          <Heading level="h2" style={{ marginBottom: 16 }}>
            Dietary Tags
          </Heading>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                label: "Sugar Free",
                value: dietary_tags.sugar_free,
                badge: "SF",
                badgeColor: "green" as const,
              },
              {
                label: "Low Protein (PKU)",
                value: dietary_tags.low_protein,
                badge: "PKU",
                badgeColor: "purple" as const,
              },
              {
                label: "Diabetic Friendly",
                value: dietary_tags.diabetic_friendly,
                badge: "DIA",
                badgeColor: "blue" as const,
              },
              {
                label: "Gluten Free",
                value: dietary_tags.gluten_free,
                badge: "GF",
                badgeColor: "orange" as const,
              },
            ].map((tag) => (
              <div
                key={tag.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Badge color={tag.badgeColor} size="small">
                    {tag.badge}
                  </Badge>
                  <Text size="small">{tag.label}</Text>
                </div>
                <Text size="small" weight="plus">
                  {tag.value} products
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Reports",
  icon: ChartBar,
})

export default ReportsPage
