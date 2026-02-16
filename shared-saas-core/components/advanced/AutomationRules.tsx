"use client";

import {
  Edit2,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils";

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  enabled: boolean;
  lastRun?: Date;
  runCount: number;
}

interface AutomationRulesProps {
  rules?: AutomationRule[];
  onCreate?: () => void;
  onEdit?: (rule: AutomationRule) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string, enabled: boolean) => void;
  className?: string;
}

export function AutomationRules({
  rules = [],
  onCreate,
  onEdit,
  onDelete,
  onToggle,
  className,
}: AutomationRulesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">
            Automation Rules
          </h3>
          <p className="mt-1 text-gray-500 text-sm">
            Automate repetitive tasks and workflows
          </p>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Rule
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center">
          <Zap className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="mb-2 text-gray-500">No automation rules yet</p>
          <button
            onClick={onCreate}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Create your first rule
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                    <button
                      onClick={() => onToggle?.(rule.id, !rule.enabled)}
                      className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-700"
                    >
                      {rule.enabled ? (
                        <ToggleRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-gray-400" />
                      )}
                      <span>{rule.enabled ? "Enabled" : "Disabled"}</span>
                    </button>
                  </div>
                  <p className="mt-1 text-gray-600 text-sm">
                    {rule.description}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-gray-500 text-xs">
                    <span>When: {rule.trigger}</span>
                    <span>Then: {rule.action}</span>
                    {rule.lastRun && (
                      <span>
                        Last run: {new Date(rule.lastRun).toLocaleDateString()}
                      </span>
                    )}
                    <span>Runs: {rule.runCount}</span>
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <button
                    onClick={() => onEdit?.(rule)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    aria-label="Edit rule"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete?.(rule.id)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete rule"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
