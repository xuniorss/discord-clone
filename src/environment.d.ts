// Set the typing of your environment variables here 👇
type MyVariables = {
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
	CLERK_SECRET_KEY: string
	NEXT_PUBLIC_CLERK_SIGN_IN_URL: string
	NEXT_PUBLIC_CLERK_SIGN_UP_URL: string
	NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: string
	NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: string
	DATABASE_URL: string
	UPLOADTHING_SECRET: string
	UPLOADTHING_APP_ID: string
	NEXT_PUBLIC_SITE_URL: string
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends MyVariables {}
	}
}

export {}
