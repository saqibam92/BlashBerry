// File: apps/client/src/components/home/WhatsNew.jsx
"use client";
import CategorySlider from "./CategorySlider";
import { CategoryCard } from "./CategoryCard";

export default function WhatsNew({ categories }) {
  if (categories.length === 0) return null;

  const duplicatedCategories = [...categories, ...categories, ...categories];
  //   const sliderRef = useInfiniteScroll(categories.length);

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-left text-gray-900 mb-8 uppercase">
          Categories
        </h2>
        <CategorySlider>
          {duplicatedCategories.map((category, index) => (
            <CategoryCard
              key={`${category._id}-${index}`}
              category={category}
            />
          ))}
        </CategorySlider>
      </div>
    </section>
  );
}
