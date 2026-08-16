import { Suspense } from 'react';
import { Bot, Sparkles, Zap } from 'lucide-react';

import { getWorkflowsApiV1WorkflowFetchGet, listFoldersApiV1FolderGet } from '@/client/sdk.gen';
import type { FolderResponse, WorkflowListResponse } from '@/client/types.gen';
import { Card, CardContent } from '@/components/ui/card';
import { CreateWorkflowButton } from "@/components/workflow/CreateWorkflowButton";
import { AgentFolderView } from '@/components/workflow/folders/AgentFolderView';
import { CreateFolderButton } from '@/components/workflow/folders/CreateFolderButton';
import { FolderSection } from '@/components/workflow/folders/FolderSection';
import { UploadWorkflowButton } from '@/components/workflow/UploadWorkflowButton";
import { getServerAccessToken, getServerAuthProvider } from '@/lib/auth/server';
import logger from '@/lib/logger';

import WorkflowLayout from "./WorkflowLayout";

export const dynamic = 'force-dynamic';

// Server component for workflow list
async function WorkflowList() {
    const authProvider = await getServerAuthProvider();
    const accessToken = await getServerAccessToken();

    if (!accessToken) {
        // If no token, user needs to sign in
        const { redirect } = await import('next/navigation');
        if (authProvider === 'stack') {
            redirect('/');
        } else {
            // For OSS mode, this shouldn't happen as token is auto-generated
            return (
                <div className="text-red-500">
                    Authentication required. Please refresh the page.
                </div>
            );
        }
    }

    try {
        // Fetch both active and archived workflows in a single request
        const response = await getWorkflowsApiV1WorkflowFetchGet({
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            query: {
                status: 'active,archived'
            }
        });

        const allWorkflowData = response.data ? (Array.isArray(response.data) ? response.data : [response.data]) : [];

        // Separate active and archived workflows
        const activeWorkflows = allWorkflowData
            .filter((w: WorkflowListResponse) => w.status === 'active')
            .sort((a: WorkflowListResponse, b: WorkflowListResponse) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const archivedWorkflows = allWorkflowData
            .filter((w: WorkflowListResponse) => w.status === 'archived')
            .sort((a: WorkflowListResponse, b: WorkflowListResponse) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Fetch folders for grouping active agents. A failure here shouldn't
        // break the page — fall back to an empty list (flat, ungrouped view).
        let folders: FolderResponse[] = [];
        try {
            const foldersResponse = await listFoldersApiV1FolderGet({
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            folders = foldersResponse.data ?? [];
        } catch (folderErr) {
            logger.error(`Error fetching folders: ${folderErr}`);
        }

        return (
            <>
                {/* Active Workflows Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="nexus-metric text-muted-foreground">VOICE AGENTS</div>
                        <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
                    </div>
                    <h2 className="text-3xl font-bold mb-6 tracking-tight flex items-center gap-3">
                        <Bot className="h-8 w-8 text-cta" />
                        Active Agents
                        <Sparkles className="h-6 w-6 text-yellow-500" />
                    </h2>
                    {activeWorkflows.length > 0 || folders.length > 0 ? (
                        <AgentFolderView workflows={activeWorkflows} folders={folders} />
                    ) : (
                        <Card className="card-weave border-border/60 bg-gradient-to-br from-card to-card/50">
                            <CardContent className="p-12 text-center">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cta/20 to-cta/5 flex items-center justify-center">
                                        <Bot className="h-8 w-8 text-cta" />
                                    </div>
                                    <h3 className="text-xl font-semibold">No active agents yet</h3>
                                    <p className="text-muted-foreground">Create your first voice agent to get started with Dograh</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Archived Section — collapsible, same design as the folder/Uncategorized sections */}
                {archivedWorkflows.length > 0 && (
                    <div className="mb-8">
                        <FolderSection kind="archived" workflows={archivedWorkflows} />
                    </div>
                )}
            </>
        );
    } catch (err) {
        logger.error(`Error fetching workflows: ${err}`);
        return (
            <div className="text-red-500">
                Failed to load Workflows. Please Try Again Later.
            </div>
        );
    }
}

async function PageContent() {

    const workflowList = await WorkflowList();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Hero Section */}
            <div className="mb-12 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cta/5 via-transparent to-cta/5 rounded-3xl" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="h-5 w-5 text-cta" />
                        <div className="nexus-metric text-cta">WORKFLOW BUILDER</div>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                        Your Voice Agents
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Create and manage AI-powered voice agents with our visual workflow builder
                    </p>
                </div>
            </div>

            {/* Your Workflows Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 bg-gradient-to-b from-cta to-cta/50 rounded-full" />
                        <h2 className="text-2xl font-semibold tracking-tight">Agent Library</h2>
                    </div>
                    <div className="flex gap-2">
                        <UploadWorkflowButton />
                        <CreateFolderButton />
                        <CreateWorkflowButton />
                    </div>
                </div>
                {workflowList}
            </div>
        </div>
    );
}

function WorkflowsLoading() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Hero Loading */}
            <div className="mb-12">
                <div className="h-8 w-48 bg-muted/50 rounded mb-4"></div>
                <div className="h-12 w-96 bg-muted/30 rounded mb-3"></div>
                <div className="h-6 w-64 bg-muted/20 rounded"></div>
            </div>

            {/* Cards Loading */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }, (_, i) => (
                    <Card key={i} className="card-weave border-border/60">
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <div className="h-4 w-32 bg-muted/50 rounded"></div>
                                <div className="h-3 w-full bg-muted/30 rounded"></div>
                                <div className="h-3 w-2/3 bg-muted/30 rounded"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default function WorkflowPage() {
    return (
        <WorkflowLayout showFeaturesNav={true}>
            <Suspense fallback={<WorkflowsLoading />}>
                <PageContent />
            </Suspense>
        </WorkflowLayout>

    );
}
