import { FileTextIcon, LayoutDashboardIcon, MapIcon, PieChartIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { FiActivity } from "react-icons/fi";


export const NAVIGATION_CONFIG = {
    user: {
        name: "Area Investor",
        items: [
            { name: "Ringkasan", href: "/dashboard", icon: LayoutDashboardIcon },
            { name: "Profil Saya", href: "/dashboard/profile", icon: UsersIcon },
            { name: "Simulasi Investasi", href: "/dashboard/simulation", icon: FiActivity },
            { name: "Ajukan Proposal", href: "/dashboard/proposal", icon: FileTextIcon },
        ]
    },
    operator: {
        name: "Area Operator",
        items: [
            { name: "Dashboard Operator", href: "/operator/dashboard", icon: LayoutDashboardIcon },
        ]
    },
    admin: {
        name: "Area Admin",
        items: [
            { name: "Ringkasan", href: "/admin/dashboard", icon: LayoutDashboardIcon },
            { name: "Pengguna", href: "/admin/dashboard/users", icon: UsersIcon },
            { name: "Investasi", href: "/admin/dashboard/invest", icon: PieChartIcon },
            { name: "Data Peta", href: "/maps", icon: MapIcon },
            { name: "Pengaturan", href: "/admin/dashboard/settings", icon: SettingsIcon },
        ]
    }
}
