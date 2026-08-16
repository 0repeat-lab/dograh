"use client";

import { Plus, Megaphone, Rocket, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { getCampaignsApiV1CampaignGet } from '@/client/sdk.gen';
import type { CampaignsResponse } from '@/client/types.gen';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useOrganizationTimezone } from '@/hooks/useOrganizationTimezone';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/dateTime';

export default function CampaignsPage() {
    const { user, getAccessToken, redirectToLogin, loading } = useAuth();
    const organizationTimezone = useOrganizationTimezone();
    const router = useRouter();

    const [campaignsData, setCampaignsData] = useState<CampaignsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const hasFetched = useRef(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            redirectToLogin();
        }
    }, [loading, user, redirectToLogin]);

    // Fetch campaigns once when user is ready
    useEffect(() => {
        if (loading || !user || hasFetched.current) {
            return;
        }
        hasFetched.current = true;

        const fetchCampaigns = async () => {
            setIsLoading(true);
            try {
                const accessToken = await getAccessToken();
                const response = await getCampaignsApiV1CampaignGet({
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });

                if (response.data) {
                    setCampaignsData(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch campaigns:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCampaigns();
    }, [loading, user, getAccessToken]);

    const handleRowClick = (campaignId: number) => {
        router.push(`/campaigns/${campaignId}`);
    };

    const handleCreateCampaign = () => {
        router.push('/campaigns/new');
    };

    const getStateBadgeVariant = (state: string) => {
        switch (state) {
            case 'created':
                return 'secondary';
            case 'running':
                return 'default';
            case 'paused':
                return 'outline';
            case 'completed':
                return 'secondary';
            case 'failed':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-7xl">
            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 rounded-3xl blur-3xl" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                        <Megaphone className="h-5 w-5 text-purple-500" />
                        <div className="nexus-metric text-purple-500">BULK EXECUTION</div>
                    </div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                                Campaigns
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl">
                                Manage bulk workflow execution campaigns at scale
                            </p>
                        </div>
                        <Button onClick={handleCreateCampaign} className="rounded-xl shadow-lg">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Campaign
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {campaignsData && campaignsData.campaigns.length > 0 && (
                    <>
                        <Card className="card-weave border-border/60 bg-gradient-to-br from-blue-500/5 to-transparent">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <Rocket className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{campaignsData.campaigns.length}</div>
                                        <div className="text-sm text-muted-foreground">Total Campaigns</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="card-weave border-border/60 bg-gradient-to-br from-green-500/5 to-transparent">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                        <PlayCircle className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">
                                            {campaignsData.campaigns.filter(c => c.state === 'running').length}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Active Now</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="card-weave border-border/60 bg-gradient-to-br from-purple-500/5 to-transparent">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <Megaphone className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">
                                            {campaignsData.campaigns.filter(c => c.state === 'completed').length}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Completed</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Campaigns Table */}
            <Card className="card-weave border-border/60">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Megaphone className="h-5 w-5" />
                        All Campaigns
                    </CardTitle>
                    <CardDescription>
                        View and manage your campaigns
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="animate-pulse space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-muted rounded"></div>
                            ))}
                        </div>
                    ) : campaignsData && campaignsData.campaigns.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Workflow</TableHead>
                                        <TableHead>State</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {campaignsData.campaigns.map((campaign) => (
                                        <TableRow
                                            key={campaign.id}
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => handleRowClick(campaign.id)}
                                        >
                                            <TableCell className="font-mono text-sm">#{campaign.id}</TableCell>
                                            <TableCell className="font-medium">{campaign.name}</TableCell>
                                            <TableCell>{campaign.workflow_name}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStateBadgeVariant(campaign.state)} className="rounded-full">
                                                    {campaign.state}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-cta to-cta/70 transition-all"
                                                            style={{
                                                                width: `${(campaign.executed_count / campaign.total_queued_count) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {campaign.executed_count} / {campaign.total_queued_count}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(campaign.created_at, organizationTimezone)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-lg"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRowClick(campaign.id);
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                                <Megaphone className="h-8 w-8 text-purple-500" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
                            <p className="text-muted-foreground mb-4">Create your first campaign to start bulk execution</p>
                            <Button onClick={handleCreateCampaign} variant="outline" className="rounded-xl">
                                <Plus className="h-4 w-4 mr-2" />
                                Create your first campaign
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
