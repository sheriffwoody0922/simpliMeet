import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import '@mantine/notifications/styles.css';
import { Notifications } from "@mantine/notifications";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider
          defaultColorScheme="light"
          theme={{
            fontFamily: 'Verdana, sans-serif',
            fontFamilyMonospace: 'Monaco, Courier, monospace',
            headings: { fontFamily: 'Greycliff CF, sans-serif' },
          }}
        >
          <Notifications position="top-right" w={400} />
          {children}
        </MantineProvider>
        <ScrollRestoration />
        
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
