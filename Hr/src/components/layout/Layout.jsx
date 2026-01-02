import React from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#EBEFF1] dark:bg-[#0C1014] transition-colors duration-300">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* PAGE CONTENT */}
        <div className="">{children}</div>
      </div>
    </div>
  );
}

export default Layout;


