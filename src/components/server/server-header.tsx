'use client'

import { useModal } from '@/hooks/use-modal-store'
import { ServerWithMembersWithProfiles } from '@/types'
import { MemberRole } from '@prisma/client'
import {
	ChevronDown,
	LogOut,
	PlusCircle,
	Settings,
	Trash,
	UserPlus,
	Users,
} from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface ServerHeaderProps {
	server: ServerWithMembersWithProfiles
	role?: MemberRole
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
	const { onOpen } = useModal()

	const isAdmin = role === MemberRole.ADMIN
	const isModerator = isAdmin || role === MemberRole.MODERATOR

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:outline-none" asChild>
				<button className="text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
					{server.name}
					<ChevronDown className="ml-auto h-5 w-5" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 space-y-[0.125rem] text-xs font-medium text-black dark:text-neutral-400">
				{isModerator && (
					<DropdownMenuItem
						onClick={() => onOpen('invite', { server })}
						className="cursor-pointer px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400"
					>
						Convidar pessoas
						<UserPlus className="ml-auto h-4 w-4" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem
						onClick={() => onOpen('editServer', { server })}
						className="cursor-pointer px-3 py-2 text-sm"
					>
						Config. do servidor
						<Settings className="ml-auto h-4 w-4" />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem
						onClick={() => onOpen('members', { server })}
						className="cursor-pointer px-3 py-2 text-sm"
					>
						Gerenciar membros
						<Users className="ml-auto h-4 w-4" />
					</DropdownMenuItem>
				)}
				{isModerator && (
					<DropdownMenuItem
						onClick={() => onOpen('createChannel')}
						className="cursor-pointer px-3 py-2 text-sm"
					>
						Criar canal
						<PlusCircle className="ml-auto h-4 w-4" />
					</DropdownMenuItem>
				)}
				{isModerator && <DropdownMenuSeparator />}
				{isAdmin && (
					<DropdownMenuItem
						onClick={() => onOpen('deleteServer', { server })}
						className="cursor-pointer px-3 py-2 text-sm text-rose-500"
					>
						Excluir servidor
						<Trash className="ml-auto h-4 w-4" />
					</DropdownMenuItem>
				)}
				{!isAdmin && (
					<DropdownMenuItem
						onClick={() => onOpen('leaveServer', { server })}
						className="cursor-pointer px-3 py-2 text-sm text-rose-500"
					>
						Sair do servidor
						<LogOut className="ml-auto h-4 w-4" />
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
