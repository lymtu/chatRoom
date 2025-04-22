import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";

import "./app.css";

import ThemeProvider, {
  type ThemeContextType,
} from "~/lib/context/themeContext";
import Msg from "~/components/msg";

import { wss } from "~/.server/wss";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader(): Promise<{ theme: ThemeContextType["theme"] }> {
  wss.on("error", (e) => {});

  return { theme: "light" };
}

export async function clientLoader() {
  const result: { theme: ThemeContextType["theme"] } = { theme: "light" };

  const theme = localStorage.getItem("theme") as
    | ThemeContextType["theme"]
    | null;
  if (theme) {
    document.documentElement.classList.add(theme);
    result.theme = theme;
  }
  return result;
}

// resolve refresh
clientLoader.hydrate = true as const;

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <ThemeProvider localTheme={loaderData.theme}>
      <div className="relative h-screen duration-150 dark:text-white dark:bg-gray-950 bg-gray-50">
        <Outlet />
        <Msg className="absolute top-0 right-0 h-1/2 w-[300px] pointer-events-none" />
      </div>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message;
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status.toString();
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || error.data || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="h-screen pt-16 p-4 container mx-auto dark:text-white dark:bg-gray-950 bg-gray-50">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
