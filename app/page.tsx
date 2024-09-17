"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import cardData from "./data/card";

export default function Home() {
  return (
    <div>
      <h1 className="flex justify-center p-8 text-[60px]">Next JS Shadcn UI</h1>
      <div className="flex flex-col w-full items-center space-y-4">
        <Button>Click me</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <div className="md:col-span-2 grid grid-cols-1 md:gr-cols-2 lg:grid-cols-3 gap-2 p-2">
          {cardData.map(
            (
              { cardTitle, cardDescription, cardContent, cardFooter },
              index,
            ) => (
              <Card key={index} className="w-70 h-60">
                <CardHeader>
                  <CardTitle>{cardTitle}</CardTitle>
                  <CardDescription>{cardDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{cardContent}</p>
                </CardContent>
                <CardFooter>
                  <p>{cardFooter}</p>
                </CardFooter>
              </Card>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
