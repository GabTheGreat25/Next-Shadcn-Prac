"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <nav className="bg-gray-800 text-white py-4 px-12 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">WebName</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Account
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white text-black mt-2 rounded shadow-lg ">
          <DropdownMenuItem
            onClick={handleLogin}
            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
          >
            Login
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignup}
            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
          >
            Sign Up
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
