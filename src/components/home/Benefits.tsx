import { Heart, Search, UserRound } from "lucide-react";

export function Benefits() {
  return (
    <section className="benefit-strip" aria-label="Store features">
      <div>
        <Search size={18} />
        <span>Browse four clear departments</span>
      </div>
      <div>
        <Heart size={18} />
        <span>Save a wishlist on this device or account</span>
      </div>
      <div>
        <UserRound size={18} />
        <span>Manage addresses and account details</span>
      </div>
    </section>
  );
}
