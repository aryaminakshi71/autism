/**
 * Data Collection UI Components
 *
 * Interactive components for ABA data collection including:
 * - DTT Trial Counter
 * - Task Analysis Checklist
 * - Frequency Counter
 * - Duration Timer
 * - Data Sheet Viewer
 */

import { Check, Clock, Pause, Play, RotateCcw, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { Badge, Button, Card, Progress } from "~/components/ui";

// ============================================================================
// DTT Trial Component
// ============================================================================

interface DTTTrial {
  trialNumber: number;
  promptLevel: string;
  response: "correct" | "incorrect" | "no_response";
  latencySeconds?: number;
}

interface DTTCounterProps {
  goalName: string;
  onTrialComplete: (trial: DTTTrial) => void;
  onComplete: () => void;
  trials?: DTTTrial[];
}

const promptLevels = [
  {
    value: "independent",
    label: "Independent",
    color: "bg-emerald-100 text-emerald-700",
  },
  { value: "gestural", label: "Gestural", color: "bg-blue-100 text-blue-700" },
  { value: "verbal", label: "Verbal", color: "bg-indigo-100 text-indigo-700" },
  { value: "model", label: "Model", color: "bg-purple-100 text-purple-700" },
  {
    value: "partial_physical",
    label: "Partial Physical",
    color: "bg-orange-100 text-orange-700",
  },
  {
    value: "full_physical",
    label: "Full Physical",
    color: "bg-red-100 text-red-700",
  },
];

const responseTypes = [
  {
    value: "correct",
    label: "✓ Correct",
    color: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    value: "incorrect",
    label: "✗ Incorrect",
    color: "bg-red-500 hover:bg-red-600",
  },
  {
    value: "no_response",
    label: "⊘ No Response",
    color: "bg-gray-500 hover:bg-gray-600",
  },
];

export function DTTCounter({
  goalName,
  onTrialComplete,
  onComplete,
  trials = [],
}: DTTCounterProps) {
  const [currentTrial, setCurrentTrial] = useState(trials.length + 1);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [latency, setLatency] = useState(0);
  const [isTiming, setIsTiming] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTiming) {
      interval = setInterval(() => {
        setLatency((prev) => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTiming]);

  const handleTrialSubmit = () => {
    if (!selectedPrompt || !selectedResponse) return;

    onTrialComplete({
      trialNumber: currentTrial,
      promptLevel: selectedPrompt,
      response: selectedResponse as DTTTrial["response"],
      latencySeconds: Math.round(latency * 10) / 10,
    });

    setCurrentTrial((prev) => prev + 1);
    setSelectedPrompt(null);
    setSelectedResponse(null);
    setLatency(0);
    setIsTiming(false);
  };

  const correctCount = trials.filter((t) => t.response === "correct").length;
  const percentage =
    trials.length > 0 ? Math.round((correctCount / trials.length) * 100) : 0;

  return (
    <Card className="w-full max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            Discrete Trial Training
          </h3>
          <p className="text-gray-500 text-sm">{goalName}</p>
        </div>
        <Badge
          variant={
            percentage >= 80
              ? "success"
              : percentage >= 50
                ? "warning"
                : "default"
          }
        >
          {correctCount}/{trials.length} ({percentage}%)
        </Badge>
      </div>

      <Progress value={percentage} max={100} showValue className="mb-6" />

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Prompt Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {promptLevels.map((prompt) => (
              <button
                key={prompt.value}
                onClick={() => setSelectedPrompt(prompt.value)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  prompt.color,
                  selectedPrompt === prompt.value
                    ? "ring-2 ring-offset-2 ring-indigo-500"
                    : "opacity-70 hover:opacity-100",
                )}
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Response
          </label>
          <div className="flex flex-col gap-2">
            {responseTypes.map((response) => (
              <button
                key={response.value}
                onClick={() => setSelectedResponse(response.value)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium text-white transition-all",
                  response.color,
                  selectedResponse === response.value
                    ? "ring-2 ring-offset-2 ring-gray-400"
                    : "opacity-80 hover:opacity-100",
                )}
              >
                {response.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Latency: {latency.toFixed(1)}s
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isTiming ? "destructive" : "default"}
              onClick={() => setIsTiming(!isTiming)}
              leftIcon={
                isTiming ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )
              }
            >
              {isTiming ? "Stop" : "Start Timer"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setLatency(0)}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={handleTrialSubmit}
          disabled={!selectedPrompt || !selectedResponse}
          leftIcon={<Check className="h-4 w-4" />}
        >
          Record Trial #{currentTrial}
        </Button>
        <Button
          variant="outline"
          onClick={onComplete}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Finish
        </Button>
      </div>
    </Card>
  );
}

// ============================================================================
// Task Analysis Component
// ============================================================================

interface TaskStep {
  stepNumber: number;
  stepDescription: string;
  completed: boolean;
  promptLevel?: string;
}

interface TaskAnalysisProps {
  taskName: string;
  steps: TaskStep[];
  onStepToggle: (stepNumber: number, completed: boolean) => void;
  onComplete: () => void;
}

const taskPromptLevels = [
  { value: "independent", label: "Independent" },
  { value: "minimal", label: "Minimal" },
  { value: "moderate", label: "Moderate" },
  { value: "maximum", label: "Maximum" },
];

export function TaskAnalysis({
  taskName,
  steps,
  onStepToggle,
  onComplete,
}: TaskAnalysisProps) {
  const completedSteps = steps.filter((s) => s.completed).length;
  const percentage =
    steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;

  return (
    <Card className="w-full max-w-2xl">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">Task Analysis</h3>
        <p className="text-gray-500 text-sm">{taskName}</p>
      </div>

      <Progress value={percentage} max={100} showValue className="mb-6" />

      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.stepNumber}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3 transition-all",
              step.completed
                ? "border-emerald-200 bg-emerald-50"
                : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold text-sm",
                step.completed
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-200 text-gray-600",
              )}
            >
              {step.completed ? <Check className="h-5 w-5" /> : step.stepNumber}
            </div>
            <div className="flex-1">
              <p
                className={cn(
                  "font-medium",
                  step.completed && "text-emerald-900 line-through",
                )}
              >
                {step.stepDescription}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="rounded-md border border-gray-200 px-2 py-1 text-sm"
                value={step.promptLevel || ""}
                onChange={(e) => {
                  const newSteps = [...steps];
                  const index = newSteps.findIndex(
                    (s) => s.stepNumber === step.stepNumber,
                  );
                  if (index !== -1) {
                    newSteps[index].promptLevel = e.target.value;
                  }
                }}
              >
                <option value="">Prompt</option>
                {taskPromptLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => onStepToggle(step.stepNumber, !step.completed)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  step.completed
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300",
                )}
              >
                <Check className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button
        className="mt-6 w-full"
        onClick={onComplete}
        leftIcon={<Save className="h-4 w-4" />}
      >
        Complete Task Analysis
      </Button>
    </Card>
  );
}

// ============================================================================
// Frequency Counter Component
// ============================================================================

interface FrequencyCounterProps {
  behaviorName: string;
  onCountChange: (count: number) => void;
  onComplete: () => void;
  initialCount?: number;
}

export function FrequencyCounter({
  behaviorName,
  onCountChange,
  onComplete,
  initialCount = 0,
}: FrequencyCounterProps) {
  const [count, setCount] = useState(initialCount);
  const [timer, setTimer] = useState(0);
  const [isTiming, setIsTiming] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTiming) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTiming]);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    onCountChange(newCount);
  };

  const handleDecrement = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      onCountChange(newCount);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const rate = timer > 0 ? (count / (timer / 60)).toFixed(2) : "0.00";

  return (
    <Card className="w-full max-w-md">
      <div className="mb-4 text-center">
        <h3 className="font-semibold text-gray-900">Frequency Recording</h3>
        <p className="text-gray-500 text-sm">{behaviorName}</p>
      </div>

      <div className="mb-6 flex items-center justify-center gap-4">
        <button
          onClick={handleDecrement}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition-colors hover:bg-gray-300"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="text-center">
          <div className="font-bold text-5xl text-indigo-600">{count}</div>
          <p className="text-gray-500 text-sm">occurrences</p>
        </div>
        <button
          onClick={handleIncrement}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-white transition-colors hover:bg-indigo-600 active:scale-95"
        >
          <span className="text-2xl font-bold">+</span>
        </button>
      </div>

      <div className="mb-6 rounded-lg bg-gray-50 p-4 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          <span className="font-mono text-2xl text-gray-900">
            {formatTime(timer)}
          </span>
        </div>
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant={isTiming ? "destructive" : "default"}
            onClick={() => setIsTiming(!isTiming)}
          >
            {isTiming ? "Pause" : "Start"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setTimer(0)}>
            Reset
          </Button>
        </div>
      </div>

      <div className="mb-4 text-center">
        <p className="text-gray-600">
          Rate: <span className="font-semibold text-indigo-600">{rate}</span>{" "}
          per minute
        </p>
      </div>

      <Button
        className="w-full"
        onClick={onComplete}
        leftIcon={<Save className="h-4 w-4" />}
      >
        Save Recording
      </Button>
    </Card>
  );
}

