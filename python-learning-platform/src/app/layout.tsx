import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import DataProvider from "@/components/providers/DataProvider";

export const metadata: Metadata = {
  title: "Divergents Leadership School | Informatics",
  description: "Интерактивная платформа для обучения информатике. Задачи, темы, проверка кода.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="bg-gray-950 text-white antialiased font-sans">
        <DataProvider>
          {children}
        </DataProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
