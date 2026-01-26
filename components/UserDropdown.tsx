import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/actions/auth.actions"
import { toast } from "sonner"


export const UserDropdown = ({ user }: { user: User | null }) => {
    const router = useRouter()

    const handleSignOut = async () => {
        const response = await signOut()

        if (response.success) {
            router.push('/sign-in')
        } else {
            toast.error("Logout Gagal", {
                description: response?.error || "Gagal keluar dari akun"
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-3 text-gray-400 hover:bg-primary"
                >
                    <Avatar className="size-8">
                        <AvatarImage src={user?.image || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {user?.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-base font-medium text-gray-400">
                            {user?.name}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-primary/80 text-primary-foreground">
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-2">
                        <Avatar className="size-10">
                            <AvatarImage src={user?.image || ''} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {user?.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-base font-medium">
                                {user?.name}
                            </span>
                            <span className="text-sm">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600" />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-gray-100 text-base font-medium focus:bg-transparent focus:text-primary-foreground cursor-pointer"
                >
                    <LogOutIcon className="size-4 mr-2 hidden sm:block" />
                    Logout
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-600" />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown