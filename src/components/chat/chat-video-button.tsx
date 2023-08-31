'use client'

import { Video, VideoOff } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useCallback } from 'react'
import { ActionTooltip } from '../ActionTooltip'

export const ChatVideoButton = () => {
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()
	const isVideo = searchParams?.get('video')

	const Icon = isVideo ? VideoOff : Video
	const tooltipLabel = isVideo ? 'Encerrar vídeo chamada' : 'Iniciar vídeo'

	const onClick = useCallback(() => {
		const url = qs.stringifyUrl(
			{
				url: pathname || '',
				query: { video: isVideo ? undefined : true },
			},
			{ skipNull: true },
		)

		router.push(url)
	}, [isVideo, pathname, router])

	return (
		<ActionTooltip side="bottom" label={tooltipLabel}>
			<button onClick={onClick} className="mr-4 transition hover:opacity-75">
				<Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
			</button>
		</ActionTooltip>
	)
}
