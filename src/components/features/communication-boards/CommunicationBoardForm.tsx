import { Button, Input } from "@/components/ui";
import {
  useCreateCommunicationBoard,
  useUpdateCommunicationBoard,
} from "@/lib/communication-boards";
import type {
  BoardCategory,
  CommunicationBoard,
  CommunicationItem,
} from "@/types/models";
import { useState } from "react";

interface CommunicationBoardFormProps {
  board?: CommunicationBoard;
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LAYOUT_OPTIONS = [
  { value: "grid", label: "Grid" },
  { value: "list", label: "List" },
  { value: "carousel", label: "Carousel" },
  { value: "hierarchical", label: "Hierarchical" },
];

export function CommunicationBoardForm({
  board,
  patientId,
  onSuccess,
  onCancel,
}: CommunicationBoardFormProps) {
  const [formData, setFormData] = useState<Partial<CommunicationBoard>>({
    patientId,
    name: board?.name || "",
    layout: board?.layout || "grid",
    categories: board?.categories || [],
    settings: board?.settings || {
      voiceType: "default",
      speechRate: 1,
      showLabels: true,
      imageSize: "medium",
      enableSound: true,
      progressDisplay: true,
    },
    isDefault: board?.isDefault || false,
  });

  const createBoard = useCreateCommunicationBoard();
  const updateBoard = useUpdateCommunicationBoard();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (board) {
      updateBoard.mutate(
        { id: board.id, data: formData },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        },
      );
    } else {
      createBoard.mutate(formData as Required<typeof formData>, {
        onSuccess: () => {
          onSuccess?.();
        },
      });
    }
  };

  const addCategory = () => {
    const newCategory: BoardCategory = {
      id: crypto.randomUUID(),
      name: "",
      items: [],
      order: formData.categories?.length || 0,
    };
    setFormData((prev) => ({
      ...prev,
      categories: [...(prev.categories || []), newCategory],
    }));
  };

  const updateCategory = (
    index: number,
    field: keyof BoardCategory,
    value: unknown,
  ) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories?.map((cat, i) =>
        i === index ? { ...cat, [field]: value } : cat,
      ),
    }));
  };

  const removeCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories
        ?.filter((_, i) => i !== index)
        .map((cat, i) => ({ ...cat, order: i })),
    }));
  };

  const addItem = (categoryIndex: number) => {
    const newItem: CommunicationItem = {
      id: crypto.randomUUID(),
      label: "",
      category: formData.categories?.[categoryIndex]?.name || "",
      isFrequent: false,
      order: formData.categories?.[categoryIndex]?.items?.length || 0,
    };
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories?.map((cat, i) =>
        i === categoryIndex
          ? { ...cat, items: [...(cat.items || []), newItem] }
          : cat,
      ),
    }));
  };

  const updateItem = (
    categoryIndex: number,
    itemIndex: number,
    field: keyof CommunicationItem,
    value: unknown,
  ) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories?.map((cat, ci) =>
        ci === categoryIndex
          ? {
              ...cat,
              items: cat.items?.map((item, ii) =>
                ii === itemIndex ? { ...item, [field]: value } : item,
              ),
            }
          : cat,
      ),
    }));
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories?.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              items: cat.items
                ?.filter((_, ii) => ii !== itemIndex)
                .map((item, ii) => ({ ...item, order: ii })),
            }
          : cat,
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Board Name</label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., Daily Needs"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Layout</label>
          <select
            value={formData.layout}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                layout: e.target.value as CommunicationBoard["layout"],
              }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {LAYOUT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isDefault: e.target.checked,
                }))
              }
              className="rounded border-gray-300"
            />
            <span className="text-sm">Set as Default Board</span>
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium">Categories</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addCategory}
            >
              + Add Category
            </Button>
          </div>
          <div className="space-y-3">
            {formData.categories?.map((category, categoryIndex) => (
              <div
                key={category.id}
                className="border rounded-lg p-3 bg-gray-50"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={category.name}
                      onChange={(e) =>
                        updateCategory(categoryIndex, "name", e.target.value)
                      }
                      placeholder="Category name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={category.icon || ""}
                        onChange={(e) =>
                          updateCategory(categoryIndex, "icon", e.target.value)
                        }
                        placeholder="Icon (optional)"
                      />
                      <Input
                        type="color"
                        value={category.color || "#3B82F6"}
                        onChange={(e) =>
                          updateCategory(categoryIndex, "color", e.target.value)
                        }
                        className="h-10"
                      />
                    </div>

                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Items</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addItem(categoryIndex)}
                        >
                          + Add Item
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {category.items?.map((item, itemIndex) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 bg-white p-2 rounded"
                          >
                            <Input
                              value={item.label}
                              onChange={(e) =>
                                updateItem(
                                  categoryIndex,
                                  itemIndex,
                                  "label",
                                  e.target.value,
                                )
                              }
                              placeholder="Item label"
                              className="flex-1"
                            />
                            <Input
                              value={item.imageUrl || ""}
                              onChange={(e) =>
                                updateItem(
                                  categoryIndex,
                                  itemIndex,
                                  "imageUrl",
                                  e.target.value,
                                )
                              }
                              placeholder="Image URL"
                              className="w-32"
                            />
                            <label className="flex items-center gap-1 text-sm">
                              <input
                                type="checkbox"
                                checked={item.isFrequent}
                                onChange={(e) =>
                                  updateItem(
                                    categoryIndex,
                                    itemIndex,
                                    "isFrequent",
                                    e.target.checked,
                                  )
                                }
                                className="rounded border-gray-300"
                              />
                              Frequent
                            </label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeItem(categoryIndex, itemIndex)
                              }
                              className="text-red-600"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCategory(categoryIndex)}
                    className="text-red-600"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={createBoard.isPending || updateBoard.isPending}
        >
          {createBoard.isPending || updateBoard.isPending
            ? "Saving..."
            : board
              ? "Update Board"
              : "Create Board"}
        </Button>
      </div>
    </form>
  );
}
