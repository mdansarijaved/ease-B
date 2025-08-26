import { HydrateClient } from "~/trpc/server";
import { CreatePageSection } from "./_components/CreatePageSection";
import { ExpertsSection } from "./_components/ExpertsSection";
import { HeroSection } from "./_components/HeroSection";
import { OfferingsSection } from "./_components/OfferingsSection";

export default function HomePage() {
  return (
    <HydrateClient>
      <HeroSection />
      <ExpertsSection />
      <CreatePageSection />
      <OfferingsSection />
    </HydrateClient>
  );
}
