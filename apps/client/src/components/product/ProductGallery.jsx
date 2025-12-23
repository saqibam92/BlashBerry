// File: apps/client/src/components/product/ProductGallery.jsx

"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function ProductGallery({ images, altText = "Product Image" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const zoomImgRef = useRef(null);
  const containerRef = useRef(null);

  // Guard clause: If no images or empty array, return null or placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        No Image
      </div>
    );
  }

  const handleMouseMove = (e) => {
    if (!zoomImgRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    zoomImgRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  const activeImage = images[activeIndex];

  return (
    <div>
      {/* MAIN IMAGE */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative aspect-square w-full overflow-hidden rounded-lg cursor-crosshair group border border-gray-100 bg-white"
      >
        {/* Base image (normal resolution) */}
        <Image
          src={activeImage} // Use the string URL directly
          alt={altText}
          fill
          priority
          quality={90}
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover" // Ensures image fills the square container
        />

        {/* Zoom image (high resolution) */}
        <Image
          ref={zoomImgRef}
          src={activeImage} // Use the string URL directly
          alt={altText}
          fill
          quality={100}
          sizes="200vw" // Load a larger version for zooming
          className="
            pointer-events-none
            absolute inset-0
            object-cover
            opacity-0
            scale-[2.5]
            transition-opacity duration-200 ease-out
            group-hover:opacity-100
          "
        />
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="mx-auto mt-4 w-full max-w-2xl lg:max-w-none">
          <ul className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-4">
            {images.map((img, index) => (
              <li key={index} className="aspect-square">
                <button
                  onClick={() => setActiveIndex(index)}
                  className={`flex h-full w-full items-center justify-center rounded-lg border-2 p-0.5 transition overflow-hidden relative ${
                    activeIndex === index
                      ? "border-primary"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img} // Use the string URL directly
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover rounded-md"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// "use client";
// import { useState, useRef } from "react";
// import Image from "next/image";

// export default function ProductGallery({ images, altText }) {
//   const [mainImage, setMainImage] = useState(images[0]);
//   const imgRef = useRef(null);
//   const containerRef = useRef(null);

//   const handleMouseMove = (e) => {
//     if (!imgRef.current || !containerRef.current) return;

//     const { left, top, width, height } =
//       containerRef.current.getBoundingClientRect();
//     const x = ((e.pageX - left - window.scrollX) / width) * 100;
//     const y = ((e.pageY - top - window.scrollY) / height) * 100;

//     imgRef.current.style.transformOrigin = `${x}% ${y}%`;
//   };

//   return (
//     <div>
//       {/* Main Image Container */}
//       <div
//         ref={containerRef}
//         onMouseMove={handleMouseMove}
//         className="relative aspect-square w-full overflow-hidden rounded-lg cursor-zoom-in group"
//       >
//         <Image
//           ref={imgRef}
//           src={mainImage}
//           alt={altText}
//           fill
//           className="object-contain w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-[2.5]" // Scale is 2.5 for ~5x feel
//           sizes="(max-width: 1024px) 100vw, 50vw"
//           priority
//         />
//       </div>

//       {/* Thumbnails */}
//       <div className="mx-auto mt-4 w-full max-w-2xl lg:max-w-none">
//         <ul className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-4">
//           {images.map((image, index) => (
//             <li key={index} className="aspect-square">
//               <button
//                 onClick={() => setMainImage(image)}
//                 className={`flex h-full w-full items-center justify-center rounded-lg border-2 p-1 transition ${
//                   mainImage === image
//                     ? "border-primary-600"
//                     : "border-transparent"
//                 }`}
//               >
//                 <Image
//                   src={image}
//                   alt={`Thumbnail ${index + 1}`}
//                   width={200}
//                   height={200}
//                   className="h-full w-full object-cover object-center rounded-md"
//                 />
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
