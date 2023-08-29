import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

import { UserButton } from '@clerk/nextjs'
import { ModeToggle } from '../mode-toggle'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { NavigationAction } from './navigation-action'
import { NavigationItem } from './navigation-item'

export const NavigationSidebar = async () => {
	const profile = await currentProfile()
	if (!profile) return redirect('/')

	const servers = await db.server.findMany({
		where: { members: { some: { profileId: profile.id } } },
	})

	return (
		<article className="flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 text-primary dark:bg-[#1E1F22]">
			<NavigationAction />
			<Separator className="mx-auto h-[0.125rem] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
			<ScrollArea className="w-full flex-1">
				{servers.map((server) => (
					<div key={server.id} className="mb-4">
						<NavigationItem
							id={server.id}
							name={server.name}
							imageUrl={server.imageUrl}
						/>
					</div>
				))}
			</ScrollArea>
			<section className="mt-auto flex flex-col items-center gap-y-4 pb-3">
				<ModeToggle />
				<UserButton
					afterSignOutUrl="/"
					appearance={{ elements: { avatarBox: 'w-[3rem] h-[3rem]' } }}
				/>
			</section>
		</article>
	)
}
