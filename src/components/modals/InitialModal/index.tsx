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
import { NewServerProps, NewServerSchema } from '@/models/servers'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const InitialModal = () => {
	const [isMounted, setIsMounted] = useState(false)
	const router = useRouter()

	useEffect(() => setIsMounted(true), [])

	const form = useForm<NewServerProps>({
		resolver: zodResolver(NewServerSchema),
		defaultValues: { name: '', imageUrl: '' },
	})

	const isLoading = useMemo(
		() => form.formState.isSubmitting,
		[form.formState.isSubmitting],
	)

	const onSubmit: SubmitHandler<NewServerProps> = useCallback(
		async (values) => {
			try {
				await axios.post('/api/servers', values)

				form.reset()
				router.refresh()
				window.location.reload()
			} catch (error) {
				console.error(error)
			}
		},
		[form, router],
	)

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
