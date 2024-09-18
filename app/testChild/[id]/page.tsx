"use client";

import React, { useEffect } from "react";
import { useTestChildStore } from "@/state/testChildStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestChildDetail() {
  const { singleTestChild, loading, fetchSingleTestChild } =
    useTestChildStore();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      fetchSingleTestChild(Number(params.id));
    }
  }, [params.id, fetchSingleTestChild]);

  if (loading) return <div className="text-center py-6">Loading...</div>;

  const images = singleTestChild?.image || [];

  return (
    <div className="p-12">
      <div className="flex justify-between items-center mb-6">
        <CardTitle className="text-3xl">{singleTestChild?.testChild}</CardTitle>
        <Link href={`/testChild/edit/${singleTestChild?.id}`}>
          <Button variant="secondary">Edit Test Child</Button>
        </Link>
      </div>

      <div className="flex flex-col flex-wrap gap-4 place-content-center">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Test:</h2>
          <p className="text-lg">{singleTestChild?.test?.test}</p>
        </div>
        {images.map((img, index) => (
          <Card key={index} className="w-96">
            <CardHeader>
              <img
                src={img.url}
                alt={img.originalname}
                className="w-full object-cover rounded-md"
              />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{img.originalname}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
