// File: apps/client/src/components/product/ProductFilter.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getCategories } from "@/lib/productApi";

// Color options with hex codes for swatches
const colorOptions = [
  { id: "red", name: "Red", hex: "#FF0000" },
  { id: "blue", name: "Blue", hex: "#0000FF" },
  { id: "black", name: "Black", hex: "#000000" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "green", name: "Green", hex: "#00FF00" },
];

const ProductFilter = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSort, setSelectedSort] = useState("newest");
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (res.success) setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories for filter:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleColorChange = (event) => {
    const { value, checked } = event.target;
    setSelectedColors((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const applyFilters = () => {
    onFilterChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      category: selectedCategories.join(","),
      color: selectedColors.join(","),
      sort: selectedSort,
    });
  };

  const handlePriceChange = (event, newValue) => setPriceRange(newValue);
  const handleSortChange = (event) => setSelectedSort(event.target.value);

  return (
    <div className="p-4 border rounded-lg shadow-sm space-y-2">
      <Button
        variant="outlined"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        fullWidth
        size="small"
      >
        {isFilterOpen ? "Hide Filters" : "Show Filters"}
      </Button>
      {isFilterOpen && (
        <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
          <Accordion defaultExpanded sx={{ "&:before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Category</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1 }}>
              <div className="grid grid-cols-2 gap-1">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <FormControlLabel
                      key={cat._id}
                      control={
                        <Checkbox
                          size="small"
                          value={cat._id}
                          onChange={handleCategoryChange}
                        />
                      }
                      label={
                        <Typography variant="body2">{cat.name}</Typography>
                      }
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                )}
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ "&:before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Color</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1 }}>
              <div className="grid grid-cols-3 gap-1">
                {colorOptions.map((color) => (
                  <FormControlLabel
                    key={color.id}
                    control={
                      <Checkbox
                        size="small"
                        value={color.id}
                        onChange={handleColorChange}
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          backgroundColor: color.hex,
                          borderRadius: "50%",
                          display: "inline-block",
                          verticalAlign: "middle",
                          mr: 1,
                        }}
                      />
                    }
                  />
                ))}
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ "&:before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Price Range</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1 }}>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                max={10000}
                step={100}
                valueLabelDisplay="auto"
                size="small"
                sx={{ width: "100%", mb: 1 }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <Typography>${priceRange[0]}</Typography>
                <Typography>${priceRange[1]}</Typography>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ "&:before": { display: "none" } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Sort By</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1 }}>
              <RadioGroup value={selectedSort} onChange={handleSortChange} row>
                {["newest", "price_asc", "price_desc", "rating"].map(
                  (option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2">
                          {option === "newest"
                            ? "Newest"
                            : option === "price_asc"
                            ? "Price: Low to High"
                            : option === "price_desc"
                            ? "Price: High to Low"
                            : "Top Rated"}
                        </Typography>
                      }
                    />
                  )
                )}
              </RadioGroup>
            </AccordionDetails>
          </Accordion>

          <Button
            variant="contained"
            color="primary"
            size="small"
            className="w-full mt-2"
            onClick={applyFilters}
          >
            Apply
          </Button>
        </Box>
      )}
    </div>
  );
};

export default ProductFilter;

// // File: apps/client/src/components/product/ProductFilter.jsx

// "use client";

// import { useState, useEffect } from "react";
// import {
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Typography,
//   Checkbox,
//   FormControlLabel,
//   Slider,
//   Button,
//   Radio,
//   RadioGroup,
//   FormControl,
//   FormLabel,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { getCategories } from "@/lib/productApi";

// // Pass onFilterChange as a prop
// const ProductFilter = ({ onFilterChange }) => {
//   const [priceRange, setPriceRange] = useState([0, 10000]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [selectedSort, setSelectedSort] = useState("newest");
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getCategories();
//         if (res.success) {
//           setCategories(res.data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch categories for filter:", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const handleCategoryChange = (event) => {
//     const { value, checked } = event.target; // The 'value' will be the category _id
//     setSelectedCategories((prev) =>
//       checked ? [...prev, value] : prev.filter((id) => id !== value)
//     );
//   };

//   const applyFilters = () => {
//     onFilterChange({
//       minPrice: priceRange[0],
//       maxPrice: priceRange[1],
//       category: selectedCategories.join(","), // Join the IDs into a string
//       sort: selectedSort,
//     });
//   };

//   // Mock data - in a real app, you might fetch these from the API
//   // const categories = [
//   //   "T-Shirts",
//   //   "Hoodies",
//   //   "Jeans",
//   //   "Dresses",
//   //   "Shoes",
//   //   "Jackets",
//   // ];

//   const handlePriceChange = (event, newValue) => {
//     setPriceRange(newValue);
//   };

//   // const handleCategoryChange = (event) => {
//   //   const { name, checked } = event.target;
//   //   setSelectedCategories((prev) =>
//   //     checked ? [...prev, name] : prev.filter((cat) => cat !== name)
//   //   );
//   // };

//   const handleSortChange = (event) => {
//     setSelectedSort(event.target.value);
//   };

//   // const applyFilters = () => {
//   //   onFilterChange({
//   //     minPrice: priceRange[0],
//   //     maxPrice: priceRange[1],
//   //     category: selectedCategories.join(","), // API can split by comma
//   //     sort: selectedSort,
//   //   });
//   // };

//   return (
//     <div className="p-4 border rounded-lg shadow-sm space-y-4">
//       <Typography variant="h6">Filters</Typography>

//       <Accordion defaultExpanded>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//           <Typography>Category</Typography>
//         </AccordionSummary>
//         <AccordionDetails className="flex flex-col">
//           {categories.length > 0 ? (
//             categories.map((cat) => (
//               <FormControlLabel
//                 key={cat._id}
//                 label={cat.name}
//                 control={
//                   <Checkbox
//                     value={cat._id} // --- FIX: Use the ID as the value ---
//                     onChange={handleCategoryChange}
//                   />
//                 }
//               />
//             ))
//           ) : (
//             <Typography variant="body2" color="text.secondary">
//               Loading categories...
//             </Typography>
//           )}
//         </AccordionDetails>
//       </Accordion>

//       <Accordion>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//           <Typography>Price Range</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Slider
//             value={priceRange}
//             onChange={handlePriceChange}
//             max={10000}
//             step={100}
//             valueLabelDisplay="auto"
//             getAriaLabel={() => "Price range"}
//           />
//           <div className="flex justify-between">
//             <Typography variant="body2">${priceRange[0]}</Typography>
//             <Typography variant="body2">${priceRange[1]}</Typography>
//           </div>
//         </AccordionDetails>
//       </Accordion>

//       <Accordion>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//           <Typography>Sort By</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <FormControl>
//             <RadioGroup value={selectedSort} onChange={handleSortChange}>
//               <FormControlLabel
//                 value="newest"
//                 control={<Radio />}
//                 label="Newest"
//               />
//               <FormControlLabel
//                 value="price_asc"
//                 control={<Radio />}
//                 label="Price: Low to High"
//               />
//               <FormControlLabel
//                 value="price_desc"
//                 control={<Radio />}
//                 label="Price: High to Low"
//               />
//               <FormControlLabel
//                 value="rating"
//                 control={<Radio />}
//                 label="Top Rated"
//               />
//             </RadioGroup>
//           </FormControl>
//         </AccordionDetails>
//       </Accordion>

//       <Button
//         variant="contained"
//         color="primary"
//         className="w-full"
//         onClick={applyFilters}
//       >
//         Apply Filters
//       </Button>
//     </div>
//   );
// };

// export default ProductFilter;
