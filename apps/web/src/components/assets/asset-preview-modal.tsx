import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Badge } from "@autism-legacy-20260205/ui";
import { Copy, Sparkles, Download, X } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Asset {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    tags: string[];
    createdAt: string;
}

interface AssetPreviewModalProps {
    asset: Asset | null;
    isOpen: boolean;
    onClose: () => void;
    onGenerateTags?: (id: string) => void;
    isGeneratingTags?: boolean;
}

export function AssetPreviewModal({
    asset,
    isOpen,
    onClose,
    onGenerateTags,
    isGeneratingTags,
}: AssetPreviewModalProps) {
    if (!asset) return null;

    const handleShare = () => {
        navigator.clipboard.writeText(asset.url);
        toast.success("Asset URL copied to clipboard");
    };

    const isImage = asset.type.startsWith("image/");

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
                <div className="flex flex-col md:flex-row h-[600px]">
                    {/* Preview Area */}
                    <div className="flex-1 bg-gray-900 flex items-center justify-center p-8 relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="icon" onClick={() => window.open(asset.url, '_blank')}>
                                <Download className="w-4 h-4" />
                            </Button>
                        </div>
                        {isImage ? (
                            <motion.img
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={asset.url}
                                alt={asset.name}
                                className="max-w-full max-h-full object-contain rounded-md shadow-lg"
                            />
                        ) : (
                            <div className="text-white text-center">
                                <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl font-bold text-white/50">{asset.type.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                                </div>
                                <p className="text-lg font-medium">{asset.name}</p>
                                <p className="text-sm text-gray-400">{(asset.size / 1024).toFixed(2)} KB</p>
                            </div>
                        )}
                    </div>

                    {/* Details Sidebar */}
                    <div className="w-full md:w-80 border-l border-gray-100 bg-white p-6 flex flex-col">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-xl font-bold truncate pr-8" title={asset.name}>
                                {asset.name}
                            </DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                Added {new Date(asset.createdAt).toLocaleDateString()}
                            </p>
                        </DialogHeader>

                        <div className="space-y-6 flex-1 overflow-y-auto">
                            {/* Tags Section */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-gray-900">Tags</h3>
                                    {onGenerateTags && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onGenerateTags(asset.id)}
                                            disabled={isGeneratingTags}
                                            className="h-7 text-xs gap-1.5"
                                        >
                                            <Sparkles className="w-3 h-3 text-purple-600" />
                                            {isGeneratingTags ? "Analyzing..." : "AI Tag"}
                                        </Button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {asset.tags.length > 0 ? (
                                        asset.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="px-2 py-1 rounded-md">
                                                {tag}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No tags yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                                    <p className="text-sm font-medium text-gray-900 truncate" title={asset.type}>
                                        {asset.type}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Size</label>
                                    <p className="text-sm font-medium text-gray-900">
                                        {(asset.size / 1024).toFixed(0)} KB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                            <Button onClick={handleShare} className="flex-1 gap-2" variant="default">
                                <Copy className="w-4 h-4" />
                                Share Asset
                            </Button>
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
