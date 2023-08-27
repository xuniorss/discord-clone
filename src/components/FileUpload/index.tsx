'use client'

import { UploadDropzone } from '@/lib/uploadthing'
import '@uploadthing/react/styles.css'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useMemo } from 'react'

interface FileUploadProps {
	onChange: (url?: string) => void
	value: string
	endpoint: 'serverImage' | 'messageFile'
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
	const fileType = useMemo(() => value?.split('.').pop(), [value])

	if (value && fileType !== 'pdf') {
		return (
			<div className="relative h-20 w-20">
				<Image fill src={value} alt="Upload" className="rounded-full" />
				<button
					aria-label="button remove selected image"
					className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
					type="button"
					onClick={() => onChange('')}
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		)
	}

	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(res) => onChange(res?.[0].url)}
			onUploadError={(error: Error) => console.error(error)}
		/>
	)
}