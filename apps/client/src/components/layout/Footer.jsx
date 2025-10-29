// File: apps/client/src/components/layout/Footer.jsx
// "use client";
import Link from "next/link";
import { Box, Typography, List, ListItem, Divider } from "@mui/material";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter as TikTok,
} from "@mui/icons-material"; // TikTok as Twitter icon placeholder
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-6 gap-8">
        {/* Brand */}
        <Box className="col-span-2">
          <Typography variant="h3" className="font-bold mb-4">
            BlashBerry
          </Typography>
          <Typography className="text-gray-600 mb-4">
            BlashBerry is not just another clothing brand, but an innovative
            brand inspired by the future of fashion and charmed by traditional
            colors, art and textures.
          </Typography>
          <Typography className="text-gray-600">+880 1566002434</Typography>
          <Typography className="text-gray-600">info@blashberry.com</Typography>
        </Box>
        {/* Store Locations */}
        <Box>
          <Typography variant="h6" className="font-semibold mb-4">
            Our Stores
          </Typography>
          {/* <List className="text-gray-600 space-y-1">
            <ListItem disablePadding>
              BlashBerryli Trade Center, Plot-6
            </ListItem>
            <ListItem disablePadding>Dhanmondi Flagship</ListItem>
            <ListItem disablePadding>
              Gawasia Twin Peak (1st Floor), 75 Satmasjid Road, Dhanmondi, Dhaka
            </ListItem>
            <ListItem disablePadding>Uttara</ListItem>
            <ListItem disablePadding>
              House-26 (Ground Floor), Rabindra Sarani, Sector-07, Uttara
            </ListItem>
            <ListItem disablePadding>Wari</ListItem>
            <ListItem disablePadding>
              9, Gopibagh Lane, Nawab Street, Wari
            </ListItem>
            <ListItem disablePadding>Mohamadpur</ListItem>
            <ListItem disablePadding>
              45, Probal Tower, Ring Road, Mohammadpur
            </ListItem>
            <ListItem disablePadding>Mymensingh</ListItem>
            <ListItem disablePadding>
              Holding-22, Kalishankar Guha Road, Notun Bazar, Mymensingh Sadar
            </ListItem>
            <ListItem disablePadding>Sylet Flagship</ListItem>
            <ListItem disablePadding>47/A, Kumarpura</ListItem>
          </List> */}
        </Box>
        {/* Customer Care */}
        <Box>
          <Typography variant="h6" className="font-semibold mb-4">
            Customer Care
          </Typography>
          <List className="text-gray-600 space-y-1">
            <ListItem disablePadding>
              <Link href="/contact-us">Contact Us</Link>
            </ListItem>
            <ListItem disablePadding>
              <Link href="/faqs">FAQs</Link>
            </ListItem>
            <ListItem disablePadding>
              <Link href="/store-locations">Store Locations</Link>
            </ListItem>
            <ListItem disablePadding>
              <Link href="/exchange-return-policy">
                Exchange & Return Policy
              </Link>
            </ListItem>
          </List>
        </Box>
        {/* Information */}
        <Box>
          <Typography variant="h6" className="font-semibold mb-4">
            Information
          </Typography>
          <List className="text-gray-600 space-y-1">
            <ListItem disablePadding>
              <Link href="/about-us">About Us</Link>
            </ListItem>
            <ListItem disablePadding>
              <Link href="/delivery-partner">Delivery Partner</Link>
            </ListItem>
            <ListItem disablePadding>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </ListItem>
            <ListItem disablePadding>
              <Link href="/terms-conditions">Terms & Conditions</Link>
            </ListItem>
          </List>
        </Box>
        {/* Account & Follow Us */}
        <Box>
          <Typography variant="h6" className="font-semibold mb-4">
            Account
          </Typography>
          <List className="text-gray-600 space-y-1 mb-6">
            <ListItem disablePadding>
              <Link href="/my-account">My Account</Link>
            </ListItem>
            <ListItem disablePadding>
              <Link href="/my-orders">My Orders</Link>
            </ListItem>
            <ListItem disablePadding>
              <Link href="/wishlist">Wishlist</Link>
            </ListItem>
          </List>
          <Typography variant="h6" className="font-semibold mb-4">
            Follow Us
          </Typography>
          <Box className="flex space-x-4">
            <Link href="#">
              <Facebook />
            </Link>
            <Link href="#">
              <Instagram />
            </Link>
            <Link href="#">
              <Youtube />
            </Link>
            <Link href="#">
              <Linkedin />
            </Link>
            <Link href="#">
              <TikTok />
            </Link>
          </Box>
        </Box>
      </div>
      <Divider className="my-8" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-600">
        <Typography>&copy; BlashBerry. All Rights Reserved.</Typography>
        <Box className="flex space-x-4 mt-4 md:mt-0">
          <Image src="/payments/bkash.png" alt="bKash" width={40} height={25} />
          <Image src="/payments/visa.png" alt="Visa" width={40} height={25} />
          <Image
            src="/payments/mastercard.png"
            alt="Mastercard"
            width={40}
            height={25}
          />
          <Image
            src="/payments/cod.png"
            alt="Cash On Delivery"
            width={40}
            height={25}
          />
        </Box>
      </div>
    </footer>
  );
}
