import { NavigationSidebar } from '@/components/navigation/navigation-sidebar'
import { ReactNode } from 'react'

export default async function MainLayout({
	children,
}: {
	children: ReactNode
}) {
	return (
		<section className="h-full">
			<aside className="fixed inset-y-0 z-30 hidden h-full w-[4.5rem] flex-col md:flex">
				<NavigationSidebar />
			</aside>
			<main className="h-full md:pl-[4.5rem]">{children}</main>
		</section>
	)
}
