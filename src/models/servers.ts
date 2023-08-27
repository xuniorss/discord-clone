import { z } from 'zod'

export const NewServerSchema = z.object({
	name: z.string().min(1, { message: 'Nome do servidor é obrigatório.' }),
	imageUrl: z
		.string()
		.url()
		.min(1, { message: 'Imagem do servidor é obrigatória.' }),
})

export type NewServerProps = z.infer<typeof NewServerSchema>
