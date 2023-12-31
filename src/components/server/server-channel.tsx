'use client'

import { ModalType, useModal } from '@/hooks/use-modal-store'
import { cn } from '@/lib/utils'
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { MouseEvent, useCallback, useMemo } from 'react'
import { ActionTooltip } from '../ActionTooltip'

interface ServerChannelProps {
	channel: Channel
	server: Server
	role?: MemberRole
}

const iconMap = {
	[ChannelType.TEXT]: Hash,
	[ChannelType.AUDIO]: Mic,
	[ChannelType.VIDEO]: Video,
}

export const ServerChannel = ({
	channel,
	server,
	role,
}: ServerChannelProps) => {
	const { onOpen } = useModal()

	const params = useParams()
	const router = useRouter()

	const Icon = useMemo(() => iconMap[channel.type], [channel.type])

	const onClick = useCallback(
		() => router.push(`/servers/${params?.serverId}/channels/${channel.id}`),
		[channel.id, params?.serverId, router],
	)

	const onAction = useCallback(
		(e: MouseEvent, action: ModalType) => {
			e.stopPropagation()
			onOpen(action, { channel, server })
		},
		[channel, onOpen, server],
	)

	return (
		<button
			onClick={onClick}
			className={cn(
				'group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
				params?.channelId === channel.id &&
					'bg-zinc-700/20 dark:bg-zinc-700',
			)}
		>
			<Icon className="h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
			<p
				className={cn(
					'line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
					params?.channelId === channel.id &&
						'text-primary dark:text-zinc-200 dark:group-hover:text-white',
				)}
			>
				{channel.name}
			</p>
			{channel.name !== 'geral' && role !== MemberRole.GUEST && (
				<div className="ml-auto flex items-center gap-x-2">
					<ActionTooltip label="Editar">
						<Edit
							aria-label="edit channel"
							onClick={(e) => onAction(e, 'editChannel')}
							className="hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
						/>
					</ActionTooltip>
					<ActionTooltip label="Excluir">
						<Trash
							aria-label="delete channel"
							onClick={(e) => onAction(e, 'deleteChannel')}
							className="hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
						/>
					</ActionTooltip>
				</div>
			)}
			{channel.name === 'geral' && (
				<Lock className="ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400" />
			)}
		</button>
	)
}
