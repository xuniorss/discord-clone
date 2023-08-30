'use client'

import { useChatQuery } from '@/hooks/use-chat-query'
import { useChatSocket } from '@/hooks/use-chat-socket'
import { Member, Message, Profile } from '@prisma/client'
import { format } from 'date-fns'
import { Loader2, ServerCrash } from 'lucide-react'
import { Fragment } from 'react'
import { ChatItem } from './chat-item'
import { ChatWelcome } from './chat-welcome'

const DATE_FORMAT = 'dd/MM/yyyy HH:mm'

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
	const addKey = `chat:${chatId}:messages`
	const updateKey = `chat:${chatId}:messages:update`

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useChatQuery({ queryKey, apiUrl, paramKey, paramValue })

	useChatSocket({ queryKey, addKey, updateKey })

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
							<ChatItem
								key={message.id}
								id={message.id}
								currentMember={member}
								member={message.member}
								content={message.content}
								fileUrl={message.fileUrl}
								deleted={message.deleted}
								timestamp={format(
									new Date(message.createdAt),
									DATE_FORMAT,
								)}
								isUpdated={message.updatedAt !== message.createdAt}
								socketUrl={socketUrl}
								socketQuery={socketQuery}
							/>
						))}
					</Fragment>
				))}
			</article>
		</section>
	)
}