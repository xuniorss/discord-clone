'use client'

import { useChatQuery } from '@/hooks/use-chat-query'
import { Member, Message, Profile } from '@prisma/client'
import { Loader2, ServerCrash } from 'lucide-react'
import { Fragment } from 'react'
import { ChatWelcome } from './chat-welcome'

type MessageWithMemberWithProfile = Message & {
	member: Member & { profile: Profile }
}

interface ChatMessagesProps {
	name: string
	member: Member
	chatId: string
	apiUrl: string
	socketUrl: string
	socketQuery: Record<string, string>
	paramKey: 'channelId' | 'conversationId'
	paramValue: string
	type: 'channel' | 'conversation'
}

export const ChatMessages = ({
	name,
	member,
	chatId,
	apiUrl,
	socketUrl,
	socketQuery,
	paramKey,
	paramValue,
	type,
}: ChatMessagesProps) => {
	const queryKey = `chat:${chatId}`

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useChatQuery({ queryKey, apiUrl, paramKey, paramValue })

	if (status === 'loading') {
		return (
			<div className="flex flex-1 flex-col items-center justify-center">
				<Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					Carregando mensagens...
				</p>
			</div>
		)
	}

	if (status === 'error') {
		return (
			<div className="flex flex-1 flex-col items-center justify-center">
				<ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					Algo deu errado!
				</p>
			</div>
		)
	}

	return (
		<section className="flex flex-1 flex-col overflow-y-auto py-4">
			<div className="flex-1" />
			<ChatWelcome type={type} name={name} />
			<article className="mt-auto flex flex-col-reverse">
				{data?.pages?.map((group, idx) => (
					<Fragment key={idx}>
						{group.items.map((message: MessageWithMemberWithProfile) => (
							<div key={message.id}>{message.content}</div>
						))}
					</Fragment>
				))}
			</article>
		</section>
	)
}
