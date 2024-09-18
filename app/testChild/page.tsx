"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTestChildStore } from "@/state/testChildStore";

export default function TestChildListPage() {
  const { testChildren, loading, fetchTestChildren, deleteTestChild } =
    useTestChildStore();

  useEffect(() => {
    fetchTestChildren();
  }, [fetchTestChildren]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this test child?")) {
      deleteTestChild(id);
    }
  };

  if (loading) return <div className="text-center py-6">Loading...</div>;

  return (
    <div className="p-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Test Child List</h1>
        <Link href="/testChild/create">
          <Button size="lg">Create New Test Child</Button>
        </Link>
      </div>

      {testChildren.length > 0 ? (
        <Table className="w-full table-auto bg-white shadow-md rounded-lg text-base">
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="p-4 text-left">Test Child Name</TableHead>
              <TableHead className="p-4 text-left">Images</TableHead>
              <TableHead className="p-4 text-left">Test</TableHead>
              <TableHead className="p-4 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testChildren.map((child) => (
              <TableRow key={child.id} className="hover:bg-gray-100">
                <TableCell className="p-4">
                  <Link href={`/testChild/${child.id}`}>
                    <h2 className="text-lg font-medium">{child.testChild}</h2>
                  </Link>
                </TableCell>
                <TableCell className="p-4">
                  <div className="flex space-x-3">
                    {child.image?.map(
                      (
                        img: { url: string; originalname: string },
                        index: number,
                      ) => (
                        <img
                          key={index}
                          src={img.url}
                          alt={img.originalname}
                          className="w-32 object-cover rounded-md"
                        />
                      ),
                    )}
                  </div>
                </TableCell>
                <TableCell className="p-4">{child.test?.test}</TableCell>
                <TableCell className="p-4">
                  <div className="flex space-x-4">
                    <Link href={`/testChild/edit/${child.id}`}>
                      <Button variant="default">Edit</Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(child.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-6">No test children available.</div>
      )}
    </div>
  );
}
