import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface ChannelIdPageProps {
	params: {
		serverId: string
		channelId: string
	}
}

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {
	const profile = await currentProfile()

	if (!profile) return redirectToSignIn()

	const channel = await db.channel.findUnique({
		where: { id: params.channelId },
	})

	const member = await db.member.findFirst({
		where: { serverId: params.serverId, profileId: profile.id },
	})

	if (!channel || !member) redirect('/')

	return (
		<section className="flex h-full flex-col bg-white dark:bg-[#313338]">
			<ChatHeader
				name={channel.name}
				serverId={channel.serverId}
				type="channel"
			/>
			<span className="flex-1">Mensagens Futuras</span>
			<ChatInput
				name={channel.name}
				type="channel"
				apiUrl="/api/socket/messages"
				query={{ channelId: channel.id, serverId: channel.serverId }}
			/>
		</section>
	)
}
