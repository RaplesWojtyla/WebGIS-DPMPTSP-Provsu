"use client"

import * as React from "react"
import Link from "next/link"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, Menu } from "lucide-react"
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xs supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold inline-block">
              <img src="/DPMPTSP_Provsu.png" alt="Logo DPMPTSP Sumut" className="h-10 w-auto object-contain md:h-12" />
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "hover:text-blue-900 hover:bg-blue-50/50 focus:bg-blue-50/50 focus:text-blue-900 data-[state=open]:bg-blue-50/50 data-[state=open]:text-blue-900",
                    pathname === "/" && "text-blue-700 font-bold bg-blue-50/50"
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
                    "hover:text-blue-900 hover:bg-blue-50/50 focus:bg-blue-50/50 focus:text-blue-900 data-[state=open]:bg-blue-50/50 data-[state=open]:text-blue-900",
                    pathname?.startsWith("/peluang-investasi") && "text-blue-700 font-bold bg-blue-50/50"
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
                      "hover:text-blue-900 hover:bg-blue-50/50 focus:bg-blue-50/50 focus:text-blue-900",
                      pathname === "/maps" && "text-blue-700 font-bold bg-blue-50/50"
                    )}
                  >
                    Daerah
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="#" className={cn(navigationMenuTriggerStyle(), "hover:text-blue-900 hover:bg-blue-50/50 focus:bg-blue-50/50 focus:text-blue-900")}>
                    Informasi
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:block w-[120px]"></div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Drawer direction="left">
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:text-blue-900 hover:bg-blue-50/50">
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
                  <Link href="/maps" className="block font-medium py-2 px-2 text-sm rounded-md hover:text-blue-900 hover:bg-blue-50/50">Daerah</Link>
                  <Link href="#" className="block font-medium py-2 px-2 text-sm rounded-md hover:text-blue-900 hover:bg-blue-50/50">Informasi</Link>
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
