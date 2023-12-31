import { Menu } from 'lucide-react'
import { NavigationSidebar } from './navigation/navigation-sidebar'
import { ServerSidebar } from './server/server-sidebar'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

export const MobileToggle = ({ serverId }: { serverId: string }) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					aria-label="toggle sidebar"
					variant="ghost"
					size="icon"
					className="md:hidden"
				>
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="flex gap-0 p-0">
				<div className="w-[4.5rem]">
					<NavigationSidebar />
				</div>
				<ServerSidebar serverId={serverId} />
			</SheetContent>
		</Sheet>
	)
}
