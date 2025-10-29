import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "react-hot-toast";
import ThemeRegistry from "@/components/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BlashBerry",
  description: "Modern E-commerce Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <CartProvider>
            <AuthProvider>
              <Toaster position="bottom-center" />
              {children}
            </AuthProvider>
          </CartProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
