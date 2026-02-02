"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, LogIn, LogInIcon, User, LayoutDashboard, LogOut, ChevronRight, Home, Map, Info, Briefcase } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import UserDropdown from "./UserDropdown"
import { signOut } from "@/lib/actions/auth.actions"

export function Navbar({ user }: { user: User | null }) {
	// const isMobile = useIsMobile()
	const pathname = usePathname()
	const router = useRouter()
	const [isScrolled, setIsScrolled] = React.useState(false)

	const isHome = pathname === "/"
	const isTransparent = isHome && !isScrolled

	React.useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10)
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	// Dynamic classes for text and hover states
	// const textColorClass = isTransparent ? "text-white" : "text-foreground"

	const triggerClass = cn(
		"bg-transparent rounded-full transition-all duration-300",
		isTransparent
			? "text-white hover:bg-white hover:text-black focus:bg-white focus:text-black data-[state=open]:bg-white data-[state=open]:text-black"
			: "hover:text-black hover:bg-blue-50/50 focus:bg-blue-50/50 focus:text-black data-[state=open]:bg-blue-50/50 data-[state=open]:text-black"
	)

	const activeLinkClass = isTransparent
		? "font-bold bg-white/20"
		: "text-blue-700 font-bold border rounded-full bg-blue-50/50"

	const menuListClass = cn(
		"flex transition-all duration-300",
		isTransparent
			? "rounded-full border px-2 py-1 border-white/30 bg-black/10 backdrop-blur-md"
			: "border-none bg-transparent"
	)

	return (
		<header
			className={cn(
				"fixed top-0 z-50 w-full transition-all duration-300",
				isTransparent
					? "bg-transparent border-transparent"
					: "bg-white border-b shadow-sm"
			)}
		>
			<div className="container flex h-20 items-center justify-between py-4 px-6">
				<div className="flex items-center gap-2 ml-6">
					<Link href="/" className="flex items-center space-x-2">
						<span className="font-bold inline-block">
							<Image
								src="/DPMPTSP_Provsu.png"
								alt="Logo DPMPTSP Sumut"
								className="h-14 w-auto object-contain md:h-16"
								width={200}
								height={64}
							/>
						</span>
					</Link>
				</div>

				{/* Desktop Menu */}
				<div className="hidden md:flex flex-1 justify-center">
					<NavigationMenu>
						<NavigationMenuList className={menuListClass}>
							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link
										href="/"
										className={cn(
											navigationMenuTriggerStyle(),
											triggerClass,
											"bg-transparent",
											pathname === "/" && activeLinkClass
										)}
									>
										Beranda
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link
										href="/invest"
										className={cn(
											navigationMenuTriggerStyle(),
											triggerClass,
											"bg-transparent", // Override navigationMenuTriggerStyle default bg
											pathname === "/invest" && activeLinkClass
										)}
									>
										Sektor Unggulan
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link
										href="/maps"
										className={cn(
											navigationMenuTriggerStyle(),
											triggerClass,
											"bg-transparent", // Override navigationMenuTriggerStyle default bg
											pathname === "/maps" && activeLinkClass
										)}
									>
										Daerah
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink asChild>
									<Link href="#" className={cn(navigationMenuTriggerStyle(), triggerClass, "bg-transparent")}>
										Informasi
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				{user ? (
					<div className="hidden md:flex">
						<UserDropdown user={user} isTransparent={isTransparent} />
					</div>
				) : (
					<div className="hidden md:flex items-center justify-end w-[120px] mr-8">
						<Button
							asChild
							className={cn(
								"h-12 text-base rounded-full px-6 font-bold shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95",
								isTransparent
									? "bg-white/10 backdrop-blur-md border border-white/50 text-white hover:bg-white hover:text-blue-900"
									: "bg-linear-to-r from-blue-600 to-blue-800 text-white border border-blue-500 hover:shadow-blue-200"
							)}
						>
							<Link href="/sign-in" className="flex items-center gap-2">
								<LogInIcon className="w-4 h-4" /> Masuk
							</Link>
						</Button>
					</div>
				)}

				{/* Mobile Menu */}
				<div className="md:hidden">
					<Drawer direction="left">
						<DrawerTrigger asChild>
							<Button variant="ghost" size="icon" className={cn("md:hidden", isTransparent ? "text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:text-white" : "hover:text-blue-900 hover:bg-blue-50/50")}>
								<Menu className="h-6 w-6" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</DrawerTrigger>
						<DrawerContent className="h-full w-[85%] max-w-sm rounded-r-2xl border-r-0 outline-none flex flex-col">
							<DrawerHeader className="border-b pb-6 pt-6 px-6">
								<DrawerTitle className="sr-only">Navigasi Mobile</DrawerTitle>
								<div className="flex items-center justify-between mb-6">
									<div className="flex items-center gap-3">
										<Image
											src="/DPMPTSP_Provsu.png"
											alt="Logo"
											className="h-10 w-auto"
											width={100}
											height={40}
										/>
										<div className="flex flex-col items-start">
											<span className="text-sm font-bold text-blue-950 leading-tight">DPMPTSP</span>
											<span className="text-xs font-medium text-blue-600/80">Sumatera Utara</span>
										</div>
									</div>
									<DrawerClose asChild>
										<Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-gray-900">
											<ChevronRight className="rotate-180 size-6" />
										</Button>
									</DrawerClose>
								</div>

								{/* User Profile Header (Integrated) */}
								{user && (
									<Link href="/profile" className="flex items-center gap-4 pt-2 pb-2 hover:bg-blue-50/50 rounded-xl px-2 -mx-2 transition-colors group">
										<Avatar className="size-12 border border-gray-100 shadow-sm group-hover:border-blue-200 transition-colors">
											<AvatarImage src={user.image || ''} />
											<AvatarFallback className="bg-blue-600 text-white font-medium text-lg">{user.name?.[0]}</AvatarFallback>
										</Avatar>
										<div className="flex flex-col overflow-hidden">
											<span className="font-bold text-base text-gray-900 truncate group-hover:text-blue-700 transition-colors">{user.name}</span>
											<span className="text-sm text-gray-500 truncate font-medium group-hover:text-blue-500/80 transition-colors">{user.email}</span>
										</div>
									</Link>
								)}
							</DrawerHeader>

							<div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
								<nav className="flex flex-col space-y-8">
									{/* Account Links (Only if logged in) */}
									{user ? (
										<div className="space-y-2">
											<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Akun Saya</p>
											<Link href="/dashboard" className="flex items-center gap-3 px-0 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
												<LayoutDashboard className="size-5 text-gray-400 group-hover:text-blue-500" /> Dashboard Saya
											</Link>
											<Link href="/profile" className="flex items-center gap-3 px-0 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
												<User className="size-5 text-gray-400 group-hover:text-blue-500" /> Profil Akun
											</Link>
										</div>
									) : (
										<div className="mb-2">
											<Button asChild className="w-full h-12 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-blue-200 transition-all text-base font-semibold">
												<Link href="/sign-in" className="flex items-center justify-center gap-2">
													<LogIn className="size-5" /> Masuk ke Akun
												</Link>
											</Button>
										</div>
									)}

									{/* Main Menu */}
									<div className="space-y-2">
										<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu Utama</p>
										<Link href="/" className="flex items-center gap-3 px-0 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
											<Home className="size-5 text-gray-400" /> Beranda
										</Link>
										<Link href="/invest" className="flex items-center gap-3 px-0 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
											<Briefcase className="size-5 text-gray-400" /> Sektor Unggulan
										</Link>
										<Link href="/maps" className="flex items-center gap-3 px-0 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
											<Map className="size-5 text-gray-400" /> Peta Daerah
										</Link>
										<Link href="#" className="flex items-center gap-3 px-0 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
											<Info className="size-5 text-gray-400" /> Informasi
										</Link>
									</div>
								</nav>
							</div>

							{user && (
								<DrawerFooter className="border-t pb-6 pt-4 px-6 bg-white">
									<button
										onClick={async () => {
											const res = await signOut()
											if (res?.success) {
												router.refresh()
												router.push('/sign-in')
											}
										}}
										className="flex items-center justify-center gap-2 w-full h-11 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
									>
										<LogOut className="size-4" /> Keluar Akun
									</button>
								</DrawerFooter>
							)}
						</DrawerContent>
					</Drawer>
				</div>
			</div>
		</header >
	)
}

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-blue-900 focus:bg-blue-50 focus:text-blue-900",
						className
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none text-blue-950">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-blue-600/80">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	)
})
ListItem.displayName = "ListItem"
