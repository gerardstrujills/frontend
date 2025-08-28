import App from "@/App";
import PokemonPage from "@/pokemon/[id]/page";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <App /> },
      { path: "pokemon/:id", element: <PokemonPage /> },
      { path: "*", element: <div>404 - Page Not Found</div> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
