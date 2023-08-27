'use client'

import { useModal } from '@/hooks/use-modal-store'
import { Plus } from 'lucide-react'
import { ActionTooltip } from '../ActionTooltip'

export const NavigationAction = () => {
	const { onOpen } = useModal()

	return (
		<div>
			<ActionTooltip
				label="Adicionar um servidor"
				side="right"
				align="center"
			>
				<button
					aria-label="button add a server"
					onClick={() => onOpen('createServer')}
					className="group flex items-center"
				>
					<div className="mx-3 flex h-[3rem] w-[3rem] items-center justify-center overflow-hidden rounded-[1.5rem] bg-background transition-all group-hover:rounded-[1rem] group-hover:bg-emerald-500 dark:bg-neutral-700">
						<Plus
							className="text-emerald-500 transition group-hover:text-white"
							size={25}
						/>
					</div>
				</button>
			</ActionTooltip>
		</div>
	)
}
