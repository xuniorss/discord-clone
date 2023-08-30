import { Hash } from 'lucide-react'

interface ChatWelcomeProps {
	name: string
	type: 'channel' | 'conversation'
}

export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
	return (
		<div className="mb-4 space-y-2 px-4">
			{type === 'channel' && (
				<div className="flex h-[4.688rem] w-[4.688rem] items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700">
					<Hash className="h-12 w-12 text-white" />
				</div>
			)}
			<p className="text-xl font-bold md:text-3xl">
				{type === 'channel' ? 'Bem-vindo ao #' : ''}
				{name}
			</p>
			<p className="text-sm text-zinc-600 dark:text-zinc-400">
				{type === 'channel'
					? `Este é o início do #${name} canal.`
					: `Este é o início da sua conversa com ${name}`}
			</p>
		</div>
	)
}
