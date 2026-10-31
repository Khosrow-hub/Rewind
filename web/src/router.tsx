import { createBrowserRouter, Navigate } from "react-router-dom";
import { Shell } from "./components/layout/Shell";
import { RequireAuth } from "./components/layout/RequireAuth";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Decisions } from "./pages/Decisions";
import { DecisionNew } from "./pages/DecisionNew";
import { DecisionDetail } from "./pages/DecisionDetail";
import { DecisionReview } from "./pages/DecisionReview";
import { Patterns } from "./pages/Patterns";
import { Library } from "./pages/Library";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  { path: "/auth", element: <Auth /> },
  {
    path: "/",
    element: (
      <RequireAuth>
        <Shell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "decisions", element: <Decisions /> },
      { path: "decisions/new", element: <DecisionNew /> },
      { path: "decisions/:id", element: <DecisionDetail /> },
      { path: "decisions/:id/review", element: <DecisionReview /> },
      { path: "patterns", element: <Patterns /> },
      { path: "library", element: <Library /> },
      { path: "settings", element: <Settings /> },
      { path: "*", element: <Navigate to="/" replace /> }
    ]
  }
]);