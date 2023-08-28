import { useEffect, useMemo, useState } from 'react'

export const useOrigin = () => {
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	const origin = useMemo(
		() =>
			typeof window !== 'undefined' && window.location.origin
				? window.location.origin
				: '',
		[],
	)

	if (!mounted) return ''

	return origin
}
