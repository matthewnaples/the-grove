'use client';

import { AsyncButton } from "@/registry/the-grove/async-button/async-button";
import { LoadingSpinner } from "@/registry/the-grove/loading-spinner/loading-spinner";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">The Grove Registry</h1>
        <p className="text-muted-foreground">
          A component registry for Next.js applications with Convex and Clerk integration.
        </p>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[200px]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground">Async Button</h2>
          </div>
          <div className="flex items-center justify-center min-h-[150px]">
            <AsyncButton onClick={async () => {
              await new Promise(resolve => setTimeout(resolve, 2000));
              console.log('Button clicked!');
            }}>
              Click me (2s delay)
            </AsyncButton>
          </div>
        </div>

        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[200px]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground">Loading Spinner</h2>
          </div>
          <div className="flex items-center justify-center min-h-[150px] gap-4">
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" />
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </main>
    </div>
  );
}
