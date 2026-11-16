import { Badge, Button } from "@/components/ui";
import {
  useCommunicationBoards,
  useDeleteCommunicationBoard,
} from "@/lib/communication-boards";
import type {
  BoardCategory,
  CommunicationBoard,
  CommunicationItem,
} from "@/types/models";
import { useState } from "react";

interface CommunicationBoardsListProps {
  patientId?: string;
}

export function CommunicationBoardsList({
  patientId,
}: CommunicationBoardsListProps) {
  const { data: boards, isLoading } = useCommunicationBoards(patientId || "");
  const deleteBoard = useDeleteCommunicationBoard();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Communication Boards</h2>
        <Button>Create New Board</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {boards?.map((board: CommunicationBoard) => (
          <CommunicationBoardCard
            key={board.id}
            board={board}
            onDelete={() => deleteBoard.mutate(board.id)}
          />
        ))}
        {boards?.length === 0 && (
          <div className="col-span-2 text-center py-8 text-gray-500">
            <p>No communication boards created yet.</p>
            <p className="text-sm mt-1">
              Create boards to help with non-verbal communication.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CommunicationBoardCardProps {
  board: CommunicationBoard;
  onDelete: () => void;
}

function CommunicationBoardCard({
  board,
  onDelete,
}: CommunicationBoardCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalItems = board.categories.reduce(
    (sum: number, cat: BoardCategory) => sum + cat.items.length,
    0,
  );

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-lg">{board.name}</h3>
            {board.isDefault && (
              <Badge className="bg-blue-100 text-blue-800">Default</Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">Layout: {board.layout}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>{board.categories.length} categories</span>
            <span>{totalItems} items</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "View"}
          </Button>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t">
          {board.categories.map((category: BoardCategory) => (
            <div key={category.id} className="mb-4">
              <h4
                className="font-medium mb-2"
                style={{ color: category.color }}
              >
                {category.name}
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {category.items.map((item: CommunicationItem) => (
                  <div
                    key={item.id}
                    className="border rounded p-2 flex flex-col items-center text-center"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.label}
                        className="w-10 h-10 object-cover rounded mb-1"
                      />
                    )}
                    <span className="text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
