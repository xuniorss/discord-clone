'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { ActionTooltip } from '../ActionTooltip'

interface NavigationItemProps {
	id: string
	imageUrl: string
	name: string
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
	const params = useParams() as { serverId: string }
	const router = useRouter()

	const handleClick = useCallback(
		() => router.push(`/servers/${id}`),
		[id, router],
	)

	return (
		<ActionTooltip side="right" align="center" label={name}>
			<button
				aria-label="button select a server"
				onClick={handleClick}
				className="group relative flex items-center"
			>
				<div
					className={cn(
						'absolute left-0 w-[0.25rem] rounded-r-full bg-primary transition-all',
						params?.serverId !== id && 'group-hover:h-[1.25rem]',
						params?.serverId === id ? 'h-[2.25rem]' : 'h-[0.5rem]',
					)}
				/>
				<div
					className={cn(
						'group relative mx-3 flex h-[3rem] w-[3rem] overflow-hidden rounded-[1.5rem] transition-all group-hover:rounded-[1rem]',
						params?.serverId === id &&
							'rounded-[1rem] bg-primary/10 text-primary',
					)}
				>
					<Image fill src={imageUrl} alt="Channel" />
				</div>
			</button>
		</ActionTooltip>
	)
}
