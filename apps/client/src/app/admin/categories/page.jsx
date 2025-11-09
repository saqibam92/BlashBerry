// File: apps/client/src/spp//admin/categories/page.jsx

"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
  getAdminCategories,
  updateAdminCategory,
  deleteAdminCategory,
} from "@/lib/adminApi";
import toast from "react-hot-toast";
import CategoryCreator from "@/components/admin/CategoryCreator";

export default function CategorySetupPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAdminCategories();
      setCategories(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Dialog Control Handlers ---

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsCreatorOpen(true);
  };

  // Handler to open the dialog for creation
  const handleAdd = () => {
    setSelectedCategory(null);
    setIsCreatorOpen(true);
  };

  const handleCloseCreator = () => {
    setIsCreatorOpen(false);
    setSelectedCategory(null);
  };

  const handleCategorySaved = () => {
    fetchCategories();
  };

  // --- CRUD Actions ---

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      await toast.promise(deleteAdminCategory(id), {
        loading: "Deleting category...",
        success: () => {
          fetchCategories();
          return "Category deleted successfully!";
        },
        error: (err) =>
          err.response?.data?.message || "Failed to delete category.",
      });
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const payload = { isActive: !currentStatus };
    await toast.promise(updateAdminCategory(id, payload), {
      loading: "Updating status...",
      success: () => {
        setCategories((cats) =>
          cats.map((c) => (c._id === id ? { ...c, isActive: !c.isActive } : c))
        );
        return "Status updated successfully!";
      },
      error: "Failed to update status.",
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">Category Setup</Typography>
        <Button variant="contained" onClick={handleAdd}>
          Add New Category
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        Category List
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat, index) => (
                <TableRow key={cat._id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Avatar src={cat.image} alt={cat.name} variant="rounded" />
                  </TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.priority}</TableCell>
                  <TableCell>
                    <Switch
                      checked={cat.isActive}
                      onChange={() => handleStatusToggle(cat._id, cat.isActive)}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <IconButton onClick={() => handleEdit(cat)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(cat._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CategoryCreator
        open={isCreatorOpen}
        onClose={handleCloseCreator}
        onCategorySaved={handleCategorySaved}
        initialCategory={selectedCategory}
      />
    </Box>
  );
}

// // File: apps/client/src/spp//admin/categories/page.jsx

// "use client";
// import { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   TextField,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Switch,
//   CircularProgress,
//   Avatar,
// } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";
// import {
//   getAdminCategories,
//   updateAdminCategory,
//   deleteAdminCategory,
// } from "@/lib/adminApi";
// import toast from "react-hot-toast";
// import CategoryCreator from "@/components/admin/CategoryCreator";

// export default function CategorySetupPage() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [editId, setEditId] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     name: "",
//     image: "",
//     priority: 10,
//   });

//   const [isCreatorOpen, setIsCreatorOpen] = useState(false);

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const res = await getAdminCategories();
//       setCategories(res.data.data);
//     } catch (error) {
//       toast.error("Failed to fetch categories.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleEditInputChange = (e) => {
//     setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     if (!editId) return;
//     const apiCall = updateAdminCategory(editId, editFormData);

//     await toast.promise(apiCall, {
//       loading: "Updating category...",
//       success: (res) => {
//         resetEditForm();
//         fetchCategories();
//         return "Category updated successfully!";
//       },
//       error: (err) =>
//         err.response?.data?.message || "Failed to update category.",
//     });
//   };

//   const handleEdit = (category) => {
//     window.scrollTo(0, 0);
//     setEditId(category._id);
//     setEditFormData({
//       name: category.name,
//       image: category.image,
//       priority: category.priority,
//     });
//   };

//   const resetEditForm = () => {
//     setEditId(null);
//     setEditFormData({ name: "", image: "", priority: 10 });
//   };

//   // --- CRUD Actions ---

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure? This action cannot be undone.")) {
//       await toast.promise(deleteAdminCategory(id), {
//         loading: "Deleting category...",
//         success: () => {
//           fetchCategories();
//           return "Category deleted successfully!";
//         },
//         error: (err) =>
//           err.response?.data?.message || "Failed to delete category.",
//       });
//     }
//   };

//   const handleStatusToggle = async (id, currentStatus) => {
//     const payload = { isActive: !currentStatus };
//     await toast.promise(updateAdminCategory(id, payload), {
//       loading: "Updating status...",
//       success: () => {
//         setCategories((cats) =>
//           cats.map((c) => (c._id === id ? { ...c, isActive: !c.isActive } : c))
//         );
//         return "Status updated successfully!";
//       },
//       error: "Failed to update status.",
//     });
//   };

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Category Setup
//       </Typography>

//       {editId && (
//         <Card
//           component="form"
//           onSubmit={handleEditSubmit}
//           sx={{ mb: 4 }}
//           elevation={3}
//         >
//           <CardContent
//             sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//           >
//             <Typography variant="h6">Edit Category</Typography>
//             <TextField
//               label="Category Name"
//               name="name"
//               value={editFormData.name}
//               onChange={handleEditInputChange}
//               required
//             />
//             <TextField
//               label="Image URL"
//               name="image"
//               value={editFormData.image}
//               onChange={handleEditInputChange}
//               required
//             />
//             <TextField
//               label="Priority"
//               name="priority"
//               type="number"
//               value={editFormData.priority}
//               onChange={handleEditInputChange}
//             />
//             <Box sx={{ alignSelf: "flex-end" }}>
//               <Button onClick={resetEditForm} sx={{ mr: 2 }}>
//                 Cancel
//               </Button>
//               <Button type="submit" variant="contained">
//                 Update
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//       )}

//       {!editId && (
//         <Box sx={{ mb: 4 }}>
//           <Button variant="contained" onClick={() => setIsCreatorOpen(true)}>
//             Add New Category
//           </Button>
//         </Box>
//       )}

//       <Typography variant="h6" gutterBottom>
//         Category List
//       </Typography>
//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <TableContainer component={Paper} elevation={3}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
//                 <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
//                 <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
//                 <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
//                 <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
//                   Actions
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {categories.map((cat, index) => (
//                 <TableRow key={cat._id} hover>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>
//                     <Avatar src={cat.image} alt={cat.name} variant="rounded" />
//                   </TableCell>
//                   <TableCell>{cat.name}</TableCell>
//                   <TableCell>{cat.priority}</TableCell>
//                   <TableCell>
//                     <Switch
//                       checked={cat.isActive}
//                       onChange={() => handleStatusToggle(cat._id, cat.isActive)}
//                     />
//                   </TableCell>
//                   <TableCell sx={{ textAlign: "right" }}>
//                     <IconButton onClick={() => handleEdit(cat)} color="primary">
//                       <Edit />
//                     </IconButton>
//                     <IconButton
//                       onClick={() => handleDelete(cat._id)}
//                       color="error"
//                     >
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       <CategoryCreator
//         open={isCreatorOpen}
//         onClose={() => setIsCreatorOpen(false)}
//         onCategoryCreated={fetchCategories} // Refresh list on successful creation
//       />
//     </Box>
//   );
// }
