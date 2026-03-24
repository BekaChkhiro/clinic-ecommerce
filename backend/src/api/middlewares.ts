import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      // BOG iPay webhook - no authentication required
      matcher: "/hooks/payment/bog-ipay",
      method: "POST",
      middlewares: [],
    },
  ],
})
