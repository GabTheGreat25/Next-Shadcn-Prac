"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/state/authStore";

export default function Navbar() {
  const { user } = useAuthStore();

  const router = useRouter();

  const handleHome = () => {
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleCustomerRegister = () => {
    router.push("/register/customer");
  };

  const handleMerchantRegister = () => {
    router.push("/register/merchant");
  };

  const handleTest = () => {
    router.push("/test");
  };

  const handleTestChild = () => {
    router.push("/testChild");
  };

  const handleLogout = async () => {
    await useAuthStore.getState().logoutUser();
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 text-white py-4 px-12 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold cursor-pointer" onClick={handleHome}>
        Quick Shopping
      </div>
      <div className="space-x-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-gray-600 hover:bg-gray-700">Tables</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white text-black mt-2 rounded shadow-lg">
            <DropdownMenuItem
              onClick={handleTest}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              Test
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleTestChild}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              Test Child
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-gray-600 hover:bg-gray-700">Register</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white text-black mt-2 rounded shadow-lg">
            <DropdownMenuItem
              onClick={handleCustomerRegister}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              Customer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleMerchantRegister}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              Merchant
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {!user ? (
          <>
            <Button
              onClick={handleLogin}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Login
            </Button>
          </>
        ) : (
          <Button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}
