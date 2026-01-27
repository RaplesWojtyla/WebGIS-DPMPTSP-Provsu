"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, LogIn, LogInIcon } from "lucide-react"
import { usePathname } from "next/navigation"
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
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import UserDropdown from "./UserDropdown"

const components: { title: string; href: string; description: string }[] = [
	{
		title: "Pertanian & Perkebunan",
		href: "/invest?sector=Pertanian",
		description: "Sektor basis dengan kontribusi terbesar terhadap PDRB.",
	},
	{
		title: "Industri Pengolahan",
		href: "/invest?sector=Industri",
		description: "Hilirisasi produk unggulan daerah bernilai tambah tinggi.",
	},
	{
		title: "Pariwisata",
		href: "/invest?sector=Pariwisata",
		description: "Destinasi wisata alam dan budaya berkelas dunia.",
	},
	{
		title: "Energi & SDM",
		href: "/invest?sector=Energi",
		description: "Potensi energi terbarukan dan pertambangan.",
	},
	{
		title: "Infrastruktur",
		href: "/invest?sector=Konstruksi",
		description: "Pembangunan konektivitas dan fasilitas pendukung.",
	},
]

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
		"bg-transparent rounded-full transition-all duration-200",
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
					: "bg-background/95 backdrop-blur-xs supports-backdrop-filter:bg-background/40"
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
											"bg-transparent",
											pathname?.startsWith("/invest") && activeLinkClass
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
					<UserDropdown user={user} />
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
							<Button variant="ghost" size="icon" className={cn("md:hidden", isTransparent ? "text-white hover:bg-white/20 hover:text-white" : "hover:text-blue-900 hover:bg-blue-50/50")}>
								<Menu className="h-6 w-6" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</DrawerTrigger>
						<DrawerContent className="h-full w-[80%] max-w-sm rounded-r-xl">
							<DrawerHeader className="border-b pb-4">
								<DrawerTitle className="flex items-center gap-2">
									<Image
										src="/DPMPTSP_Provsu.png"
										alt="Logo"
										className="h-8 w-auto"
										width={100}
										height={32}
									/>
									<span className="text-sm font-bold">DPMPTSP Sumut</span>
								</DrawerTitle>
								<DrawerDescription className="text-left">
									Menu Navigasi
								</DrawerDescription>
							</DrawerHeader>
							<div className="flex-1 overflow-y-auto px-4 py-4">
								<nav className="flex flex-col space-y-4">
									<div className="space-y-2">
										<h4 className="font-medium text-sm py-2 px-2 rounded-md border-b">Beranda</h4>
										<Link href="/" className="block py-2 px-2 text-sm rounded-md hover:text-blue-900 hover:bg-blue-50/50">Home</Link>
										<Link href="#" className="block py-2 px-2 text-sm rounded-md hover:text-blue-900 hover:bg-blue-50/50">Visi & Misi</Link>
										<Link href="#" className="block py-2 px-2 text-sm rounded-md hover:text-blue-900 hover:bg-blue-50/50">Struktur Organisasi</Link>
									</div>
									<div className="space-y-2">
										<h4 className="font-medium text-sm py-2 px-2 rounded-md border-b">Peluang Investasi</h4>
										{components.slice(0, 4).map((component) => (
											<Link key={component.title} href={component.href} className="block py-2 px-2 text-sm rounded-md hover:text-blue-900 hover:bg-blue-50/50">
												{component.title}
											</Link>
										))}
									</div>
									<Link href="#" className="block font-medium py-2 px-2 text-sm rounded-md hover:text-blue-900 hover:bg-blue-50/50">Informasi</Link>
									<div className="pt-2">
										<Button asChild className="w-full bg-linear-to-r from-blue-600 to-blue-800 text-white rounded-full shadow-lg">
											<Link href="/sign-in" className="flex items-center justify-center gap-2">
												<LogIn className="w-4 h-4" /> Masuk
											</Link>
										</Button>
									</div>
								</nav>
							</div>
							<DrawerFooter className="border-t pt-4">
								<DrawerClose asChild>
									<Button variant="outline">Tutup</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				</div>
			</div>
		</header>
	)
}
