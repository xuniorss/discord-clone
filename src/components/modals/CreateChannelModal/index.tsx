'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useModal } from '@/hooks/use-modal-store'
import { ChannelProps, ChannelSchema } from '@/models/channel'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChannelType } from '@prisma/client'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import qs from 'query-string'
import { useCallback, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const CreateChannelModal = () => {
	const { isOpen, onClose, type } = useModal()
	const router = useRouter()
	const params = useParams()

	const isModalOpen = isOpen && type === 'createChannel'

	const form = useForm<ChannelProps>({
		resolver: zodResolver(ChannelSchema),
		defaultValues: { name: '', type: ChannelType.TEXT },
	})

	const isLoading = useMemo(
		() => form.formState.isSubmitting,
		[form.formState.isSubmitting],
	)

	const handleClose = useCallback(() => {
		form.reset()
		onClose()
	}, [form, onClose])

	const onSubmit: SubmitHandler<ChannelProps> = useCallback(
		async (values) => {
			try {
				const url = qs.stringifyUrl({
					url: '/api/channels',
					query: { serverId: params?.serverId },
				})

				await axios.post(url, values)

				form.reset()
				router.refresh()
				onClose()
			} catch (error) {
				console.error(error)
			}
		},
		[form, onClose, params?.serverId, router],
	)

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="overflow-hidden bg-white p-0 text-black">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="text-center text-2xl">
						Criar canal
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<section className="space-y-8 px-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
											Nome do canal
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
												placeholder="Digite o nome do canal"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo de canal</FormLabel>
										<Select
											disabled={isLoading}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="border-0 bg-zinc-300/50 capitalize text-black outline-none ring-offset-0 focus:ring-0 focus:ring-offset-0">
													<SelectValue placeholder="Selecione um tipo de canal" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(ChannelType).map((type) => (
													<SelectItem
														key={type}
														value={type}
														className="capitalize"
													>
														{type.toLowerCase()}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
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
