// File: apps/client/src/components/home/StyledByYou.jsx
import Image from "next/image";

const userStyles = [
  {
    src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=400&fit=crop",
    name: "Barbara",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    name: "Angelina",
  },
  {
    src: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop",
    name: "Rubab",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop",
    name: "Cornish",
  },
];

export default function StyledByYou() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Styled by You
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userStyles.map((style, index) => (
            <div key={index} className="relative group">
              {" "}
              <Image
                src={style.src}
                alt={`${style.name}'s style`}
                width={300}
                height={400}
                className="w-full h-64 object-cover rounded-lg group-hover:scale-105 transition-transform"
              />
              <p className="absolute bottom-2 left-2 text-white font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
                {style.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
