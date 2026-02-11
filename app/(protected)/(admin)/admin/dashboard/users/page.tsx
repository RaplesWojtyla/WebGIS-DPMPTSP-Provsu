"use client"

import React, { useState, useEffect, useTransition, useMemo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    MoreHorizontal,
    Mail,
    Filter,
    Loader2,
    Shield,
    UserX,
    UserCheck,
    Trash2,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react"
import { toast } from "sonner"

import {
    getAllUsers,
    updateUserRole,
    suspendUser,
    unsuspendUser,
    deleteUser
} from "@/lib/actions/user.actions"
import UsersAdminSkeleton from "@/components/skeleton/UsersAdminSkeleton"

const ITEMS_PER_PAGE = 10


export default function UsersPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    const [users, setUsers] = useState<UserData[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)


    const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
    const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [newRole, setNewRole] = useState<string>("")

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        // setIsLoading(true) - already set to true initially, but good to keep if reloading
        // But for initial load, we want to show skeleton.
        // The skeleton covers the whole page, so we return it early.
        setIsLoading(true)

        const result = await getAllUsers()

        if (result.success && result.data) {
            setUsers(result.data as UserData[])
        } else {
            toast.error(result.error || "Gagal memuat data pengguna")
        }

        setIsLoading(false)
    }



    // Filter and Search
    const filteredUsers = useMemo(() => {
        return users
            .filter(u => roleFilter === 'all' || u.role === roleFilter)
            .filter(u =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
    }, [users, roleFilter, searchTerm])

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    // Helpers
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Admin</Badge>
            case 'operator':
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Operator</Badge>
            default:
                return <Badge className="bg-gray-100 text-gray-600 border-gray-200">User</Badge>
        }
    }

    const getStatusBadge = (user: UserData) => {
        if (user.suspended) {
            return (
                <Badge className="bg-red-100 text-red-700 border-red-200">
                    <XCircle className="w-3 h-3 mr-1" /> Suspended
                </Badge>
            )
        }

        if (user.emailVerified) {
            return (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" /> Aktif
                </Badge>
            )
        }

        return (
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                <Clock className="w-3 h-3 mr-1" /> Belum Verifikasi
            </Badge>
        )
    }

    const handleRoleClick = (user: UserData) => {
        setSelectedUser(user)
        setNewRole(user.role)
        setIsRoleDialogOpen(true)
    }

    const handleSuspendClick = (user: UserData) => {
        setSelectedUser(user)
        setIsSuspendDialogOpen(true)
    }

    const handleDeleteClick = (user: UserData) => {
        setSelectedUser(user)
        setIsDeleteDialogOpen(true)
    }

    const confirmRoleChange = () => {
        if (!selectedUser || !newRole) return

        startTransition(async () => {
            const result = await updateUserRole(selectedUser.id, newRole as 'user' | 'operator' | 'admin')

            if (result.success) {
                toast.success(`Role ${selectedUser.name} diubah ke ${newRole}`)
                loadUsers()
            } else {
                toast.error(result.error || "Gagal mengubah role")
            }

            setIsRoleDialogOpen(false)
            setSelectedUser(null)
        })
    }

    const confirmSuspend = () => {
        if (!selectedUser) return

        startTransition(async () => {
            const action = selectedUser.suspended ? unsuspendUser : suspendUser
            const result = await action(selectedUser.id)

            if (result.success) {
                toast.success(
                    selectedUser.suspended
                        ? `${selectedUser.name} diaktifkan kembali`
                        : `${selectedUser.name} di-suspend`
                )
                loadUsers()
            } else {
                toast.error(result.error || "Gagal mengubah status")
            }

            setIsSuspendDialogOpen(false)
            setSelectedUser(null)
        })
    }

    const confirmDelete = () => {
        if (!selectedUser) return

        startTransition(async () => {
            const result = await deleteUser(selectedUser.id)

            if (result.success) {
                toast.success(`Akun ${selectedUser.name} dihapus`)
                loadUsers()
            } else {
                toast.error(result.error || "Gagal menghapus akun")
            }

            setIsDeleteDialogOpen(false)
            setSelectedUser(null)
        })
    }

    // Stats
    const stats = useMemo(() => {
        const total = users.length
        const admins = users.filter(u => u.role === 'admin').length
        const operators = users.filter(u => u.role === 'operator').length
        const suspended = users.filter(u => u.suspended).length
        return { total, admins, operators, suspended }
    }, [users])

    if (isLoading) {
        return <UsersAdminSkeleton />
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
                <p className="text-muted-foreground">Kelola data pengguna, role, dan status akun.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <div className="text-sm text-gray-500">Total Pengguna</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl shadow-sm border border-purple-100">
                    <div className="text-sm text-purple-600">Admin</div>
                    <div className="text-2xl font-bold text-purple-700">{stats.admins}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
                    <div className="text-sm text-blue-600">Operator</div>
                    <div className="text-2xl font-bold text-blue-700">{stats.operators}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
                    <div className="text-sm text-red-600">Suspended</div>
                    <div className="text-2xl font-bold text-red-700">{stats.suspended}</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Role</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="operator">Operator</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="relative w-full sm:w-[280px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Cari nama atau email..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[50px] text-center">No</TableHead>
                            <TableHead>Pengguna</TableHead>
                            <TableHead className="text-center">Role</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Terdaftar</TableHead>
                            <TableHead className="text-center w-[100px]">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsers.map((user, index) => (
                            <TableRow key={user.id} className="hover:bg-gray-50">
                                <TableCell className="text-center text-gray-500">
                                    {startIndex + index + 1}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name}</span>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Mail className="h-3 w-3 mr-1" />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {getRoleBadge(user.role)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {getStatusBadge(user)}
                                </TableCell>
                                <TableCell className="text-center text-sm text-gray-500">
                                    {formatDate(user.createdAt)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleRoleClick(user)}>
                                                <Shield className="mr-2 h-4 w-4" /> Ubah Role
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleSuspendClick(user)}>
                                                {user.suspended ? (
                                                    <><UserCheck className="mr-2 h-4 w-4" /> Aktifkan</>
                                                ) : (
                                                    <><UserX className="mr-2 h-4 w-4" /> Suspend</>
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => handleDeleteClick(user)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {paginatedUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                                    {users.length === 0
                                        ? "Belum ada data pengguna"
                                        : "Tidak ada pengguna yang sesuai filter"
                                    }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>


                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t bg-gray-50/50">
                    <div className="text-sm text-gray-500">
                        Menampilkan <span className="font-medium">{Math.min(startIndex + 1, filteredUsers.length)}</span> - <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)}</span> dari <span className="font-medium">{filteredUsers.length}</span> pengguna
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm mx-2">{currentPage} / {totalPages || 1}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage >= totalPages}>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Change Role Dialog */}
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ubah Role Pengguna</DialogTitle>
                        <DialogDescription>
                            Pilih role baru untuk <strong>{selectedUser?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="role">Role</Label>
                        <Select value={newRole} onValueChange={setNewRole}>
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Pilih Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="operator">Operator</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)} disabled={isPending}>
                            Batal
                        </Button>
                        <Button onClick={confirmRoleChange} disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Suspend/Unsuspend Dialog */}
            <AlertDialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {selectedUser?.suspended ? "Aktifkan Pengguna?" : "Suspend Pengguna?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedUser?.suspended
                                ? `Akun ${selectedUser?.name} akan diaktifkan kembali dan dapat login.`
                                : `Akun ${selectedUser?.name} akan di-suspend dan tidak dapat login.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmSuspend}
                            className={selectedUser?.suspended ? "!bg-blue-600 hover:!bg-blue-700 text-white" : "bg-yellow-400 hover:bg-yellow-500"}
                            disabled={isPending}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {selectedUser?.suspended ? "Aktifkan" : "Suspend"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Akun Pengguna?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Akun <strong>{selectedUser?.name}</strong> ({selectedUser?.email}) akan dihapus permanen dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isPending}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Hapus Akun
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}
