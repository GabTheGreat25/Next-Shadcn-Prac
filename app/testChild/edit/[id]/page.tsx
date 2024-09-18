"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTestStore } from "@/state/testStore";
import { useTestChildStore } from "@/state/testChildStore";
import { useRouter, useParams } from "next/navigation";

const formSchema = z.object({
  testChild: z.string().min(2, {
    message: "Test child name must be at least 2 characters.",
  }),
  image: z.array(z.instanceof(File)).optional(),
  testId: z.number().min(1, {
    message: "Please select a test.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditTestChild() {
  const {
    singleTestChild,
    fetchSingleTestChild,
    updateTestChild,
    loading,
    error,
  } = useTestChildStore();
  const { fetchTests, tests } = useTestStore();
  const router = useRouter();
  const { id } = useParams();

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testChild: "",
      image: [],
      testId: 0,
    },
    mode: "onBlur",
  });

  const { handleSubmit, control, formState, reset, setValue } = methods;

  useEffect(() => {
    if (id) {
      fetchSingleTestChild(Number(id));
      fetchTests(); // Fetch tests when component mounts
    }
  }, [id, fetchSingleTestChild, fetchTests]);

  useEffect(() => {
    if (singleTestChild) {
      setExistingImages(singleTestChild.image.map((img) => img.url));
      setSelectedTestId(singleTestChild.testId);
      reset({
        testChild: singleTestChild.testChild || "",
        image: [],
        testId: singleTestChild.testId || 0,
      });
    }
  }, [singleTestChild, reset]);

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("testChild", values.testChild);
    values.image?.forEach((file) => {
      formData.append("image", file);
    });
    formData.append("testId", values.testId.toString());

    try {
      if (id) {
        await updateTestChild(Number(id), formData);
        router.push("/testChild");
      }
    } catch (error) {
      console.error("Error updating test child:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen place-content-center">
      <h1 className="text-2xl font-bold mb-6">Edit Test Child</h1>
      <FormProvider {...methods}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="testChild"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="testChild">Test Child Name:</Label>
                <FormControl>
                  <Input
                    id="testChild"
                    type="text"
                    placeholder="Test Child Name"
                    {...field}
                    className="mt-1"
                  />
                </FormControl>
                <FormDescription>
                  Enter the name of the test child.
                </FormDescription>
                <FormMessage>{formState.errors.testChild?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="image"
            render={({ field: { onChange, onBlur } }) => (
              <FormItem>
                <Label htmlFor="image">Picture:</Label>
                <FormControl>
                  <Input
                    id="image"
                    type="file"
                    multiple
                    onChange={(event) => {
                      if (event.currentTarget.files) {
                        onChange(Array.from(event.currentTarget.files));
                      }
                    }}
                    onBlur={onBlur}
                    className="mt-1 cursor-pointer"
                  />
                </FormControl>
                <FormDescription>
                  Upload new images related to the test child. Existing images
                  will be kept unless removed.
                </FormDescription>
                <FormMessage>{formState.errors.image?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormItem>
            <Label htmlFor="testId">Select Test:</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full mt-1">
                  {selectedTestId
                    ? tests.find((test) => test.id === selectedTestId)?.test
                    : "Select a test"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {tests.map((test) => (
                  <DropdownMenuItem
                    key={test.id}
                    onClick={() => {
                      setSelectedTestId(test.id);
                      setValue("testId", test.id);
                    }}
                  >
                    {test.test}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <FormDescription>
              Choose the test to associate with this child.
            </FormDescription>
            <FormMessage>{formState.errors.testId?.message}</FormMessage>
          </FormItem>

          <h2 className="text-lg font-semibold">Your Image</h2>
          <div className="mt-4 flex flex-col items-center justify-center">
            <div className="w-1/2 mt-2">
              {existingImages.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="Test Child Image"
                  className="w-full h-auto object-cover rounded-md"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="destructive"
              className="w-full mt-4"
            >
              Go Back
            </Button>
            <Button type="submit" className="w-full mt-4">
              Update Test Child
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
