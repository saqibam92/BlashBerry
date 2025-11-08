// File: apps/client/src/app/(shop)/layout.js

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import WhatsAppWidget from "@/components/common/WhatsAppWidget";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
// import { Breadcrumbs } from "@mui/material";

export default function ShopLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Breadcrumbs />
      <main className="flex-grow">{children}</main>
      <Footer />
      {/* <div className="hidden md:block">
        <Footer />
      </div>
      <WhatsAppWidget />
      <MobileBottomNav /> */}
    </div>
  );
}
