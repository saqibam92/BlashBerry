// File: apps/client/src/app/(shop)/page.js (Homepage)
import BannerSlider from "@/components/home/BannerSlider";
import HomePageClient from "@/components/home/HomePageClient"; // <-- Import the new Client Component
import { getFeaturedProducts, getActiveBanners } from "@/lib/productApi";

// This function fetches data on the server.
async function getHomePageData() {
  try {
    const [bannersRes, products] = await Promise.all([
      getActiveBanners(),
      getFeaturedProducts(),
    ]);

    const banners = bannersRes?.data?.data || [];
    return { banners, products };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error.message);
    return { banners: [], products: [] };
  }
}

// This is your main Server Component for the homepage.
export default async function HomePage() {
  // It fetches data...
  const { banners, products } = await getHomePageData();

  // ...and then passes that data as props to the Client Components.
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BannerSlider banners={banners} />

        {/* The client component handles all the interactive parts. */}
        <HomePageClient products={products} />
      </div>
    </div>
  );
}
