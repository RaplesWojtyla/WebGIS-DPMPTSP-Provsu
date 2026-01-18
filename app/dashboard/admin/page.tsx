"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, AlertCircle, TrendingUp, Layers, Download, CheckCircle, XCircle } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage users, map data, and system analytics.
                    </p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 w-4 h-4" />
                    Export Report
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">+180 this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Map Layers</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">All active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Healthy</div>
                        <p className="text-xs text-muted-foreground">99.9% Uptime</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Content Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Recent Registrations Table */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Registrations</CardTitle>
                        <CardDescription>
                            New users joined in the last 24 hours.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "PT. Maju Bersama", email: "contact@majubersama.com", type: "Corporate", status: "Verified" },
                                { name: "John Doe", email: "john@gmail.com", type: "Individual", status: "Pending" },
                                { name: "Sumatra Estates", email: "info@sumatraestates.id", type: "Corporate", status: "Verified" },
                                { name: "Sarah Smith", email: "sarah.s@outlook.com", type: "Individual", status: "Verified" },
                            ].map((user, i) => (
                                <div key={i} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs px-2 py-1 rounded-full ${user.status === "Verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {user.status}
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-1">{user.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Management</CardTitle>
                        <CardDescription>
                            Common administrative tasks.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                            <Layers className="mr-2 h-4 w-4" /> Update Map Data
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <Users className="mr-2 h-4 w-4" /> Manage User Roles
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <TrendingUp className="mr-2 h-4 w-4" /> Configure AI Models
                        </Button>
                        <Button variant="destructive" className="w-full justify-start mt-4">
                            <XCircle className="mr-2 h-4 w-4" /> Clear System Cache
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
