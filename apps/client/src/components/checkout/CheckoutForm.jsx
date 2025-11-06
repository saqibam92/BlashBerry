// apps/client/src/components/checkout/CheckoutForm.jsx

"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Grid, Box, CircularProgress } from "@mui/material";

const CheckoutForm = ({ onSubmit, isProcessing }) => {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      phone: "",
      address: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      phone: Yup.string().required("Phone number is required"),
      address: Yup.string().required("Full address is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="fullName"
            name="fullName"
            label="Full Name"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Mobile Number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            id="address"
            name="address"
            label="Full Address"
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          disabled={isProcessing}
        >
          {isProcessing ? <CircularProgress size={24} /> : "Place Order"}
        </Button>
      </Box>
    </form>
  );
};

export default CheckoutForm;

// // apps/client/src/components/checkout/CheckoutForm.jsx

// "use client";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { TextField, Button, Grid, Box, CircularProgress } from "@mui/material";

// const CheckoutForm = ({ onSubmit, isProcessing }) => {
//   const formik = useFormik({
//     initialValues: {
//       fullName: "",
//       email: "",
//       phone: "",
//       address: "",
//       city: "",
//       postalCode: "",
//       country: "Bangladesh",
//     },
//     validationSchema: Yup.object({
//       fullName: Yup.string().required("Full name is required"),
//       email: Yup.string()
//         .email("Invalid email address")
//         .required("Email is required"),
//       phone: Yup.string().required("Phone number is required"),
//       address: Yup.string().required("Street address is required"),
//       city: Yup.string().required("City is required"),
//       postalCode: Yup.string().required("Postal code is required"),
//       country: Yup.string().required("Country is required"),
//     }),
//     onSubmit: (values) => {
//       onSubmit(values);
//     },
//   });

//   return (
//     <form onSubmit={formik.handleSubmit}>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             id="fullName"
//             name="fullName"
//             label="Full Name"
//             value={formik.values.fullName}
//             onChange={formik.handleChange}
//             error={formik.touched.fullName && Boolean(formik.errors.fullName)}
//             helperText={formik.touched.fullName && formik.errors.fullName}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             id="email"
//             name="email"
//             label="Email Address"
//             value={formik.values.email}
//             onChange={formik.handleChange}
//             error={formik.touched.email && Boolean(formik.errors.email)}
//             helperText={formik.touched.email && formik.errors.email}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             id="phone"
//             name="phone"
//             label="Phone Number"
//             value={formik.values.phone}
//             onChange={formik.handleChange}
//             error={formik.touched.phone && Boolean(formik.errors.phone)}
//             helperText={formik.touched.phone && formik.errors.phone}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             id="address"
//             name="address"
//             label="Street Address"
//             value={formik.values.address}
//             onChange={formik.handleChange}
//             error={formik.touched.address && Boolean(formik.errors.address)}
//             helperText={formik.touched.address && formik.errors.address}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             id="city"
//             name="city"
//             label="City"
//             value={formik.values.city}
//             onChange={formik.handleChange}
//             error={formik.touched.city && Boolean(formik.errors.city)}
//             helperText={formik.touched.city && formik.errors.city}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             fullWidth
//             id="postalCode"
//             name="postalCode"
//             label="Postal Code"
//             value={formik.values.postalCode}
//             onChange={formik.handleChange}
//             error={
//               formik.touched.postalCode && Boolean(formik.errors.postalCode)
//             }
//             helperText={formik.touched.postalCode && formik.errors.postalCode}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             id="country"
//             name="country"
//             label="Country"
//             value={formik.values.country}
//             onChange={formik.handleChange}
//             error={formik.touched.country && Boolean(formik.errors.country)}
//             helperText={formik.touched.country && formik.errors.country}
//           />
//         </Grid>
//       </Grid>
//       <Box sx={{ mt: 3 }}>
//         <Button
//           color="primary"
//           variant="contained"
//           fullWidth
//           type="submit"
//           disabled={isProcessing}
//         >
//           {isProcessing ? <CircularProgress size={24} /> : "Place Order"}
//         </Button>
//       </Box>
//     </form>
//   );
// };

// export default CheckoutForm;
