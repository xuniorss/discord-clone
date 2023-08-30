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
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useModal } from '@/hooks/use-modal-store'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { useCallback, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
	fileUrl: z.string().url().min(1, { message: 'Anexo obrigatório' }),
})

type FormProps = z.infer<typeof formSchema>

export const MessageFileModal = () => {
	const { isOpen, onClose, type, data } = useModal()
	const router = useRouter()

	const form = useForm<FormProps>({
		resolver: zodResolver(formSchema),
		defaultValues: { fileUrl: '' },
	})

	const isModalOpen = isOpen && type === 'messageFile'
	const { apiUrl, query } = data

	const isLoading = useMemo(
		() => form.formState.isSubmitting,
		[form.formState.isSubmitting],
	)

	const handleClose = useCallback(() => {
		form.reset()
		onClose()
	}, [form, onClose])

	const onSubmit: SubmitHandler<FormProps> = useCallback(
		async (values) => {
			try {
				const url = qs.stringifyUrl({ url: apiUrl || '', query })

				await axios.post(url, { ...values, content: values.fileUrl })

				form.reset()
				router.refresh()
				handleClose()
			} catch (error) {
				console.error(error)
			}
		},
		[apiUrl, form, handleClose, query, router],
	)

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="overflow-hidden bg-white p-0 text-black">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="text-center text-2xl">
						Adicionar um anexo
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Enviar um arquivo como mensagem
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
									name="fileUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint="messageFile"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</section>
						<DialogFooter className="bg-gray-100 px-6 py-4">
							<Button
								aria-label="button create a new server"
								variant="primary"
								type="submit"
								disabled={isLoading}
							>
								Enviar
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
