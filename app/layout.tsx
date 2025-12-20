import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { AuthProvider } from '@/components/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: {
		default: 'AURALEEN',
		template: '%s | AURALEEN'
	},
	description: 'Minimal, premium white clothing store for Pakistan (COD).',
	icons: {
		icon: [{ url: '/icon.svg', type: 'image/svg+xml' }]
	}
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} page-shell bg-background text-foreground`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<AuthProvider>
						<SiteHeader />
						<main className="flex-1">{children}</main>
						<SiteFooter />
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

