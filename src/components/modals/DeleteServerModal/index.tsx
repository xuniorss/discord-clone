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
import { useCallback, useState } from 'react'

export const DeleteServerModal = () => {
	const [isLoading, setIsLoading] = useState(false)

	const { isOpen, onClose, type, data } = useModal()

	const router = useRouter()

	const isModalOpen = isOpen && type === 'deleteServer'
	const { server } = data

	const onLeaveServer = useCallback(async () => {
		try {
			setIsLoading(true)

			await axios.delete(`/api/servers/${server?.id}`)

			onClose()
			router.refresh()
			router.push('/')
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}, [onClose, router, server?.id])

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="overflow-hidden bg-white p-0 text-black">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="text-center text-2xl">
						Excluir servidor
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Você tem certeza de que quer fazer isso? <br />
						<span className="font-semibold text-indigo-500">
							{server?.name}
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
							onClick={onLeaveServer}
						>
							Confirmar
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
