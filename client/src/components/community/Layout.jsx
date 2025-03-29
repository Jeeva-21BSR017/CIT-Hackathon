import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, MessageSquare, User } from "lucide-react";
import Navbar from "../layout/Navbar";

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow mt-20 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around py-3">
          <Link
            to="/community"
            className={`flex flex-col items-center ${location.pathname === "/community" ? "text-blue-600" : "text-gray-600"
              }`}
          >
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Community</span>
          </Link>
          <Link
            to="/messages"
            className={`flex flex-col items-center ${location.pathname === "/messages" ? "text-blue-600" : "text-gray-600"
              }`}
          >
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs mt-1">Messages</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center ${location.pathname === "/profile" ? "text-blue-600" : "text-gray-600"
              }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Layout;