// ============================================================================
// Duration Timer Component
// ============================================================================

interface DurationTimerProps {
  behaviorName: string;
  onDurationRecorded: (duration: number) => void;
}

export function DurationTimer({
  behaviorName,
  onDurationRecorded,
}: DurationTimerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [recordings, setRecordings] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && startTime) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording, startTime]);

  const handleStart = () => {
    setIsRecording(true);
    setStartTime(Date.now());
  };

  const handleStop = () => {
    if (startTime) {
      const duration = Date.now() - startTime;
      setRecordings((prev) => [...prev, duration]);
      onDurationRecorded(duration);
    }
    setIsRecording(false);
    setElapsed(0);
    setStartTime(null);
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const centis = Math.floor((ms % 1000) / 10);
    return `${mins}:${secs.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}`;
  };

  const averageDuration =
    recordings.length > 0
      ? recordings.reduce((a, b) => a + b, 0) / recordings.length
      : 0;

  return (
    <Card className="w-full max-w-md">
      <div className="mb-4 text-center">
        <h3 className="font-semibold text-gray-900">Duration Recording</h3>
        <p className="text-gray-500 text-sm">{behaviorName}</p>
      </div>

      <div className="mb-6 text-center">
        <div
          className={cn(
            "font-mono text-5xl font-bold transition-colors",
            isRecording ? "text-red-500 animate-pulse" : "text-gray-900",
          )}
        >
          {formatDuration(elapsed)}
        </div>
      </div>

      <div className="mb-6 flex justify-center gap-3">
        {!isRecording ? (
          <Button
            size="lg"
            onClick={handleStart}
            leftIcon={<Play className="h-5 w-5" />}
          >
            Start Recording
          </Button>
        ) : (
          <Button
            size="lg"
            variant="destructive"
            onClick={handleStop}
            leftIcon={<Pause className="h-5 w-5" />}
          >
            Stop Recording
          </Button>
        )}
      </div>

      {recordings.length > 0 && (
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-2 font-medium text-gray-900">
            Previous Recordings
          </h4>
          <div className="space-y-1">
            {recordings.map((duration, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">Recording #{index + 1}</span>
                <span className="font-mono font-medium">
                  {formatDuration(duration)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-gray-200 pt-2">
            <div className="flex justify-between font-medium">
              <span>Average:</span>
              <span className="font-mono text-indigo-600">
                {formatDuration(averageDuration)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// Data Sheet Summary Component
// ============================================================================

interface DataSheetSummaryProps {
  sheetName: string;
  entries: any[];
  templateType: string;
  onClose: () => void;
}

export function DataSheetSummary({
  sheetName,
  entries,
  templateType,
  onClose,
}: DataSheetSummaryProps) {
  const getSummary = () => {
    switch (templateType) {
      case "trial_based":
        const correct = entries.filter((e) => e.response === "correct").length;
        return {
          title: "Trial Results",
          stats: [
            { label: "Total Trials", value: entries.length },
            { label: "Correct", value: correct, color: "text-emerald-600" },
            {
              label: "Incorrect",
              value: entries.length - correct,
              color: "text-red-600",
            },
            {
              label: "Accuracy",
              value: `${Math.round((correct / entries.length) * 100)}%`,
            },
          ],
        };
      case "task_analysis":
        const completed = entries.filter((e) => e.completed).length;
        return {
          title: "Task Completion",
          stats: [
            { label: "Total Steps", value: entries.length },
            { label: "Completed", value: completed, color: "text-emerald-600" },
            {
              label: "Completion",
              value: `${Math.round((completed / entries.length) * 100)}%`,
            },
          ],
        };
      case "frequency":
        const total = entries.reduce((sum, e) => sum + (e.count || 0), 0);
        return {
          title: "Frequency Data",
          stats: [
            { label: "Total Counts", value: total },
            { label: "Recordings", value: entries.length },
            {
              label: "Avg per Session",
              value: (total / entries.length).toFixed(1),
            },
          ],
        };
      default:
        return { title: "Summary", stats: [] };
    }
  };

  const summary = getSummary();

  return (
    <Card className="w-full max-w-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{sheetName}</h3>
          <p className="text-gray-500 text-sm">{summary.title}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {summary.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-gray-50 p-3 text-center"
          >
            <p className="text-gray-600 text-xs">{stat.label}</p>
            <p
              className={cn("font-bold text-xl", stat.color || "text-gray-900")}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <Button className="mt-4 w-full" onClick={onClose}>
        Close
      </Button>
    </Card>
  );
}

export { DTTTrial, TaskStep };
export type { DTTTrial as DTTTrialType, TaskStep as TaskStepType };
