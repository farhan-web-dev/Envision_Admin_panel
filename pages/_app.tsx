import "@/app/globals.css";
import { Toaster } from "sonner";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
          },
        },
      })
  );

  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const publicRoutes = ["/login", "/register", "/forgot-password"];
    const token = localStorage.getItem("token"); // or whatever you store (JWT/session)

    const isPublic = publicRoutes.includes(router.pathname);

    if (!token && !isPublic) {
      router.replace("/login");
    }

    setIsAuthChecked(true);
  }, [router.pathname]);

  // Prevent UI flicker while checking auth
  if (!isAuthChecked) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
