// File: apps/client/src/app/(shop)/category/[slug]/page.jsx
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import {
  getCategoryData,
  getCategoryProducts,
  getCategories,
} from "@/lib/productApi";
import ProductList from "@/components/product/ProductList";

export async function generateMetadata({ params }) {
  const category = await getCategoryData(params.slug);
  if (!category) {
    return { title: "Category Not Found" };
  }
  return {
    title: `${category.name} | BlashBerry`,
    description: `Shop for products in the ${category.name} category.`,
  };
}

export default async function CategoryProductPage({ params }) {
  const { slug } = params;
  const category = await getCategoryData(slug);
  console.log("Category: ", category);

  if (!category) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Category Not Found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the category you’re looking for.
        </p>
        <div className="mt-10">
          <Link
            href="/products"
            className="text-sm font-semibold text-blue-600 hover:text-blue-500"
          >
            &larr; Back to all products
          </Link>
        </div>
      </div>
    );
  }

  const categories = await getCategories();
  console.log("Categories: ", categories);
  const initialProducts = await getCategoryProducts(category._id, {
    page: 1,
    limit: 9,
    sort: "newest",
  });

  console.log(initialProducts);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Category: <span className="text-blue-600">{category.name}</span>
      </h1>
      <ProductList
        title={`Products in ${category.name}`}
        initialFilters={{
          category: category._id,
          page: 1,
          limit: 9,
          sort: "newest",
        }}
        initialProducts={initialProducts}
      />
    </div>
  );
}

// import Link from "next/link";
// import { AlertTriangle } from "lucide-react";
// import { getCategoryData, getCategoryProducts } from "@/lib/productApi";
// import ProductList from "@/components/product/ProductList";
// import { getCategories } from "@/lib/productApi";

// // This is a React Server Component (RSC)
// // It fetches all data on the server first.

// // This metadata function dynamically sets the page title
// export async function generateMetadata({ params }) {
//   const category = await getCategoryData(params.slug);
//   if (!category) {
//     return { title: "Category Not Found" };
//   }
//   return {
//     title: `${category.name} | BlashBerry`,
//     description: `Shop for products in the ${category.name} category.`,
//   };
// }

// // The main page component
// export default async function CategoryPage({ params }) {
//   const { slug } = params;

//   // 1. Fetch the category details
//   const category = await getCategoryData(slug);

//   // Handle case where category doesn't exist
//   if (!category) {
//     return (
//       <div className="text-center py-20">
//         <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
//         <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
//           Category Not Found
//         </h1>
//         <p className="mt-6 text-base leading-7 text-gray-600">
//           Sorry, we couldn’t find the category you’re looking for.
//         </p>
//         <div className="mt-10">
//           <Link
//             href="/products"
//             className="text-sm font-semibold text-blue-600 hover:text-blue-500"
//           >
//             &larr; Back to all products
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // 2. Fetch products for that category
//   const products = await getCategoryProducts(category._id);
//   const { data: categories } = await getCategories();

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">
//         Category: <span className="text-blue-600">{category.name}</span>
//       </h1>
//       <ProductList
//         title={`Products in ${category.name}`}
//         initialFilters={{ category: category._id }}
//         categories={categories}
//       />
//     </div>
//   );
// }
