"use client";

import { useState } from "react";
import { FiCheck, FiX, FiSearch, FiEye } from "react-icons/fi";

// Investment Application Type Definition
interface InvestmentApplication {
    id: string;
    applicantName: string;
    companyName: string;
    sector: string;
    location: string;
    investmentAmount: number; // in Billions IDR
    submissionDate: string;
    status: "Pending" | "Approved" | "Rejected";
}

// Dummy Data
const initialApplications: InvestmentApplication[] = [
    {
        id: "INV-2024-001",
        applicantName: "Budi Santoso",
        companyName: "PT. Maju Mundur",
        sector: "Infrastructure",
        location: "Medan",
        investmentAmount: 50.5,
        submissionDate: "2024-01-15",
        status: "Pending",
    },
    {
        id: "INV-2024-002",
        applicantName: "Alice Wonderland",
        companyName: "Green Energy Corp",
        sector: "Renewable Energy",
        location: "Deli Serdang",
        investmentAmount: 120.0,
        submissionDate: "2024-01-18",
        status: "Approved",
    },
    {
        id: "INV-2024-003",
        applicantName: "John Doe",
        companyName: "Doe Agrotech",
        sector: "Agriculture",
        location: "Karo",
        investmentAmount: 15.2,
        submissionDate: "2024-01-20",
        status: "Rejected",
    },
    {
        id: "INV-2024-004",
        applicantName: "Siti Aminah",
        companyName: "Sumut Tourism",
        sector: "Tourism",
        location: "Samosir",
        investmentAmount: 8.5,
        submissionDate: "2024-01-22",
        status: "Pending",
    },
    {
        id: "INV-2024-005",
        applicantName: "Robert Chen",
        companyName: "Tech Solutions",
        sector: "Technology",
        location: "Binjai",
        investmentAmount: 30.0,
        submissionDate: "2024-01-25",
        status: "Pending",
    },
];

export default function InvestmentPage() {
    const [applications, setApplications] = useState<InvestmentApplication[]>(initialApplications);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");

    const filteredApplications = applications.filter((app) => {
        const matchesSearch =
            app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = statusFilter === "All" || app.status === statusFilter;

        return matchesSearch && matchesFilter;
    });

    const handleApprove = (id: string) => {
        if (confirm("Are you sure you want to approve this application?")) {
            setApplications(applications.map(app => app.id === id ? { ...app, status: "Approved" } : app));
        }
    };

    const handleReject = (id: string) => {
        if (confirm("Are you sure you want to reject this application?")) {
            setApplications(applications.map(app => app.id === id ? { ...app, status: "Rejected" } : app));
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 1,
        }).format(amount) + " M";
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-900">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Investment Applications</h1>
                    <p className="text-slate-500 mt-1">Review and manage incoming investment proposals.</p>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-3 w-full md:w-96 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                        <FiSearch className="text-slate-400 text-lg" />
                        <input
                            type="text"
                            placeholder="Search by company or applicant..."
                            className="flex-1 bg-transparent border-none outline-none text-slate-700 text-sm placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {["All", "Pending", "Approved", "Rejected"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${statusFilter === status
                                    ? "bg-slate-800 text-white shadow-md"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="p-5 font-semibold text-slate-600 text-sm tracking-wide">Application ID</th>
                                    <th className="p-5 font-semibold text-slate-600 text-sm tracking-wide">Company & Applicant</th>
                                    <th className="p-5 font-semibold text-slate-600 text-sm tracking-wide">Sector & Location</th>
                                    <th className="p-5 font-semibold text-slate-600 text-sm tracking-wide">Amount</th>
                                    <th className="p-5 font-semibold text-slate-600 text-sm tracking-wide">Status</th>
                                    <th className="p-5 font-semibold text-slate-600 text-sm tracking-wide text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.length > 0 ? (
                                    filteredApplications.map((app) => (
                                        <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-5 text-slate-500 font-mono text-xs">{app.id}</td>
                                            <td className="p-5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800">{app.companyName}</span>
                                                    <span className="text-sm text-slate-500">{app.applicantName}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-800 text-sm font-medium">{app.sector}</span>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        📍 {app.location}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-5 font-medium text-slate-700">
                                                {formatCurrency(app.investmentAmount)}
                                            </td>
                                            <td className="p-5">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${app.status === "Approved"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : app.status === "Rejected"
                                                            ? "bg-red-50 text-red-700 border-red-200"
                                                            : "bg-amber-50 text-amber-700 border-amber-200"
                                                        }`}
                                                >
                                                    {app.status === "Approved" && <FiCheck size={12} />}
                                                    {app.status === "Rejected" && <FiX size={12} />}
                                                    {app.status === "Pending" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {app.status === "Pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(app.id)}
                                                                className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                                                                title="Approve"
                                                            >
                                                                <FiCheck size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(app.id)}
                                                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                                title="Reject"
                                                            >
                                                                <FiX size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <FiEye size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-10 text-center text-slate-500">
                                            No applications found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
