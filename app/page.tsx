import { CoffeeReveal } from "@/components/CoffeeReveal";
import { Features } from "@/components/Features";
import { QualitySection } from "@/components/QualitySection";
import { ShopSection } from "@/components/ShopSection";
import { LocationsSection } from "@/components/LocationsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <CoffeeReveal />

      <Features />
      <QualitySection />
      <ShopSection />
      <LocationsSection />
    </main>
  );
}
