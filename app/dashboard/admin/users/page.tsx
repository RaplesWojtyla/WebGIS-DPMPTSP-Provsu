"use client";

import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiUsers, FiFilter, FiCheckCircle } from "react-icons/fi";

// User Type Definition
interface User {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "User" | "Investor";
    status: "Active" | "Inactive";
    joinDate: string;
}

// Dummy Data
const initialUsers: User[] = [
    { id: 1, name: "Admin Utama", email: "admin@provsu.go.id", role: "Admin", status: "Active", joinDate: "2023-01-01" },
    { id: 2, name: "PT. Sawit Jaya", email: "contact@sawitjaya.com", role: "Investor", status: "Active", joinDate: "2023-05-12" },
    { id: 3, name: "Budi Santoso", email: "budi.s@gmail.com", role: "User", status: "Inactive", joinDate: "2023-08-20" },
    { id: 4, name: "CV. Nelayan Makmur", email: "info@nelayanmakmur.id", role: "Investor", status: "Active", joinDate: "2023-11-05" },
    { id: 5, name: "Dina Pertiwi", email: "dina.p@outlook.com", role: "User", status: "Active", joinDate: "2024-01-15" },
    { id: 6, name: "Investor Asing Corp", email: "invest@corp.sg", role: "Investor", status: "Active", joinDate: "2024-02-01" },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Form State
    const [formData, setFormData] = useState<Omit<User, "id" | "joinDate">>({
        name: "",
        email: "",
        role: "User",
        status: "Active",
    });

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
        } else {
            setEditingUser(null);
            setFormData({ name: "", email: "", role: "User", status: "Active" });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            // Update existing user
            setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)));
        } else {
            // Add new user
            const newUser: User = {
                id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
                ...formData,
                joinDate: new Date().toISOString().split('T')[0]
            };
            setUsers([...users, newUser]);
        }
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
            setUsers(users.filter((user) => user.id !== id));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Manajemen Pengguna</h1>
                    <p className="text-slate-500 mt-1">Kelola data pengguna, hak akses, dan status akun.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-200 font-bold"
                >
                    <FiPlus size={20} />
                    Tambah Pengguna
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Pengguna</p>
                        <p className="text-3xl font-bold text-slate-800 mt-1">{users.length}</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FiUsers size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Investor Aktif</p>
                        <p className="text-3xl font-bold text-slate-800 mt-1">{users.filter(u => u.role === 'Investor' && u.status === 'Active').length}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><FiCheckCircle size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Menunggu Verifikasi</p>
                        <p className="text-3xl font-bold text-slate-800 mt-1">0</p>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><FiFilter size={24} /></div>
                </div>
            </div>

            {/* Search and Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Daftar Pengguna</h2>
                    <div className="relative w-full md:w-80">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs font-semibold tracking-wider">
                            <tr>
                                <th className="p-5">Pengguna</th>
                                <th className="p-5">Peran</th>
                                <th className="p-5">Status</th>
                                <th className="p-5">Tanggal Gabung</th>
                                <th className="p-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                user.role === 'Investor' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                                                <span className={`text-sm font-medium ${user.status === 'Active' ? 'text-green-700' : 'text-slate-500'}`}>
                                                    {user.status === 'Active' ? 'Aktif' : 'Non-Aktif'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm text-slate-500">
                                            {user.joinDate}
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-500">
                                        Tidak ada pengguna dengan kata kunci tersebut.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500 text-center">
                    Menampilkan {filteredUsers.length} dari {users.length} total pengguna
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">
                                {editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Alamat Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Contoh: john@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Peran (Role)</label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                                        value={formData.role}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, role: e.target.value as "Admin" | "User" | "Investor" })}
                                    >
                                        <option value="User">User</option>
                                        <option value="Investor">Investor</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Status Akun</label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                                        value={formData.status}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                                    >
                                        <option value="Active">Aktif</option>
                                        <option value="Inactive">Non-Aktif</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform active:scale-95"
                                >
                                    {editingUser ? "Simpan Perubahan" : "Buat Pengguna"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
