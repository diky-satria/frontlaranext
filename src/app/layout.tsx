"use client";

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// redux
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import { Provider } from "react-redux";

// next-auth
import NextAuthProvider from "@/component/next_auth/NextAuthProvider";

// toast
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              {children}
              <Toaster />
            </PersistGate>
          </Provider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
