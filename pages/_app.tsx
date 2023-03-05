import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";

const lora = Lora({
  subsets: ["latin"],
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --lora-font: ${lora.style.fontFamily};
          }
        `}
      </style>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Analytics />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
