"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Clock, ArrowRight, Wallet, Activity } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bonjour, Investor</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back to your investment overview
                    </p>
                </div>
                <Button asChild>
                    <Link href="/">
                        Explore Map <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 12.5M</div>
                        <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saved Locations</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">Across 3 regencies</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">Updated 2 hours ago</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Recent Activity */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your recent interactions with the investment map.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {[
                                { title: "Viewed Medan Investment Zone", time: "2 hours ago", icon: MapPin },
                                { title: "Downloaded ROI Report", time: "5 hours ago", icon: TrendingUp },
                                { title: "Updated Profile Information", time: "1 day ago", icon: Activity },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.time}</p>
                                    </div>
                                    <div className="ml-auto font-medium text-sm text-primary cursor-pointer hover:underline">
                                        View
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recommended Opportunities */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Opportunities</CardTitle>
                        <CardDescription>
                            AI-recommended zones based on your profile.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "Kawasan Industri Sei Mangkei", type: "Industrial", match: "98%" },
                            { name: "Danau Toba Tourism", type: "Tourism", match: "92%" },
                            { name: "Medan Tech Park", type: "Technology", match: "85%" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                                <div>
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.type}</p>
                                </div>
                                <div className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    {item.match}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
