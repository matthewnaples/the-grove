'use client';

import { AsyncButton } from "@/components/ui/async-button";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState<string>("");

  const simulateAsyncOperation = async () => {
    setMessage("Processing...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setMessage("Success! Operation completed.");
  };

  const simulateError = async () => {
    setMessage("Processing...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setMessage("Error: Operation failed!");
    throw new Error("Simulated error");
  };

  const quickOperation = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setMessage("Quick operation done!");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="space-y-8 text-center max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">The Grove Test App</h1>
          <p className="text-muted-foreground">
            This is a test Next.js app for testing component installation.
          </p>
          <p className="text-sm text-muted-foreground">
            Use <code className="bg-muted px-2 py-1 rounded">the-grove add &lt;component&gt;</code> to install components.
          </p>
        </div>

        <div className="border-t pt-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">AsyncButton Demo</h2>
            <p className="text-sm text-muted-foreground">
              Click the buttons below to see the async loading states
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <AsyncButton onClick={simulateAsyncOperation}>
                Simulate Async (2s)
              </AsyncButton>

              <AsyncButton onClick={quickOperation} variant="outline">
                Quick Operation (0.5s)
              </AsyncButton>

              <AsyncButton onClick={simulateError} variant="destructive">
                Simulate Error
              </AsyncButton>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <AsyncButton onClick={quickOperation} variant="secondary">
                Secondary Variant
              </AsyncButton>

              <AsyncButton onClick={quickOperation} variant="ghost">
                Ghost Variant
              </AsyncButton>

              <AsyncButton onClick={quickOperation} variant="link">
                Link Variant
              </AsyncButton>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <AsyncButton onClick={quickOperation} size="sm">
                Small Size
              </AsyncButton>

              <AsyncButton onClick={quickOperation} size="default">
                Default Size
              </AsyncButton>

              <AsyncButton onClick={quickOperation} size="lg">
                Large Size
              </AsyncButton>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes("Error")
                  ? "bg-destructive/10 text-destructive"
                  : message.includes("Success")
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-muted"
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
