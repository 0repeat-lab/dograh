"use client";

import Link from 'next/link';
import { Workflow, Brain, Wrench, Phone, Database, FileText, TrendingUp, ArrowRight, Github, MessageSquare, BookOpen, Bug } from 'lucide-react';

import { GitHubStarBadge } from '@/components/layout/GitHubStarBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default function OverviewPage() {
    const { user, provider } = useAuth();
    const isOSSMode = provider !== 'stack';

    const quickActions = [
        {
            title: "Voice Agents",
            description: "Build powerful AI Voice Agents with our visual editor",
            icon: Workflow,
            href: "/workflow",
            gradient: "from-blue-500/10 to-cyan-500/10"
        },
        {
            title: "Models",
            description: "Configure LLM, TTS, and STT providers",
            icon: Brain,
            href: "/model-configurations",
            gradient: "from-purple-500/10 to-pink-500/10"
        },
        {
            title: "Telephony",
            description: "Set up phone numbers and call routing",
            icon: Phone,
            href: "/telephony-configurations",
            gradient: "from-green-500/10 to-emerald-500/10"
        },
        {
            title: "Tools",
            description: "Add custom tools and integrations",
            icon: Wrench,
            href: "/tools",
            gradient: "from-orange-500/10 to-red-500/10"
        },
        {
            title: "Files",
            description: "Manage audio files and recordings",
            icon: Database,
            href: "/files",
            gradient: "from-indigo-500/10 to-violet-500/10"
        },
        {
            title: "Agent Runs",
            description: "View analytics and call history",
            icon: TrendingUp,
            href: "/usage",
            gradient: "from-teal-500/10 to-cyan-500/10"
        },
    ];

    const resources = [
        { title: "Documentation", description: "Learn how to use Dograh", icon: BookOpen, href: "https://docs.dograh.com" },
        { title: "Community", description: "Join our Slack community", icon: MessageSquare, href: "https://join.slack.com/t/dograh-community/shared_invite/zt-3zjb5vwvl-j7hRz3_F1SOn5cH~jm5f5g" },
        { title: "Report Issue", description: "Report bugs on GitHub", icon: Bug, href: "https://github.com/dograh-hq/dograh/issues" },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="space-y-8">
                {/* Hero Welcome Section */}
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-8 md:p-12">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cta/5 to-transparent rounded-full blur-3xl" />
                    <div className="relative">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            {isOSSMode ? (
                                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Welcome to Dograh
                                </span>
                            ) : (
                                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Welcome{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!
                                </span>
                            )}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
                            {isOSSMode ? (
                                "Open source alternative to Vapi. Build, deploy, and scale voice AI agents with full control."
                            ) : (
                                "Get started with building voice AI workflows"
                            )}
                        </p>
                        {isOSSMode && (
                            <div className="flex items-center gap-4">
                                <GitHubStarBadge label="Star us on GitHub" showCount source="overview_page" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions Bento Grid */}
                <div>
                    <h2 className="nexus-metric text-muted-foreground mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link key={action.href} href={action.href}>
                                    <Card className="card-weave group h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer border-border/60">
                                        <CardHeader className="space-y-3">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                                                action.gradient
                                            )}>
                                                <Icon className="h-6 w-6 text-foreground" />
                                            </div>
                                            <CardTitle className="text-lg">{action.title}</CardTitle>
                                            <CardDescription className="text-sm">
                                                {action.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                <span>Get started</span>
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Resources Section */}
                <div>
                    <h2 className="nexus-metric text-muted-foreground mb-6">Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {resources.map((resource) => {
                            const Icon = resource.icon;
                            return (
                                <a
                                    key={resource.href}
                                    href={resource.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Card className="card-weave group h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer border-border/60">
                                        <CardHeader className="space-y-3">
                                            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-cta/20 transition-colors">
                                                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-cta transition-colors" />
                                            </div>
                                            <CardTitle className="text-base">{resource.title}</CardTitle>
                                            <CardDescription className="text-xs">
                                                {resource.description}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
