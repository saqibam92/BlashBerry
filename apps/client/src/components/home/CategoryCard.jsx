// File: apps/client/src/components/home/CategoryCard.jsx

export const CategoryCard = ({ category = [] }) => {
  return (
    <a
      href={`/category/${category.slug}`}
      className="flex flex-col items-center flex-shrink-0 w-32 md:w-40 transform transition-transform hover:scale-105"
    >
      <div className="flex flex-col items-center transform transition-transform hover:scale-105 group">
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-100 shadow-md transition-shadow duration-300 group-hover:shadow-lg">
          {/* Replaced <Image> with <img> and inline styles */}
          <img
            src={category.image}
            alt={category.name}
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              left: 0,
              top: 0,
              objectFit: "cover",
              objectPosition: "center",
            }}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://placehold.co/128x128/f3f4f6/9ca3af?text=${
                category.name?.charAt(0) || "A"
              }`;
            }}
          />
        </div>
        <p className="mt-2 text-xs md:text-sm font-medium text-gray-900 uppercase text-center">
          {category.name}
        </p>
      </div>
    </a>
  );
};

// CategoryCard.displayName = "CategoryCard";
