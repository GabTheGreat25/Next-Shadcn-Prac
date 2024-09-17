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
import { useTestStore } from "@/state/testStore";
import { useRouter, useParams } from "next/navigation";

const formSchema = z.object({
  test: z.string().min(2, {
    message: "Test name must be at least 2 characters.",
  }),
  image: z.array(z.instanceof(File)).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditTest() {
  const { singleTest, fetchSingleTest, updateTest, loading, error } =
    useTestStore();
  const router = useRouter();
  const { id } = useParams();

  const [existingImages, setExistingImages] = useState<string[]>([]);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      test: "",
      image: [],
    },
    mode: "onBlur",
  });

  const { handleSubmit, control, formState, reset, setValue } = methods;

  useEffect(() => {
    if (id) {
      fetchSingleTest(Number(id));
    }
  }, [id, fetchSingleTest]);

  useEffect(() => {
    if (singleTest) {
      setExistingImages(singleTest.image.map((img) => img.url));
      reset({
        test: singleTest.test || "",
        image: [],
      });
    }
  }, [singleTest, reset]);

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("test", values.test);
    values.image?.forEach((file) => {
      formData.append("image", file);
    });

    try {
      if (id) {
        await updateTest(Number(id), formData);
        router.push("/test");
      }
    } catch (error) {
      console.error("Error updating test:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen place-content-center">
      <h1 className="text-2xl font-bold mb-6">Edit Test</h1>
      <FormProvider {...methods}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="test"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="test">Test Name:</Label>
                <FormControl>
                  <Input
                    id="test"
                    type="text"
                    placeholder="Test Name"
                    {...field}
                    className="mt-1"
                  />
                </FormControl>
                <FormDescription>Enter the name of the test.</FormDescription>
                <FormMessage>{formState.errors.test?.message}</FormMessage>
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
                  Upload new images related to the test. Existing images will be
                  kept unless removed.
                </FormDescription>
                <FormMessage>{formState.errors.image?.message}</FormMessage>
              </FormItem>
            )}
          />

          <h2 className="text-lg font-semibold">Your Image</h2>
          <div className="mt-4 flex flex-col items-center justify-center">
            <div className=" w-1/2 mt-2">
              {existingImages.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="Test Image"
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
              Update Test
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
