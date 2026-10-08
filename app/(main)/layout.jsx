import React from "react";
import { Footer } from "@/components/footer";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 w-full">{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;

