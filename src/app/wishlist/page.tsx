import { redirect } from "next/navigation";

export default function WishlistRedirect() {
  redirect("/cart?view=saved");
}
