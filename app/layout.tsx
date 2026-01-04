

import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/convex-client-provider";

import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/providers/modal-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "COLLAB BOARD",
  description: "COLLAB BOARD - Next.js Project by Shivam jha",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Here we are using Supress Hydration Warning in order to not create a waring when SSR and CSR occurs seperately */}
          <ConvexClientProvider>
            <Toaster />
            <ModalProvider />
            {children}
            <SpeedInsights />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Old Deprecated Code Below-----

// import type { Metadata } from "next";
// // import { Inter } from "next/font/google";
// import { DM_Sans } from "next/font/google";
// import "./globals.css";
// import { ConvexClientProvider } from "@/providers/convex-client-provider";

// import { Toaster } from "@/components/ui/sonner";
// import { ModalProvider } from "@/providers/modal-provider";
// import { ThemeProvider } from "@/providers/theme-provider";

// import { SpeedInsights } from "@vercel/speed-insights/next"

// const inter = DM_Sans({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "COLLAB BOARD",
//   description: "COLLAB BOARD - Next.js Project by Shivam jha",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className} suppressHydrationWarning>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="dark"
//           enableSystem
//           disableTransitionOnChange
//         >
//           {/* Here we are using Supress Hydration Warning in order to not create a waring when SSR and CSR occurs seperately */}
//           <ConvexClientProvider>
//             <Toaster />
//             <ModalProvider />
//             {children}
//             <SpeedInsights />
//           </ConvexClientProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }


// Guide me for fix 1
