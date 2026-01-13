"use client"

import * as React from "react"
import Link from "next/link"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, Menu, LogIn } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Sektor Pertanian",
    href: "/peluang-investasi/pertanian",
    description:
      "Potensi investasi di sektor pertanian, perkebunan, dan peternakan Sumatera Utara.",
  },
  {
    title: "Sektor Pariwisata",
    href: "/peluang-investasi/pariwisata",
    description:
      "Peluang pengembangan destinasi wisata alam, budaya, dan infrastruktur pendukung.",
  },
  {
    title: "Sektor Energi",
    href: "/peluang-investasi/energi",
    description:
      "Investasi energi terbarukan dan sumber daya mineral yang potensial.",
  },
  {
    title: "Sektor Infrastruktur",
    href: "/peluang-investasi/infrastruktur",
    description:
      "Pembangunan jalan, jembatan, dan fasilitas umum untuk mendukung pertumbuhan ekonomi.",
  },
]

export function NavigationMenuDemo() {
  const isMobile = useIsMobile()
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
  const textColorClass = isTransparent ? "text-white" : "text-foreground"

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
      <div className="container flex h-20 items-center justify-between py-4">
        <div className="flex items-center gap-2 ml-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold inline-block">
              <img src="/DPMPTSP_Provsu.png" alt="Logo DPMPTSP Sumut" className="h-14 w-auto object-contain md:h-16" />
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList className={menuListClass}>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    triggerClass,
                    pathname === "/" && activeLinkClass
                  )}
                >
                  Beranda
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden transition-colors hover:shadow-md focus:shadow-md select-none"
                          href="/"
                        >
                          <div className="mb-2 text-lg font-medium">
                            WebGIS DPMPTSP Sumut
                          </div>
                          <p className="text-muted-foreground text-sm leading-tight">
                            Sistem Informasi Geografis Dinas Penanaman Modal dan Pelayanan Perizinan Terpadu Satu Pintu Provinsi Sumatera Utara
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="#" title="Visi & Misi">
                      Visi dan Misi DPMPTSP Sumatera Utara
                    </ListItem>
                    <ListItem href="#" title="Struktur Organisasi">
                      Struktur Organisasi dan Tata Kerja
                    </ListItem>
                    <ListItem href="#" title="Tugas & Fungsi">
                      Tugas Pokok dan Fungsi DPMPTSP
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    triggerClass,
                    pathname?.startsWith("/peluang-investasi") && activeLinkClass
                  )}
                >
                  Peluang Investasi
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
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

        <div className="hidden md:flex items-center justify-end w-[120px] mr-8">
          <Button
            asChild
            className={cn(
              "h-12 text-base rounded-full px-6 font-bold shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95",
              isTransparent
                ? "bg-white/10 backdrop-blur-md border border-white/50 text-white hover:bg-white hover:text-blue-900"
                : "bg-gradient-to-r from-blue-600 to-blue-800 text-white border border-blue-500 hover:shadow-blue-200"
            )}
          >
            <Link href="/login" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" /> Masuk
            </Link>
          </Button>
        </div>

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
                  <img src="/DPMPTSP_Provsu.png" alt="Logo" className="h-8 w-auto" />
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
                    <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full shadow-lg">
                      <Link href="/login" className="flex items-center justify-center gap-2">
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

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
