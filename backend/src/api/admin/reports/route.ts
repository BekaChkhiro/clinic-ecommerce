import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /admin/reports - Dashboard statistics
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Parse date range from query params
    const daysBack = Number(req.query.days) || 30
    const now = new Date()
    const fromDate = new Date(now)
    fromDate.setDate(fromDate.getDate() - daysBack)

    // 1. Fetch all orders with their statuses
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "created_at",
        "total",
        "currency_code",
        "items.*",
        "custom_order_status.*",
      ],
    })

    // 2. Fetch products count
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "created_at"],
    })

    // 3. Fetch product extensions for category stats
    const { data: productExtensions } = await query.graph({
      entity: "product_extension",
      fields: [
        "id",
        "is_sugar_free",
        "is_low_protein",
        "is_diabetic_friendly",
        "is_gluten_free",
        "product_type",
      ],
    })

    // Calculate order stats
    const totalOrders = orders.length
    const recentOrders = orders.filter(
      (o: any) => new Date(o.created_at) >= fromDate
    )

    // Status breakdown
    const statusCounts: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      PACKED: 0,
      COURIER_ASSIGNED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    }

    for (const order of orders) {
      const status =
        (order as any).custom_order_status?.status || "PENDING"
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++
      }
    }

    // Revenue calculation (total from all non-cancelled orders)
    const totalRevenue = orders
      .filter(
        (o: any) =>
          (o as any).custom_order_status?.status !== "CANCELLED"
      )
      .reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0)

    const recentRevenue = recentOrders
      .filter(
        (o: any) =>
          (o as any).custom_order_status?.status !== "CANCELLED"
      )
      .reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0)

    // Daily revenue for chart (last N days)
    const dailyRevenue: { date: string; revenue: number; orders: number }[] = []
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const dayOrders = orders.filter((o: any) => {
        const orderDate = new Date(o.created_at).toISOString().split("T")[0]
        return (
          orderDate === dateStr &&
          (o as any).custom_order_status?.status !== "CANCELLED"
        )
      })

      dailyRevenue.push({
        date: dateStr,
        revenue: dayOrders.reduce(
          (sum: number, o: any) => sum + (Number(o.total) || 0),
          0
        ),
        orders: dayOrders.length,
      })
    }

    // Top products by order count
    const productSales: Record<
      string,
      { title: string; quantity: number; revenue: number }
    > = {}
    for (const order of orders) {
      if ((order as any).custom_order_status?.status === "CANCELLED") continue
      const items = (order as any).items || []
      for (const item of items) {
        const key = item.product_id || item.title
        if (!productSales[key]) {
          productSales[key] = { title: item.title, quantity: 0, revenue: 0 }
        }
        productSales[key].quantity += Number(item.quantity) || 1
        productSales[key].revenue +=
          (Number(item.unit_price) || 0) * (Number(item.quantity) || 1)
      }
    }

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)

    // Product type breakdown
    const typeCounts: Record<string, number> = {}
    for (const ext of productExtensions) {
      const pType = (ext as any).product_type || "OTHER"
      typeCounts[pType] = (typeCounts[pType] || 0) + 1
    }

    // Dietary tag counts
    const dietaryTags = {
      sugar_free: productExtensions.filter((e: any) => e.is_sugar_free).length,
      low_protein: productExtensions.filter((e: any) => e.is_low_protein)
        .length,
      diabetic_friendly: productExtensions.filter(
        (e: any) => e.is_diabetic_friendly
      ).length,
      gluten_free: productExtensions.filter((e: any) => e.is_gluten_free)
        .length,
    }

    // Average order value
    const completedOrders = orders.filter(
      (o: any) =>
        (o as any).custom_order_status?.status !== "CANCELLED" &&
        Number(o.total) > 0
    )
    const avgOrderValue =
      completedOrders.length > 0
        ? completedOrders.reduce(
            (sum: number, o: any) => sum + Number(o.total),
            0
          ) / completedOrders.length
        : 0

    res.json({
      summary: {
        total_orders: totalOrders,
        recent_orders: recentOrders.length,
        total_revenue: totalRevenue,
        recent_revenue: recentRevenue,
        avg_order_value: Math.round(avgOrderValue),
        total_products: products.length,
        days_back: daysBack,
      },
      order_statuses: statusCounts,
      daily_revenue: dailyRevenue,
      top_products: topProducts,
      product_types: typeCounts,
      dietary_tags: dietaryTags,
    })
  } catch (error: any) {
    console.error("Reports API error:", error)
    res.status(500).json({ message: error.message })
  }
}
