"use client";

import React from "react";
import RouteHandler from "@/components/routeHandler";

export default function MerchantDashboard() {
  return (
    <RouteHandler isProtected={true}>
      <div>
        <h1>Merchant Dashboard</h1>
      </div>
    </RouteHandler>
  );
}
