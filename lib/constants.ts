import { FileTextIcon, LayoutDashboardIcon, MapIcon, PieChartIcon, UsersIcon, Briefcase } from "lucide-react";
import { FiActivity } from "react-icons/fi";


export const NAVIGATION_CONFIG = {
    user: {
        name: "Area Investor",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
            { name: "Profil Saya", href: "/dashboard/profile", icon: UsersIcon },
            // { name: "Simulasi Investasi", href: "/dashboard/simulation", icon: FiActivity },
            // { name: "Ajukan Proposal", href: "/dashboard/proposal", icon: FileTextIcon },
        ]
    },
    operator: {
        name: "Area Operator",
        items: [
            { name: "Dashboard Operator", href: "/operator/dashboard", icon: LayoutDashboardIcon },
            { name: "Data Wilayah", href: "/operator/wilayah", icon: MapIcon },
            { name: "Data PDRB", href: "/operator/pdrb", icon: PieChartIcon },
        ]
    },
    admin: {
        name: "Area Admin",
        items: [
            { name: "Dashboard Admin", href: "/admin/dashboard", icon: LayoutDashboardIcon },
            { name: "Data Pengguna", href: "/admin/dashboard/users", icon: UsersIcon },
            { name: "Data Wilayah", href: "/admin/dashboard/wilayah", icon: MapIcon },
            { name: "Data PDRB", href: "/admin/dashboard/pdrb", icon: PieChartIcon },
        ]
    }
}

