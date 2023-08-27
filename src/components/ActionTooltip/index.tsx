'use client'

import { ReactNode } from 'react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip'

interface ActionTooltipProps {
	label: string
	children: ReactNode
	side?: 'top' | 'bottom' | 'left' | 'right'
	align?: 'start' | 'center' | 'end'
}

export const ActionTooltip = ({
	label,
	children,
	side,
	align,
}: ActionTooltipProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent side={side} align={align}>
					<p className="text-sm font-semibold capitalize">
						{label.toLowerCase()}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
