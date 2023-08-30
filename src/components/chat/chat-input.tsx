'use client'

import { useModal } from '@/hooks/use-modal-store'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Plus, SmileIcon } from 'lucide-react'
import qs from 'query-string'
import { useCallback, useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'

interface ChatInputProps {
	apiUrl: string
	query: Record<string, any>
	name: string
	type: 'conversation' | 'channel'
}

const formSchema = z.object({
	content: z.string().min(1),
})

type FormProps = z.infer<typeof formSchema>

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
	const { onOpen } = useModal()

	const form = useForm<FormProps>({
		resolver: zodResolver(formSchema),
		defaultValues: { content: '' },
	})

	const isLoading = useMemo(
		() => form.formState.isSubmitting,
		[form.formState.isSubmitting],
	)

	const onSubmit: SubmitHandler<FormProps> = useCallback(
		async (data) => {
			try {
				const url = qs.stringifyUrl({ url: apiUrl, query })

				await axios.post(url, data)
			} catch (error) {
				console.error(error)
			}
		},
		[apiUrl, query],
	)

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="relative p-4 pb-6">
									<button
										type="button"
										onClick={() =>
											onOpen('messageFile', { apiUrl, query })
										}
										className="absolute left-8 top-7 flex h-[1.5rem] w-[1.5rem] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
									>
										<Plus className="text-white dark:text-[#313338]" />
									</button>
									<Input
										disabled={isLoading}
										className="border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
										placeholder={`Mensagem ${
											type === 'conversation' ? name : '#' + name
										}`}
										{...field}
									/>
									<div className="absolute right-8 top-7">
										<SmileIcon />
										{/* <EmojiPicker
                      onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}
                    /> */}
									</div>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
