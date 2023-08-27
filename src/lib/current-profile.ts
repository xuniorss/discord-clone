import { auth } from '@clerk/nextjs'

import { db } from './db'

export const currentProfile = async () => {
	const { userId } = auth()

	if (!userId) return null

	return await db.profile.findUnique({ where: { userId } })
}
