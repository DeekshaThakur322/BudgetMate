import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./assets/common/Layout.jsx";
import Dashboard from "./pages/Dashboard";
import CreateBudget from "./pages/CreateBudget";
import Budget from "./pages/Budget";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import SignOut from "./pages/auth/SignOut";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "../utils/ProtectedRoute";
import BudgetDetails from "./pages/BudgetDetails";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [

        {
          path: "/signin",
          element: <Signin />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/sign-out",
          element: <SignOut />,
        },

        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "/",
              element: <Dashboard />,
            },
            {
              path: "/budget",
              element: <Budget />,
            },
            {
              path: "/createbudget",
              element: <CreateBudget />,
            },
            {
              path: "/budget/:budgetId",
              element: <BudgetDetails />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;