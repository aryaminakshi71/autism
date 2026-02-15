/**
 * Assets Route
 *
 * Digital asset management with AI tagging.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
    Card,
    CardContent,
    Button,
    EmptyState,
    Loading,
    Badge,
} from "@autism-legacy-20260205/ui";
import { Plus, Image as ImageIcon, FileText, Search, Sparkles } from "lucide-react";
import { assetsApi } from "../lib/api";
import { toast } from "sonner";
import { AssetPreviewModal } from "../components/assets/asset-preview-modal";

export const Route = createFileRoute("/app/assets")({
    component: AssetsPage,
});

function AssetsPage() {
    const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["assets"],
        queryFn: () => assetsApi.list(),
    });

    const uploadMutation = useMutation({
        mutationFn: () => {
            // simulate upload
            const types = ["image/jpeg", "image/png", "application/pdf"];
            const names = ["project-brief.pdf", "design-mockup.png", "meeting-notes.pdf", "site-photo.jpg"];
            const randomType = types[Math.floor(Math.random() * types.length)];
            const randomName = names[Math.floor(Math.random() * names.length)];

            return assetsApi.create({
                name: randomName,
                type: randomType,
                size: Math.floor(Math.random() * 5000000),
            });
        },
        onSuccess: () => {
            toast.success("Asset uploaded successfully");
            queryClient.invalidateQueries({ queryKey: ["assets"] });
        },
        onError: (error) => {
            console.error("Upload failed", error);
            toast.error(`Upload failed: ${error.message}`);
        }
    });

    const generateTagsMutation = useMutation({
        mutationFn: (id: string) => assetsApi.generateTags(id),
        onSuccess: (data, variables) => {
            toast.success("AI Tags generated!");
            queryClient.invalidateQueries({ queryKey: ["assets"] });

            // Update selected asset if open
            if (selectedAsset && selectedAsset.id === variables) {
                setSelectedAsset({ ...selectedAsset, tags: data.tags });
            }
        },
        onError: (error) => {
            console.error("Tag generation failed", error);
            toast.error(`Tag generation failed: ${error.message}`);
        }
    });

    const handleAssetClick = (asset: any) => {
        setSelectedAsset(asset);
        setIsPreviewOpen(true);
    };

    const assets = data?.items || [];

    if (isLoading) {
        return <Loading text="Loading assets..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
                    <p className="text-gray-500">Manage files and documents with AI insights</p>
                </div>
                <Button
                    variant="primary"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => uploadMutation.mutate()}
                    loading={uploadMutation.isPending}
                >
                    Upload Asset
                </Button>
            </div>

            {assets.length === 0 ? (
                <EmptyState
                    icon={<ImageIcon className="w-12 h-12" />}
                    title="No assets yet"
                    description="Upload files to get started with AI tagging."
                    action={{
                        label: "Upload Mock Asset",
                        onClick: () => uploadMutation.mutate()
                    }}
                />
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {assets.map((asset: any) => (
                        <Card
                            key={asset.id}
                            className="cursor-pointer group hover:shadow-md transition-all overflow-hidden border-2 border-transparent hover:border-blue-500/20"
                            onClick={() => handleAssetClick(asset)}
                        >
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                {asset.type.startsWith("image/") ? (
                                    <img
                                        src={asset.url}
                                        alt={asset.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <FileText className="w-16 h-16" />
                                    </div>
                                )}

                                {asset.tags.length > 0 && (
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="secondary" className="bg-white/90 backdrop-blur shadow-sm text-xs py-0.5 h-5">
                                            <Sparkles className="w-3 h-3 mr-1 text-purple-600" />
                                            {asset.tags.length}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                            <div className="p-3">
                                <p className="font-medium text-sm text-gray-900 truncate" title={asset.name}>
                                    {asset.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                                    {asset.type.split('/')[1]} • {(asset.size / 1024).toFixed(0)} KB
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <AssetPreviewModal
                asset={selectedAsset}
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                onGenerateTags={(id) => generateTagsMutation.mutate(id)}
                isGeneratingTags={generateTagsMutation.isPending}
            />
        </div>
    );
}
