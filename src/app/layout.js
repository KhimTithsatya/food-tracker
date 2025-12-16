import "./globals.css";
import { FoodProvider } from "@/context/FoodContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <FoodProvider>{children}</FoodProvider>
      </body>
    </html>
  );
}
