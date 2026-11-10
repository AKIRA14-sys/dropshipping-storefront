import { Heart, PackageCheck, ShieldCheck } from "lucide-react";

export function Benefits() {
  return (
    <section className="benefit-strip" aria-label="Store highlights">
      <div>
        <ShieldCheck size={18} />
        <span>Browse at your own pace</span>
      </div>
      <div>
        <PackageCheck size={18} />
        <span>Simple delivery details</span>
      </div>
      <div>
        <Heart size={18} />
        <span>Little finds, big joy</span>
      </div>
    </section>
  );
}
