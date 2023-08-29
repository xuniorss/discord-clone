'use client'

import { useModal } from '@/hooks/use-modal-store'
import { ServerWithMembersWithProfiles } from '@/types'
import { ChannelType, MemberRole } from '@prisma/client'
import { Plus, Settings } from 'lucide-react'
import { ActionTooltip } from '../ActionTooltip'

interface ServerSectionProps {
	label: string
	role?: MemberRole
	sectionType: 'channels' | 'members'
	channelType?: ChannelType
	server?: ServerWithMembersWithProfiles
}

export const ServerSection = ({
	label,
	role,
	sectionType,
	channelType,
	server,
}: ServerSectionProps) => {
	const { onOpen } = useModal()

	return (
		<section className="flex items-center justify-between py-2">
			<p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
				{label}
			</p>
			{role !== MemberRole.GUEST && sectionType === 'channels' && (
				<ActionTooltip label="Criar canal" side="top">
					<button
						onClick={() => onOpen('createChannel', { channelType })}
						aria-label="button create a new channel"
						className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
					>
						<Plus className="h-4 w-4" />
					</button>
				</ActionTooltip>
			)}
			{role === MemberRole.ADMIN && sectionType === 'members' && (
				<ActionTooltip label="Gerenciar membros" side="top">
					<button
						onClick={() => onOpen('members', { server })}
						aria-label="button create a new channel"
						className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
					>
						<Settings className="h-4 w-4" />
					</button>
				</ActionTooltip>
			)}
		</section>
	)
}
