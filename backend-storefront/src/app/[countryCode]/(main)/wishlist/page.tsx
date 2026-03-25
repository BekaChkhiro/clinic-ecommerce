import { Metadata } from "next"
import WishlistTemplate from "@modules/wishlist/templates"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved products",
}

export default function WishlistPage() {
  return <WishlistTemplate />
}
