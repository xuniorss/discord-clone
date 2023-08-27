'use client'

import { FileUpload } from '@/components/FileUpload'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useModal } from '@/hooks/use-modal-store'
import { NewServerProps, NewServerSchema } from '@/models/servers'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const CreateServerModal = () => {
	const { isOpen, onClose, type } = useModal()
	const router = useRouter()

	const isModalOpen = useMemo(
		() => isOpen && type === 'createServer',
		[isOpen, type],
	)

	const form = useForm<NewServerProps>({
		resolver: zodResolver(NewServerSchema),
		defaultValues: { name: '', imageUrl: '' },
	})

	const isLoading = useMemo(
		() => form.formState.isSubmitting,
		[form.formState.isSubmitting],
	)

	const handleClose = useCallback(() => {
		form.reset()
		onClose()
	}, [form, onClose])

	const onSubmit: SubmitHandler<NewServerProps> = useCallback(
		async (values) => {
			try {
				await axios.post('/api/servers', values)

				form.reset()
				router.refresh()
				onClose()
			} catch (error) {
				console.error(error)
			}
		},
		[form, onClose, router],
	)

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="overflow-hidden bg-white p-0 text-black">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="text-center text-2xl">
						Crie um servidor
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Seu servidor é onde você e seus amigos se reúnem. Crie o seu e
						comece a interagir.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<section className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField
									control={form.control}
									name="imageUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint="serverImage"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
											Nome do servidor
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
												placeholder="Digite o nome do servidor"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</section>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button
								aria-label="button create a new server"
								variant="primary"
								type="submit"
								disabled={isLoading}
							>
								Criar
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
