'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { useCallback, useState } from 'react'

export const DeleteChannelModal = () => {
	const [isLoading, setIsLoading] = useState(false)

	const { isOpen, onClose, type, data } = useModal()

	const router = useRouter()

	const isModalOpen = isOpen && type === 'deleteChannel'
	const { server, channel } = data

	const onDeleteChannel = useCallback(async () => {
		try {
			setIsLoading(true)

			const url = qs.stringifyUrl({
				url: `/api/channels/${channel?.id}`,
				query: { serverId: server?.id },
			})

			await axios.delete(url)

			onClose()
			router.refresh()
			router.push(`/servers/${server?.id}`)
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}, [channel?.id, onClose, router, server?.id])

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="overflow-hidden bg-white p-0 text-black">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="text-center text-2xl">
						Excluir canal
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Você tem certeza de que quer fazer isso? <br />
						<span className="font-semibold text-indigo-500">
							#{channel?.name}
						</span>{' '}
						será excluído permanentemente.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-gray-100 px-6 py-4">
					<div className="flex w-full items-center justify-between">
						<Button
							disabled={isLoading}
							onClick={onClose}
							variant="ghost"
						>
							Cancelar
						</Button>
						<Button
							disabled={isLoading}
							variant="primary"
							onClick={onDeleteChannel}
						>
							Confirmar
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
