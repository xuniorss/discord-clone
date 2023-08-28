'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useModal } from '@/hooks/use-modal-store'
import { useOrigin } from '@/hooks/use-origin'
import axios from 'axios'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useCallback, useState } from 'react'

export const InviteModal = () => {
	const [copied, setCopied] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const { isOpen, onClose, type, data, onOpen } = useModal()
	const origin = useOrigin()

	const isModalOpen = isOpen && type === 'invite'
	const { server } = data

	const inviteUrl = `${origin}/invite/${server?.inviteCode}`

	const onCopy = useCallback(() => {
		navigator.clipboard.writeText(inviteUrl)
		setCopied(true)

		const timeout = setTimeout(() => setCopied(false), 1000)

		return () => clearTimeout(timeout)
	}, [inviteUrl])

	const onNew = useCallback(async () => {
		try {
			setIsLoading(true)
			const { data } = await axios.patch(
				`/api/servers/${server?.id}/invite-code`,
			)

			onOpen('invite', { server: data })
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}, [onOpen, server?.id])

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="overflow-hidden bg-white p-0 text-black">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="text-center text-2xl">
						Convide amigos
					</DialogTitle>
				</DialogHeader>
				<section className="p-6">
					<Label className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
						Link de convite do servidor
					</Label>
					<div className="mt-2 flex items-center gap-x-2">
						<Input
							disabled={isLoading}
							className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
							value={inviteUrl}
						/>
						<Button
							disabled={isLoading}
							aria-label="button copy invite link"
							onClick={onCopy}
							size="icon"
						>
							{copied ? (
								<Check className="h-4 w-4" />
							) : (
								<Copy className="h-4 w-4" />
							)}
						</Button>
					</div>
					<Button
						onClick={onNew}
						disabled={isLoading}
						aria-label="button generate a new invite link"
						variant="link"
						size="sm"
						className="mt-4 text-xs text-zinc-500"
					>
						Gerar um novo link
						<RefreshCw className="ml-2 h-4 w-4" />
					</Button>
				</section>
			</DialogContent>
		</Dialog>
	)
}
