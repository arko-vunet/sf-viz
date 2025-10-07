import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import "apexcharts/dist/apexcharts.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "SF-Viz",
  description: "Smart-Frames Vizualisations: UI Logics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
