import { api, HydrateClient } from "~/trpc/server";
import { CreatePageSection } from "./_components/CreatePageSection";
import { ExpertsSection } from "./_components/ExpertsSection";
import { HeroSection } from "./_components/HeroSection";
import { OfferingsSection } from "./_components/OfferingsSection";

export default async function HomePage() {
  const userProfile = await api.userProfile.get({});
  console.log("from server", userProfile);
  return (
    <HydrateClient>
      <HeroSection />
      <ExpertsSection />
      <CreatePageSection />
      <OfferingsSection />
    </HydrateClient>
  );
}
