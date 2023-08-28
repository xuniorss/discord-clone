import { ServerSidebar } from '@/components/server/server-sidebar'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function ServerIdLayout({
	children,
	params,
}: {
	children: ReactNode
	params: { serverId: string }
}) {
	const profile = await currentProfile()

	if (!profile) return redirectToSignIn()

	const server = await db.server.findUnique({
		where: {
			id: params.serverId,
			members: { some: { profileId: profile.id } },
		},
	})

	if (!server) return redirect('/')

	return (
		<section>
			<aside className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
				<ServerSidebar serverId={params.serverId} />
			</aside>
			<main className="h-full md:pl-60">{children}</main>
		</section>
	)
}
