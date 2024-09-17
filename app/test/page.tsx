"use client";

import React, { useEffect } from "react";
import { useTestStore } from "@/state/testStore";
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

export default function TestListPage() {
  const { tests, loading, fetchTests, deleteTest } = useTestStore();

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this test?")) {
      deleteTest(id);
    }
  };

  if (loading) return <div className="text-center py-6">Loading...</div>;

  return (
    <div className="p-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Test List</h1>
        <Link href="/test/create">
          <Button size="lg">Create New Test</Button>
        </Link>
      </div>

      {tests.length > 0 ? (
        <Table className="w-full table-auto bg-white shadow-md rounded-lg text-base">
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="p-4 text-left">Test Name</TableHead>
              <TableHead className="p-4 text-left">Images</TableHead>
              <TableHead className="p-4 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => {
              return (
                <TableRow key={test.id} className="hover:bg-gray-100">
                  <TableCell className="p-4">
                    <Link href={`/test/${test.id}`}>
                      <h2 className="text-lg font-medium">{test.test}</h2>
                    </Link>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex space-x-3">
                      {test.image?.map(
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
                  <TableCell className="p-4">
                    <div className="flex space-x-4">
                      <Link href={`/test/edit/${test.id}`}>
                        <Button variant="default">Edit</Button>
                      </Link>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(test.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-6">No tests available.</div>
      )}
    </div>
  );
}
