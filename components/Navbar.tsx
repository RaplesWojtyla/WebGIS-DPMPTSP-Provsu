"use client"

import * as React from "react"
import Link from "next/link"
import { LogInIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import dynamic from "next/dynamic"

const UserDropdown = dynamic(() => import("./UserDropdown"), { ssr: false })
// Dynamically import MobileMenu to avoid hydration mismatch
const MobileMenu = dynamic(() => import("./MobileNavbar"), { ssr: false })

export function Navbar({ user }: { user: User | null }) {
	// const isMobile = useIsMobile()
	const pathname = usePathname()
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
					<MobileMenu user={user} isTransparent={isTransparent} />
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
