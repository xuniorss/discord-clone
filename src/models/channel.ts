import { ChannelType } from '@prisma/client'
import { z } from 'zod'

export const ChannelSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Nome do canal é obrigatório.' })
		.refine((name) => name !== 'geral', {
			message: 'O nome do canal não pode ser "geral"',
		}),
	type: z.nativeEnum(ChannelType),
})

export type ChannelProps = z.infer<typeof ChannelSchema>
