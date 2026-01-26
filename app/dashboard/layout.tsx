"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, Settings, Users, LogOut, FileText, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.includes("/admin");

    const navigation = isAdmin
        ? [
            { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
            { name: "Users", href: "/dashboard/admin/users", icon: Users },
            { name: "Investments", href: "/dashboard/admin/investments", icon: PieChart },
            { name: "Map Data", href: "/dashboard/admin/map-data", icon: Map },
            { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
        ]
        : [
            { name: "Overview", href: "/dashboard/user", icon: LayoutDashboard },
            { name: "My Investments", href: "/dashboard/user/investments", icon: PieChart },
            { name: "Saved Locations", href: "/dashboard/user/saved", icon: Map },
            { name: "Applications", href: "/dashboard/user/applications", icon: FileText },
            { name: "Settings", href: "/dashboard/user/settings", icon: Settings },
        ];

    return (
        <div className="flex h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r hidden md:flex flex-col">
                <div className="p-6 h-16 flex items-center border-b">
                    <Link href="/" className="font-bold text-xl flex items-center gap-2">
                        <Map className="w-6 h-6 text-primary" />
                        <span>WebGIS Provsu</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                        {isAdmin ? "Admin Workspace" : "Investor Workspace"}
                    </div>
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <Button variant="outline" className="w-full justify-start gap-2" asChild>
                        <Link href="/sign-in">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Link>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
