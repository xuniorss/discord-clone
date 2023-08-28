import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NewServerSchema } from '@/models/servers'
import { NextResponse } from 'next/server'

export const PATCH = async (
	req: Request,
	{ params }: { params: { serverId: string } },
) => {
	try {
		const profile = await currentProfile()
		const { name, imageUrl } = NewServerSchema.parse(await req.json())

		if (!profile) return new NextResponse('Unauthorized', { status: 401 })
		if (!params.serverId)
			return new NextResponse('Server ID Missing', { status: 400 })

		const server = await db.server.update({
			where: { id: params.serverId, profileId: profile.id },
			data: { name, imageUrl },
		})

		return NextResponse.json(server)
	} catch (error) {
		console.error('[SERVER_ID_PATCH]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
