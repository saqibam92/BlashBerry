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
  Box,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getCategories } from "@/lib/productApi";

const colorOptions = [
  { id: "red", name: "Red", hex: "#FF0000" },
  { id: "blue", name: "Blue", hex: "#0000FF" },
  { id: "black", name: "Black", hex: "#000000" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "green", name: "Green", hex: "#00FF00" },
  { id: "pink", name: "Pink", hex: "#FFC0CB" },
  { id: "yellow", name: "Yellow", hex: "#FFFF00" },
  { id: "purple", name: "Purple", hex: "#800080" },
];

const ProductFilter = ({ onFilterChange, categories: propCategories }) => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSort, setSelectedSort] = useState("newest");
  const [categories, setCategories] = useState(propCategories || []);

  useEffect(() => {
    if (!propCategories || propCategories.length === 0) {
      const fetchCategories = async () => {
        try {
          const res = await getCategories();
          if (res.success) setCategories(res.data);
        } catch (error) {
          console.error("Failed to fetch categories for filter:", error);
        }
      };
      fetchCategories();
    }
  }, [propCategories]);

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

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSort("newest");
    onFilterChange({
      minPrice: 0,
      maxPrice: 10000,
      category: "",
      color: "",
      sort: "newest",
    });
  };

  const handlePriceChange = (event, newValue) => setPriceRange(newValue);
  const handleSortChange = (event) => setSelectedSort(event.target.value);

  return (
    <Box
      sx={{
        p: 3,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        backgroundColor: "white",
        position: "sticky",
        top: 20,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filters
        </Typography>
        <Button
          size="small"
          onClick={clearFilters}
          sx={{ fontSize: "0.75rem" }}
        >
          Clear All
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Category Filter */}
      <Accordion
        defaultExpanded
        disableGutters
        elevation={0}
        sx={{
          "&:before": { display: "none" },
          mb: 1,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ px: 0, minHeight: "auto" }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Category
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0 }}>
          <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <FormControlLabel
                  key={cat._id}
                  control={
                    <Checkbox
                      size="small"
                      value={cat._id}
                      checked={selectedCategories.includes(cat._id)}
                      onChange={handleCategoryChange}
                    />
                  }
                  label={<Typography variant="body2">{cat.name}</Typography>}
                  sx={{ display: "flex", mb: 0.5 }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Loading categories...
              </Typography>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Color Filter */}
      <Accordion
        disableGutters
        elevation={0}
        sx={{
          "&:before": { display: "none" },
          mb: 1,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ px: 0, minHeight: "auto" }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Color
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {colorOptions.map((color) => (
              <Box
                key={color.id}
                onClick={() => {
                  const event = {
                    target: {
                      value: color.id,
                      checked: !selectedColors.includes(color.id),
                    },
                  };
                  handleColorChange(event);
                }}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: color.hex,
                  border: 2,
                  borderColor: selectedColors.includes(color.id)
                    ? "black"
                    : "grey.300",
                  borderRadius: "50%",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "scale(1.1)",
                    borderColor: "grey.600",
                  },
                  ...(color.id === "white" && {
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
                  }),
                }}
                title={color.name}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Price Range Filter */}
      <Accordion
        disableGutters
        elevation={0}
        sx={{
          "&:before": { display: "none" },
          mb: 1,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ px: 0, minHeight: "auto" }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Price Range
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            max={10000}
            step={100}
            valueLabelDisplay="auto"
            size="small"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              ${priceRange[0]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${priceRange[1]}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Sort By Filter */}
      <Accordion
        disableGutters
        elevation={0}
        sx={{
          "&:before": { display: "none" },
          mb: 2,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ px: 0, minHeight: "auto" }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Sort By
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0 }}>
          <RadioGroup value={selectedSort} onChange={handleSortChange}>
            {[
              { value: "newest", label: "Newest" },
              { value: "price_asc", label: "Price: Low to High" },
              { value: "price_desc", label: "Price: High to Low" },
              { value: "rating", label: "Top Rated" },
            ].map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio size="small" />}
                label={<Typography variant="body2">{option.label}</Typography>}
              />
            ))}
          </RadioGroup>
        </AccordionDetails>
      </Accordion>

      {/* Apply Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={applyFilters}
        sx={{
          backgroundColor: "black",
          color: "white",
          py: 1.5,
          "&:hover": {
            backgroundColor: "grey.800",
          },
        }}
      >
        Apply Filters
      </Button>
    </Box>
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
//   Box,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { getCategories } from "@/lib/productApi";

// // Color options with hex codes for swatches
// const colorOptions = [
//   { id: "red", name: "Red", hex: "#FF0000" },
//   { id: "blue", name: "Blue", hex: "#0000FF" },
//   { id: "black", name: "Black", hex: "#000000" },
//   { id: "white", name: "White", hex: "#FFFFFF" },
//   { id: "green", name: "Green", hex: "#00FF00" },
// ];

// const ProductFilter = ({ onFilterChange }) => {
//   const [priceRange, setPriceRange] = useState([0, 10000]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [selectedColors, setSelectedColors] = useState([]);
//   const [selectedSort, setSelectedSort] = useState("newest");
//   const [categories, setCategories] = useState([]);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getCategories();
//         if (res.success) setCategories(res.data);
//       } catch (error) {
//         console.error("Failed to fetch categories for filter:", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const handleCategoryChange = (event) => {
//     const { value, checked } = event.target;
//     setSelectedCategories((prev) =>
//       checked ? [...prev, value] : prev.filter((id) => id !== value)
//     );
//   };

//   const handleColorChange = (event) => {
//     const { value, checked } = event.target;
//     setSelectedColors((prev) =>
//       checked ? [...prev, value] : prev.filter((id) => id !== value)
//     );
//   };

//   const applyFilters = () => {
//     onFilterChange({
//       minPrice: priceRange[0],
//       maxPrice: priceRange[1],
//       category: selectedCategories.join(","),
//       color: selectedColors.join(","),
//       sort: selectedSort,
//     });
//   };

//   const handlePriceChange = (event, newValue) => setPriceRange(newValue);
//   const handleSortChange = (event) => setSelectedSort(event.target.value);

//   return (
//     <div className="p-4 border rounded-lg shadow-sm space-y-2">
//       <Button
//         variant="outlined"
//         onClick={() => setIsFilterOpen(!isFilterOpen)}
//         fullWidth
//         size="small"
//       >
//         {isFilterOpen ? "Hide Filters" : "Show Filters"}
//       </Button>
//       {isFilterOpen && (
//         <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
//           <Accordion defaultExpanded sx={{ "&:before": { display: "none" } }}>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography variant="subtitle1">Category</Typography>
//             </AccordionSummary>
//             <AccordionDetails sx={{ p: 1 }}>
//               <div className="grid grid-cols-2 gap-1">
//                 {categories.length > 0 ? (
//                   categories.map((cat) => (
//                     <FormControlLabel
//                       key={cat._id}
//                       control={
//                         <Checkbox
//                           size="small"
//                           value={cat._id}
//                           onChange={handleCategoryChange}
//                         />
//                       }
//                       label={
//                         <Typography variant="body2">{cat.name}</Typography>
//                       }
//                     />
//                   ))
//                 ) : (
//                   <Typography variant="body2" color="text.secondary">
//                     Loading...
//                   </Typography>
//                 )}
//               </div>
//             </AccordionDetails>
//           </Accordion>

//           <Accordion sx={{ "&:before": { display: "none" } }}>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography variant="subtitle1">Color</Typography>
//             </AccordionSummary>
//             <AccordionDetails sx={{ p: 1 }}>
//               <div className="grid grid-cols-3 gap-1">
//                 {colorOptions.map((color) => (
//                   <FormControlLabel
//                     key={color.id}
//                     control={
//                       <Checkbox
//                         size="small"
//                         value={color.id}
//                         onChange={handleColorChange}
//                         sx={{ "& .MuiSvgIcon-root": { fontSize: 16 } }}
//                       />
//                     }
//                     label={
//                       <Box
//                         sx={{
//                           width: 16,
//                           height: 16,
//                           backgroundColor: color.hex,
//                           borderRadius: "50%",
//                           display: "inline-block",
//                           verticalAlign: "middle",
//                           mr: 1,
//                         }}
//                       />
//                     }
//                   />
//                 ))}
//               </div>
//             </AccordionDetails>
//           </Accordion>

//           <Accordion sx={{ "&:before": { display: "none" } }}>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography variant="subtitle1">Price Range</Typography>
//             </AccordionSummary>
//             <AccordionDetails sx={{ p: 1 }}>
//               <Slider
//                 value={priceRange}
//                 onChange={handlePriceChange}
//                 max={10000}
//                 step={100}
//                 valueLabelDisplay="auto"
//                 size="small"
//                 sx={{ width: "100%", mb: 1 }}
//               />
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   fontSize: 12,
//                 }}
//               >
//                 <Typography>${priceRange[0]}</Typography>
//                 <Typography>${priceRange[1]}</Typography>
//               </Box>
//             </AccordionDetails>
//           </Accordion>

//           <Accordion sx={{ "&:before": { display: "none" } }}>
//             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//               <Typography variant="subtitle1">Sort By</Typography>
//             </AccordionSummary>
//             <AccordionDetails sx={{ p: 1 }}>
//               <RadioGroup value={selectedSort} onChange={handleSortChange} row>
//                 {["newest", "price_asc", "price_desc", "rating"].map(
//                   (option) => (
//                     <FormControlLabel
//                       key={option}
//                       value={option}
//                       control={<Radio size="small" />}
//                       label={
//                         <Typography variant="body2">
//                           {option === "newest"
//                             ? "Newest"
//                             : option === "price_asc"
//                             ? "Price: Low to High"
//                             : option === "price_desc"
//                             ? "Price: High to Low"
//                             : "Top Rated"}
//                         </Typography>
//                       }
//                     />
//                   )
//                 )}
//               </RadioGroup>
//             </AccordionDetails>
//           </Accordion>

//           <Button
//             variant="contained"
//             color="primary"
//             size="small"
//             className="w-full mt-2"
//             onClick={applyFilters}
//           >
//             Apply
//           </Button>
//         </Box>
//       )}
//     </div>
//   );
// };

// export default ProductFilter;
