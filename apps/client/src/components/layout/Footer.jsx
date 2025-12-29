// File: apps/client/src/components/layout/Footer.jsx
// File: apps/client/src/components/layout/Footer.jsx

"use client";
import Link from "next/link";
import { Container, Grid, Typography, IconButton, Box } from "@mui/material";
import {
  Facebook,
  Instagram,
  Phone,
  Email,
  LocationOn,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="bg-[#820449] text-white py-12">
      {/* Updated to deep purple background */}
      <Container maxWidth="lg">
        <Box className="mb-8">
          <img
            className="max-w-[35%] pb-2"
            src={"/blashberry_logo.png"}
            alt="BlashBerry Logo"
          />
          <Typography className="text-gray-300 leading-relaxed max-w-4xl mx-auto">
            At Blashberry, we redefine confidence through comfort and style. We
            specialize in importing premium, trendy, and fashionable lingerie
            directly from China and Thailand. Our mission is to provide every
            woman with the perfect blend of high-quality fabrics and modern
            designs, ensuring maximum comfort without compromising on elegance.
          </Typography>
        </Box>

        <Grid container spacing={8} justifyContent="center">
          {/* Column 1: CONTACT */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              className="font-bold mb-6 text-center md:text-left"
            >
              CONTACT
            </Typography>
            <Box className="space-y-4">
              <Box className="flex items-start justify-center md:justify-start space-x-3">
                <LocationOn className="text-white mt-1 shrink-0" />
                <Typography className="text-gray-300 text-center md:text-left">
                  Rooftop, House no: 20, Road no: 09,
                  <br />
                  Sector no: 04, Uttara, Dhaka-1230.
                </Typography>
              </Box>
              <Box className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="text-white shrink-0" />
                <Typography className="text-gray-300">
                  +8801345304161
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Column 2: SHOPPING INFO */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="font-bold mb-6 text-center">
              SHOPPING INFO
            </Typography>
            <Box className="space-y-4 text-center">
              <Link href="/exchange-return-policy">
                <Typography className="text-gray-300 hover:underline">
                  Our Delivery & Return Policy
                </Typography>
              </Link>
              {/* <Link href="/my-account">
                <Typography className="text-gray-300 hover:underline">
                  My Account
                </Typography>
              </Link> */}
              <Link href="/orders/tracking">
                <Typography className="text-gray-300 hover:underline">
                  My Orders
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* Column 3: FOLLOW US */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              className="font-bold mb-6 text-center md:text-right"
            >
              FOLLOW US
            </Typography>
            <Box className="flex space-x-4 justify-center md:justify-end">
              <IconButton
                component="a"
                href="https://www.facebook.com/share/1C2qvvtAvJ/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                <Facebook fontSize="large" />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.instagram.com/blash.berry?igsh=bWpzNm42cWJxcm05"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                <Instagram fontSize="large" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Box className="border-t border-white/30 mt-12 pt-8 text-center">
          <Typography className="text-gray-400 text-sm">
            © BLASHBERRY. All rights Reserved.
          </Typography>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;
