import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelSchema } from '@/models/channel'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export const DELETE = async (
	req: Request,
	{ params }: { params: { channelId: string } },
) => {
	try {
		const profile = await currentProfile()
		const { searchParams } = new URL(req.url)

		const serverId = searchParams.get('serverId')

		if (!profile) return new NextResponse('Unanuthorized', { status: 401 })
		if (!serverId)
			return new NextResponse('Server ID missing', { status: 400 })
		if (!params.channelId)
			return new NextResponse('Channel ID missing', { status: 400 })

		const server = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
					},
				},
			},
			data: {
				channels: {
					delete: { id: params.channelId, name: { not: 'geral' } },
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		console.error('[CHANNEL_ID_DELETE]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

export const PATCH = async (
	req: Request,
	{ params }: { params: { channelId: string } },
) => {
	try {
		const profile = await currentProfile()
		const { name, type } = ChannelSchema.parse(await req.json())
		const { searchParams } = new URL(req.url)

		const serverId = searchParams.get('serverId')

		if (!profile) return new NextResponse('Unanuthorized', { status: 401 })
		if (!serverId)
			return new NextResponse('Server ID missing', { status: 400 })
		if (!params.channelId)
			return new NextResponse('Channel ID missing', { status: 400 })
		if (name === 'geral')
			return new NextResponse('Name cannot be "geral"', { status: 400 })

		const server = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
					},
				},
			},
			data: {
				channels: {
					update: {
						where: { id: params.channelId, NOT: { name: 'geral' } },
						data: { name, type },
					},
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		console.error('[CHANNEL_ID_PATCH]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
