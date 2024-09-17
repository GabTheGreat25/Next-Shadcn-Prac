"use client";

import React, { useEffect } from "react";
import { useTestStore } from "@/state/testStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestDetail() {
  const { singleTest, loading, fetchSingleTest } = useTestStore();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      fetchSingleTest(Number(params.id));
    }
  }, [params.id, fetchSingleTest]);

  if (loading) return <div className="text-center py-6">Loading...</div>;

  const images = singleTest?.image || [];

  return (
    <div className="p-12">
      <div className="flex justify-between items-center mb-6">
        <CardTitle className="text-3xl">{singleTest?.test}</CardTitle>
        <Link href={`/test/edit/${singleTest?.id}`}>
          <Button variant="secondary">Edit Test</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 place-content-center">
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
