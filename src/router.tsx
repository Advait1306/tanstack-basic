import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: "render",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  });

  // Preload all routes manually
  const preloadAllRoutes = async () => {
    try {
      await Promise.all([
        // Static routes
        router.preloadRoute({ to: "/" }),
        router.preloadRoute({ to: "/posts" }),
        router.preloadRoute({ to: "/users" }),
        router.preloadRoute({ to: "/deferred" }),
        router.preloadRoute({ to: "/redirect" }),
        router.preloadRoute({ to: "/route-a" }),
        router.preloadRoute({ to: "/route-b" }),
        // Load route chunks for all available routes
        ...Object.values(router.routesByPath).map(route => 
          router.loadRouteChunk(route)
        ),
      ]);
    } catch (err) {
      console.warn('Some routes failed to preload:', err);
    }
  };

  // Start preloading in the background
  setTimeout(preloadAllRoutes, 100);

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
