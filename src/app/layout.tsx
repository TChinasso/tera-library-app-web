import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import dynamic from 'next/dynamic';


const inter = Inter({ subsets: ["latin"] });

const DynamicAntdLayout = dynamic(() => import('../components/defaultLayout'), { ssr: false });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ height: '100%' , overflow: 'auto' }}>
        <AntdRegistry>
          <DynamicAntdLayout>
            {children}
          </DynamicAntdLayout>
        </AntdRegistry>
      </body>
    </html>
  );
}