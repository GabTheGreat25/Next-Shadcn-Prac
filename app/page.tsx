"use client";

import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Quick Shopping!</h1>
        <p className="text-xl mb-8">
          Shop the latest products and enjoy exclusive deals.
        </p>
        <img
          src="/cart.png"
          alt="E-Commerce"
          className="object-cover w-fit h-fit mx-auto"
        />
      </div>
    </div>
  );
}
