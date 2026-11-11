import type { MetadataRoute } from "next";
import { storeDescription, storeName } from "@/config/store";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: storeName,
    short_name: storeName.slice(0, 12),
    description: storeDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#080b12",
    theme_color: "#080b12",
    icons: [{ src: "/logo-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
