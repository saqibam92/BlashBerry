// File: apps/client/src/app/(shop)/page.js (Homepage)
import BannerSlider from "@/components/home/BannerSlider";
import HomePageClient from "@/components/home/HomePageClient";
import VideoSection from "@/components/home/VideoSection";
import WhatsNew from "@/components/home/WhatsNew";
import {
  getFeaturedProducts,
  getActiveBanners,
  getCategories,
  getSelectedVideo,
} from "@/lib/productApi";

// This function fetches data on the server.
async function getHomePageData() {
  try {
    const [bannersRes, products, categoriesRes, videoRes] = await Promise.all([
      getActiveBanners(),
      getFeaturedProducts(),
      getCategories(),
      getSelectedVideo(),
    ]);
    console.log("vid: ", videoRes);

    const banners = bannersRes?.data?.data || [];
    const categories = categoriesRes?.data || [];
    const video = videoRes?.data || [];
    console.log("Video: ", videoRes.data);
    return { banners, products, categories, video };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error.message);
    return { banners: [], products: [], categories: [], video: [] };
  }
}

export default async function HomePage() {
  const { banners, products, categories, video } = await getHomePageData();
  // console.log("categories", categories);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BannerSlider banners={banners} />
        <WhatsNew categories={categories} />
        {/* The client component handles all the interactive parts. */}
        <HomePageClient products={products} />
        <VideoSection video={video} />
      </div>
    </div>
  );
}
