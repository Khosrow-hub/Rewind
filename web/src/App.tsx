import { useEffect, useState } from "react";
import { RouterProvider, useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./features/auth/AuthContext";
import { ToastProvider } from "./features/toast/ToastContext";
import { CustomCursor } from "./components/layout/CustomCursor"; // NEW
import { router } from "./router";

// Inner component so we can use useLocation() to check the route
function AppContent() {
  // Note: If you aren't using useLocation elsewhere, you might need to 
  // pass the location down, but for now we will just enable it globally 
  // and let the CSS handle it based on the route.
  
  // To keep it simple, we will apply the cursor to the whole app but hide it on mobile
  useEffect(() => {
    // Add the class to the body so we can toggle it
    document.body.classList.add("hide-default-cursor");
    return () => document.body.classList.remove("hide-default-cursor");
  }, []);

  return (
    <>
      <CustomCursor />
      <RouterProvider router={router} />
    </>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const handleToggle = () => setIsDark((prev) => !prev);
    window.addEventListener("toggle-theme", handleToggle);
    return () => window.removeEventListener("toggle-theme", handleToggle);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}