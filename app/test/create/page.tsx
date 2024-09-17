"use client";

import React from "react";
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
import { useRouter } from "next/navigation";

const formSchema = z.object({
  test: z.string().min(2, {
    message: "Test name must be at least 2 characters.",
  }),
  image: z.array(z.instanceof(File)).nonempty({
    message: "At least one image is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateTest() {
  const { addTest } = useTestStore();
  const router = useRouter();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      test: "",
      image: [],
    },
    mode: "onBlur",
  });

  const { handleSubmit, control, formState, reset } = methods;

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("test", values.test);
    values.image.forEach((file) => {
      formData.append("image", file);
    });

    try {
      addTest(formData);
      reset();
      router.push("/test");
    } catch (error) {
      console.error("Error adding test:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen place-content-center">
      <h1 className="text-2xl font-bold mb-6">Create New Test</h1>
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
                  Upload images related to the test.
                </FormDescription>
                <FormMessage>{formState.errors.image?.message}</FormMessage>
              </FormItem>
            )}
          />

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
              Create Test
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
