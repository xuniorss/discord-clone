'use client'

import { UserAvatar } from '@/components/UserAvatar'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useModal } from '@/hooks/use-modal-store'
import { ServerWithMembersWithProfiles } from '@/types'
import { MemberRole } from '@prisma/client'
import axios from 'axios'
import {
	Check,
	Gavel,
	Loader2,
	MoreVertical,
	Shield,
	ShieldAlert,
	ShieldCheck,
	ShieldQuestion,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { useCallback, useState } from 'react'

const roleIconMap = {
	GUEST: null,
	MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
	ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
}

export const MembersModal = () => {
	const { isOpen, onClose, type, data, onOpen } = useModal()
	const [loadingId, setLoadingId] = useState('')

	const router = useRouter()

	const isModalOpen = isOpen && type === 'members'
	const { server } = data as { server: ServerWithMembersWithProfiles }

	const onKick = useCallback(
		async (memberId: string) => {
			try {
				setLoadingId(memberId)

				const url = qs.stringifyUrl({
					url: `/api/members/${memberId}`,
					query: { serverId: server?.id },
				})

				const { data } = await axios.delete(url)

				router.refresh()
				onOpen('members', { server: data })
			} catch (error) {
				console.error(error)
			} finally {
				setLoadingId('')
			}
		},
		[onOpen, router, server?.id],
	)

	const onRoleChange = useCallback(
		async (memberId: string, role: MemberRole) => {
			try {
				setLoadingId(memberId)

				const url = qs.stringifyUrl({
					url: `/api/members/${memberId}`,
					query: { serverId: server?.id },
				})

				const { data } = await axios.patch(url, { role })

				router.refresh()
				onOpen('members', { server: data })
			} catch (error) {
				console.error(error)
			} finally {
				setLoadingId('')
			}
		},
		[onOpen, router, server?.id],
	)

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="overflow-hidden bg-white text-black">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="text-center text-2xl">
						Gerenciar membros
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						{server?.members?.length} Membros
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="mt-8 max-h-[26.25rem] pr-6">
					{server?.members?.map((member) => (
						<section
							key={member.id}
							className="mb-6 flex items-center gap-x-2"
						>
							<UserAvatar src={member.profile.imageUrl} />
							<div className="flex flex-col gap-y-1">
								<span className="flex items-center text-xs font-semibold">
									{member.profile.name}
									{roleIconMap[member.role]}
								</span>
								<p className="text-xs text-zinc-500">
									{member.profile.email}
								</p>
							</div>
							{server.profileId !== member.profileId &&
								loadingId !== member.id && (
									<div className="ml-auto">
										<DropdownMenu>
											<DropdownMenuTrigger>
												<MoreVertical className="h-4 w-4 text-zinc-500" />
											</DropdownMenuTrigger>
											<DropdownMenuContent side="left">
												<DropdownMenuSub>
													<DropdownMenuSubTrigger className="flex items-center">
														<ShieldQuestion className="mr-2 h-4 w-4" />
														<span>Papel</span>
													</DropdownMenuSubTrigger>
													<DropdownMenuPortal>
														<DropdownMenuSubContent>
															<DropdownMenuItem
																onClick={() =>
																	onRoleChange(
																		member.id,
																		'GUEST',
																	)
																}
															>
																<Shield className="mr-2 h-4 w-4" />
																Convidado
																{member.role === 'GUEST' && (
																	<Check className="ml-2 h-4 w-4" />
																)}
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	onRoleChange(
																		member.id,
																		'MODERATOR',
																	)
																}
															>
																<ShieldCheck className="mr-2 h-4 w-4" />
																Moderador
																{member.role ===
																	'MODERATOR' && (
																	<Check className="ml-2 h-4 w-4" />
																)}
															</DropdownMenuItem>
														</DropdownMenuSubContent>
													</DropdownMenuPortal>
												</DropdownMenuSub>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => onKick(member.id)}
												>
													<Gavel className="mr-2 h-4 w-4" />
													Expulsar
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								)}
							{loadingId === member.id && (
								<Loader2 className="ml-auto h-4 w-4 animate-spin text-zinc-500" />
							)}
						</section>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}
