// File: apps/client/src/components/product/ProductColumnSelector.jsx
"use client";

import { useState, useEffect } from "react";
import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const ProductColumnSelector = ({ onColumnChange, initialColumns = 4 }) => {
  const [columns, setColumns] = useState(initialColumns);

  useEffect(() => {
    onColumnChange(columns);
  }, [columns, onColumnChange]);

  const handleColumnChange = (e) => setColumns(Number(e.target.value));

  return (
    <Box sx={{ mb: 2, maxWidth: 150 }}>
      <FormControl fullWidth>
        <InputLabel>Columns</InputLabel>
        <Select value={columns} onChange={handleColumnChange} label="Columns">
          {[3, 4, 5].map((col) => (
            <MenuItem key={col} value={col}>
              {col} Columns
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ProductColumnSelector;
