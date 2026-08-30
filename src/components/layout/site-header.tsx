import { BrandMark } from "@/components/brand/brand-mark";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandMark />

        <p className="hidden text-sm font-medium text-muted sm:block">
          {siteConfig.tagline}
        </p>
      </div>
    </header>
  );
}
