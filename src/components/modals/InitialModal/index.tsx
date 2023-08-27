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
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
	name: z.string().min(1, { message: 'Nome do servidor é obrigatório.' }),
	imageUrl: z
		.string()
		.url()
		.min(1, { message: 'Imagem do servidor é obrigatória.' }),
})

type FormProps = z.infer<typeof formSchema>

export const InitialModal = () => {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => setIsMounted(true), [])

	const form = useForm<FormProps>({
		resolver: zodResolver(formSchema),
		defaultValues: { name: '', imageUrl: '' },
	})

	const isLoading = useMemo(
		() => form.formState.isSubmitting,
		[form.formState.isSubmitting],
	)

	const onSubmit: SubmitHandler<FormProps> = useCallback(async (values) => {
		try {
			console.log(values)
		} catch (error) {
			console.error(error)
		}
	}, [])

	if (!isMounted) return null

	return (
		<Dialog open>
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
