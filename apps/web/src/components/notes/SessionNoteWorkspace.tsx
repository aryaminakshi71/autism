"use client";

import {
  queueClinicalEvent,
  replayClinicalEvents,
} from "@/lib/offline-sync-queue";
import { api } from "@/lib/orpc";
import {
  BarChart3,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Flag,
  Minus,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Save,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Metric = "Independent" | "Prompted" | "Incorrect";
type WorkspaceView =
  | "note"
  | "sessions"
  | "charts"
  | "profile"
  | "schedule"
  | "review";
type CollectionMode = "Trials" | "Frequency" | "Duration" | "ABC";

type SavedSession = {
  id: string;
  date: string;
  service: string;
  status: "Draft" | "Complete";
  independent: number;
  prompted: number;
  incorrect: number;
  narrative: string;
  signedBy?: string;
  signedAt?: string;
};

const storageKey = "care-note-maya-sessions";
const draftStorageKey = "care-note-active-draft";
const starterSessions: SavedSession[] = [
  {
    id: "s-1",
    date: "Mar 10, 2026",
    service: "ABA · 60 min",
    status: "Complete",
    independent: 7,
    prompted: 4,
    incorrect: 2,
    narrative:
      "Maya engaged with her visual schedule and requested preferred items with a model.",
  },
  {
    id: "s-2",
    date: "Mar 06, 2026",
    service: "ABA · 60 min",
    status: "Complete",
    independent: 5,
    prompted: 5,
    incorrect: 3,
    narrative: "Transitioned from gross motor play with one verbal reminder.",
  },
  {
    id: "s-3",
    date: "Mar 03, 2026",
    service: "ABA · 60 min",
    status: "Complete",
    independent: 4,
    prompted: 6,
    incorrect: 3,
    narrative: "Participated in reciprocal play with clinician prompts.",
  },
];

const goalCards = [
  { title: "Requests preferred items", code: "COMM-04", progress: 72 },
  { title: "Transitions with visual support", code: "ADL-12", progress: 58 },
  { title: "Responds to name", code: "SOC-08", progress: 64 },
];

const clients = [
  {
    id: "local-patient-maya",
    name: "Maya R.",
    age: 7,
    program: "ABA / Natural environment",
  },
  { id: "liam", name: "Liam W.", age: 9, program: "ABA / Clinic-based" },
  { id: "noah", name: "Noah M.", age: 6, program: "Early intervention" },
];

export function SessionNoteWorkspace() {
  const [view, setView] = useState<WorkspaceView>("note");
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(42 * 60 + 18);
  const [counts, setCounts] = useState<Record<Metric, number>>({
    Independent: 8,
    Prompted: 3,
    Incorrect: 1,
  });
  const [selectedGoal, setSelectedGoal] = useState(0);
  const [note, setNote] = useState(
    "Maya arrived regulated and transitioned into the therapy space with her visual schedule. She independently requested bubbles and engaged in two reciprocal play turns.",
  );
  const [saved, setSaved] = useState(false);
  const [sessions, setSessions] = useState<SavedSession[]>(starterSessions);
  const [clientId, setClientId] = useState("local-patient-maya");
  const [collectionMode, setCollectionMode] =
    useState<CollectionMode>("Trials");
  const [frequency, setFrequency] = useState(0);
  const [duration, setDuration] = useState(0);
  const [abc, setAbc] = useState({
    antecedent: "",
    behavior: "",
    consequence: "",
  });
  const [caregiverUpdate, setCaregiverUpdate] = useState("");
  const [nextPlan, setNextPlan] = useState("");
  const [autosavedAt, setAutosavedAt] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState("ABA direct therapy");
  const [location, setLocation] = useState("Clinic · Room 2");
  const [syncState, setSyncState] = useState<"local" | "syncing" | "synced">(
    "local",
  );
  const [dataSource, setDataSource] = useState<"local" | "api">("local");
  const [liveSheetId, setLiveSheetId] = useState<string | null>(null);
  const sheetIdRef = useRef<string | null>(null);
  const creatingSheetRef = useRef<Promise<string> | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(
      () => setSeconds((value) => value + 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as SavedSession[];
      if (Array.isArray(parsed)) setSessions(parsed);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    const flushOfflineCapture = async () => {
      if (!sheetIdRef.current) return;
      const result = await replayClinicalEvents(async (event) => {
        await api.dataCollectionSheets.addEntry({
          id: sheetIdRef.current!,
          entry: event.payload,
        });
      });
      if (result.delivered) setSyncState("synced");
    };
    const onOnline = () => void flushOfflineCapture();
    window.addEventListener("online", onOnline);
    void flushOfflineCapture();
    return () => window.removeEventListener("online", onOnline);
  }, []);

  useEffect(() => {
    api.patients
      .list({ page: 1, limit: 20, status: "active" })
      .then((result) => {
        if (result.data.length > 0) setDataSource("api");
      })
      .catch(() => setDataSource("local"));
  }, []);

  useEffect(() => {
    const saveTimer = window.setTimeout(() => {
      window.localStorage.setItem(
        draftStorageKey,
        JSON.stringify({
          clientId,
          counts,
          note,
          caregiverUpdate,
          nextPlan,
          collectionMode,
          frequency,
          duration,
          abc,
          serviceType,
          location,
          updatedAt: new Date().toISOString(),
        }),
      );
      setAutosavedAt(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    }, 700);
    return () => window.clearTimeout(saveTimer);
  }, [
    abc,
    caregiverUpdate,
    clientId,
    collectionMode,
    counts,
    duration,
    frequency,
    location,
    nextPlan,
    note,
    serviceType,
  ]);

  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const activeClient =
    clients.find((client) => client.id === clientId) ?? clients[0];

  async function ensureLiveSheet() {
    if (sheetIdRef.current) return sheetIdRef.current;
    if (!creatingSheetRef.current) {
      creatingSheetRef.current = api.dataCollectionSheets
        .create({
          templateId: "builtin-dtt",
          patientId: clientId,
          name: `${activeClient.name} · ${new Date().toLocaleDateString()} session data`,
        })
        .then((sheet) => {
          sheetIdRef.current = sheet.id;
          setLiveSheetId(sheet.id);
          setDataSource("api");
          return sheet.id;
        })
        .finally(() => {
          creatingSheetRef.current = null;
        });
    }
    return creatingSheetRef.current;
  }

  async function persistEntry(
    type: "trial" | "frequency" | "duration" | "abc",
    entry: Record<string, unknown>,
  ) {
    setSyncState("syncing");
    try {
      const sheetId = await ensureLiveSheet();
      await api.dataCollectionSheets.addEntry({ id: sheetId, entry });
      setSyncState("synced");
    } catch {
      queueClinicalEvent({ type, payload: entry });
      setSyncState("local");
    }
  }

  async function capture(metric: Metric) {
    setCounts((current) => ({ ...current, [metric]: current[metric] + 1 }));
    await persistEntry("trial", {
      kind: "trial",
      trialNumber: total + 1,
      goalCode: goalCards[selectedGoal].code,
      promptLevel: metric === "Independent" ? "Independent" : "Verbal",
      response: metric === "Incorrect" ? "Incorrect" : "Correct",
      recordedAt: new Date().toISOString(),
    });
    setSaved(false);
  }

  async function recordFrequency() {
    setFrequency((value) => value + 1);
    await persistEntry("frequency", {
      kind: "frequency",
      goalCode: goalCards[selectedGoal].code,
      count: 1,
      observationPeriod: Math.max(1, Math.round(seconds / 60)),
      recordedAt: new Date().toISOString(),
    });
  }

  async function recordDuration() {
    setDuration((value) => value + 30);
    await persistEntry("duration", {
      kind: "duration",
      goalCode: goalCards[selectedGoal].code,
      durationSeconds: 30,
      recordedAt: new Date().toISOString(),
    });
  }

  async function recordAbc() {
    if (
      !abc.antecedent.trim() ||
      !abc.behavior.trim() ||
      !abc.consequence.trim()
    )
      return;
    await persistEntry("abc", {
      kind: "abc",
      goalCode: goalCards[selectedGoal].code,
      ...abc,
      recordedAt: new Date().toISOString(),
    });
    setAbc({ antecedent: "", behavior: "", consequence: "" });
  }

  async function syncLiveSession(completed = false) {
    setSyncState("syncing");
    try {
      if (completed) {
        await api.sessions.complete({ id: "local-session-today", notes: note });
      } else {
        await api.sessions.update({
          id: "local-session-today",
          notes: note,
          location,
          status: "in-progress",
        });
      }
      setSyncState("synced");
    } catch {
      setSyncState("local");
    }
  }

  async function saveNote() {
    const current: SavedSession = {
      id: "current-session",
      date: "Mar 11, 2026",
      service: "ABA · 60 min",
      status: "Draft",
      independent: counts.Independent,
      prompted: counts.Prompted,
      incorrect: counts.Incorrect,
      narrative: note,
    };
    setSessions((existing) => {
      const next = [
        current,
        ...existing.filter((session) => session.id !== current.id),
      ];
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
    setSaved(true);
    try {
      const sheetId = await ensureLiveSheet();
      await api.dataCollectionSheets.update({
        id: sheetId,
        notes: formatClinicalNote(),
      });
      setSyncState("synced");
    } catch {
      setSyncState("local");
    }
    await syncLiveSession();
    window.setTimeout(() => setSaved(false), 2400);
  }

  async function completeNote() {
    if (
      note.trim().length < 20 ||
      caregiverUpdate.trim().length < 6 ||
      total === 0
    )
      return;
    const current: SavedSession = {
      id: "current-session",
      date: "Mar 11, 2026",
      service: "ABA · 60 min",
      status: "Complete",
      independent: counts.Independent,
      prompted: counts.Prompted,
      incorrect: counts.Incorrect,
      narrative: note,
      signedBy: "Jordan Lee, RBT",
      signedAt: new Date().toISOString(),
    };
    setSessions((existing) => {
      const next = [
        current,
        ...existing.filter((session) => session.id !== current.id),
      ];
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
    setIsRunning(false);
    try {
      const sheetId = await ensureLiveSheet();
      await api.dataCollectionSheets.complete({
        id: sheetId,
        finalNotes: formatClinicalNote(),
      });
      setSyncState("synced");
    } catch {
      setSyncState("local");
    }
    await syncLiveSession(true);
    setView("sessions");
  }

  function formatClinicalNote() {
    return [
      `Service: ${serviceType}`,
      `Location: ${location}`,
      `Narrative: ${note.trim()}`,
      `Caregiver update: ${caregiverUpdate.trim() || "Not documented"}`,
      `Next-session plan: ${nextPlan.trim() || "Not documented"}`,
    ].join("\n\n");
  }

  return (
    <div className="min-h-screen bg-[#f5f4ee] text-[#19352f]">
      <div className="mx-auto max-w-[1540px] px-4 py-5 sm:px-7 lg:px-10">
        <header className="mb-4 flex flex-col gap-4 border-[#19352f]/15 border-b pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#19352f] text-[#f7d66a] shadow-[4px_4px_0_#d9b848]">
              <FileText size={21} strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#597069]">
                Care notes / live session
              </p>
              <h1 className="font-serif text-3xl leading-none tracking-tight sm:text-4xl">
                Session note
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="flex items-center gap-2 rounded-full border border-[#19352f]/15 bg-white px-4 py-2 text-sm font-semibold transition hover:border-[#19352f]/45"
              type="button"
            >
              <Clock3 size={16} /> 11 Mar 2026 <ChevronDown size={14} />
            </button>
            <button
              onClick={saveNote}
              className="flex items-center gap-2 rounded-full bg-[#19352f] px-5 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_#d9b848] transition hover:-translate-y-0.5"
              type="button"
            >
              {saved ? <Check size={16} /> : <Save size={16} />}{" "}
              {saved ? "Saved" : "Save draft"}
            </button>
          </div>
        </header>

        <nav
          aria-label="Care workspace"
          className="mb-6 flex w-full gap-1 overflow-x-auto rounded-2xl bg-[#e7e8de] p-1.5 sm:w-fit"
        >
          {[
            ["note", "Live note", FileText],
            ["sessions", "Sessions", CalendarDays],
            ["charts", "Progress charts", BarChart3],
            ["profile", "Client profile", UserRound],
            ["schedule", "Schedule", Clock3],
            ["review", "Review queue", Check],
          ].map(([key, label, Icon]) => (
            <button
              key={String(key)}
              onClick={() => setView(key as WorkspaceView)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition ${view === key ? "bg-white text-[#19352f] shadow-sm" : "text-[#597069] hover:text-[#19352f]"}`}
              type="button"
            >
              <Icon size={16} />
              {String(label)}
            </button>
          ))}
        </nav>

        {view === "charts" ? (
          <ProgressCharts
            clientName={activeClient.name}
            sessions={sessions}
            onCreateNote={() => setView("note")}
          />
        ) : null}
        {view === "sessions" ? (
          <SessionArchive
            clientName={activeClient.name}
            sessions={sessions}
            onCreateNote={() => setView("note")}
          />
        ) : null}
        {view === "profile" ? (
          <ClientProfile
            client={activeClient}
            onStartNote={() => setView("note")}
          />
        ) : null}
        {view === "schedule" ? (
          <ClientSchedule
            clientName={activeClient.name}
            onStartNote={() => setView("note")}
          />
        ) : null}
        {view === "review" ? (
          <ReviewQueue sessions={sessions} onOpenNote={() => setView("note")} />
        ) : null}
        {view !== "note" ? null : (
          <>
            <div className="grid gap-5 xl:grid-cols-[290px_minmax(0,1fr)_315px]">
              <aside className="rounded-3xl bg-[#19352f] p-5 text-[#f7f5ed] shadow-[5px_5px_0_#b9c7aa] xl:sticky xl:top-5 xl:h-[calc(100vh-5rem)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#b9c7aa]">
                      Client
                    </p>
                    <select
                      aria-label="Select client"
                      value={clientId}
                      onChange={(event) => setClientId(event.target.value)}
                      className="mt-1 w-full appearance-none bg-transparent font-serif text-2xl outline-none"
                    >
                      {clients.map((client) => (
                        <option
                          className="bg-[#19352f] text-white"
                          key={client.id}
                          value={client.id}
                        >
                          {client.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-[#d7e0d2]">
                      Age {activeClient.age} · {activeClient.program}
                    </p>
                  </div>
                  <button
                    aria-label="More client options"
                    className="rounded-full p-1 text-[#d7e0d2] hover:bg-white/10"
                    type="button"
                  >
                    <MoreHorizontal size={19} />
                  </button>
                </div>

                <div className="mt-7 border-[#e6efe1]/15 border-y py-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#b9c7aa]">
                    Session clock
                  </p>
                  <div className="mt-2 flex items-end justify-between">
                    <span className="font-mono text-4xl tracking-tighter">
                      {clock}
                    </span>
                    <button
                      onClick={() => setIsRunning((running) => !running)}
                      className="grid size-10 place-items-center rounded-full bg-[#f7d66a] text-[#19352f] transition hover:scale-105"
                      type="button"
                      aria-label={
                        isRunning ? "Pause session" : "Resume session"
                      }
                    >
                      {isRunning ? (
                        <Pause size={17} fill="currentColor" />
                      ) : (
                        <Play size={17} fill="currentColor" />
                      )}
                    </button>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full w-[54%] rounded-full bg-[#f7d66a]" />
                  </div>
                  <p className="mt-2 text-xs text-[#b9c7aa]">
                    Scheduled for 60 minutes · 17:42 remaining
                  </p>
                </div>

                <div className="mt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#b9c7aa]">
                    Today’s program
                  </p>
                  <div className="mt-3 space-y-2">
                    {goalCards.map((goal, index) => (
                      <button
                        key={goal.code}
                        onClick={() => setSelectedGoal(index)}
                        className={`w-full rounded-2xl border p-3 text-left transition ${selectedGoal === index ? "border-[#f7d66a] bg-[#f7d66a]/10" : "border-white/10 hover:border-white/30"}`}
                        type="button"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-sm font-semibold leading-snug">
                            {goal.title}
                          </span>
                          <span className="font-mono text-[10px] text-[#b9c7aa]">
                            {goal.code}
                          </span>
                        </div>
                        <div className="mt-3 h-1 rounded-full bg-white/15">
                          <div
                            className="h-full rounded-full bg-[#8fb7a3]"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <main className="min-w-0 space-y-5">
                <section className="overflow-hidden rounded-3xl border border-[#19352f]/10 bg-white shadow-[4px_5px_0_rgba(25,53,47,0.1)]">
                  <div className="flex flex-col gap-4 border-[#19352f]/10 border-b bg-[#fcfbf7] p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#75877c]">
                        Active target
                      </p>
                      <h2 className="mt-1 font-serif text-2xl">
                        {goalCards[selectedGoal].title}
                      </h2>
                    </div>
                    <div className="rounded-full bg-[#e8f0e4] px-3 py-1.5 font-mono text-xs font-bold text-[#35644f]">
                      {total} trials logged
                    </div>
                  </div>
                  <div className="grid gap-3 border-[#19352f]/10 border-b bg-[#f7f5ed] p-4 sm:grid-cols-2">
                    <label className="text-xs font-bold text-[#597069]">
                      Service
                      <select
                        value={serviceType}
                        onChange={(event) => setServiceType(event.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-[#19352f]/12 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[#3b8a68]"
                      >
                        <option>ABA direct therapy</option>
                        <option>Caregiver training</option>
                        <option>BCBA supervision</option>
                        <option>Social skills group</option>
                      </select>
                    </label>
                    <label className="text-xs font-bold text-[#597069]">
                      Location
                      <select
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-[#19352f]/12 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[#3b8a68]"
                      >
                        <option>Clinic · Room 2</option>
                        <option>Home</option>
                        <option>School</option>
                        <option>Telehealth</option>
                      </select>
                    </label>
                  </div>
                  <div className="grid gap-3 p-5 sm:grid-cols-3">
                    {(
                      [
                        ["Independent", "bg-[#d9efe4] text-[#245b47]", Check],
                        ["Prompted", "bg-[#fff0bd] text-[#805f10]", Plus],
                        ["Incorrect", "bg-[#f7dedb] text-[#8b3d37]", X],
                      ] as const
                    ).map(([metric, color, Icon]) => (
                      <button
                        key={metric}
                        onClick={() => capture(metric)}
                        className={`${color} group relative min-h-32 rounded-2xl p-4 text-left transition hover:-translate-y-1 hover:shadow-[3px_4px_0_rgba(25,53,47,0.18)]`}
                        type="button"
                      >
                        <Icon size={18} strokeWidth={2.6} />
                        <p className="mt-5 font-serif text-xl">{metric}</p>
                        <p className="mt-1 font-mono text-sm font-bold opacity-75">
                          {counts[metric]} captures
                        </p>
                        <span className="absolute right-4 bottom-3 grid size-6 place-items-center rounded-full bg-white/55 opacity-0 transition group-hover:opacity-100">
                          <Plus size={14} />
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="border-[#19352f]/10 border-t bg-[#fcfbf7] p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#75877c]">
                          Supplemental measurement
                        </p>
                        <p className="mt-1 text-sm text-[#597069]">
                          Capture the measure that fits the behavior or target.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1 rounded-xl bg-[#e7e8de] p-1">
                        {(
                          [
                            "Trials",
                            "Frequency",
                            "Duration",
                            "ABC",
                          ] as CollectionMode[]
                        ).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setCollectionMode(mode)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${collectionMode === mode ? "bg-white shadow-sm" : "text-[#597069]"}`}
                            type="button"
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>
                    {collectionMode === "Frequency" ? (
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() =>
                            setFrequency((value) => Math.max(0, value - 1))
                          }
                          className="grid size-10 place-items-center rounded-xl border border-[#19352f]/15"
                          type="button"
                        >
                          <Minus size={16} />
                        </button>
                        <div className="min-w-28 rounded-xl bg-[#e9f3ed] px-4 py-2 text-center">
                          <p className="font-mono text-2xl font-bold">
                            {frequency}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-[#597069]">
                            occurrences
                          </p>
                        </div>
                        <button
                          onClick={() => void recordFrequency()}
                          className="grid size-10 place-items-center rounded-xl bg-[#19352f] text-white"
                          type="button"
                        >
                          <Plus size={16} />
                        </button>
                        <span className="text-xs text-[#75877c]">
                          Records each occurrence of the selected behavior.
                        </span>
                      </div>
                    ) : null}
                    {collectionMode === "Duration" ? (
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() => void recordDuration()}
                          className="rounded-xl bg-[#19352f] px-4 py-2.5 text-sm font-bold text-white"
                          type="button"
                        >
                          Add 30 sec
                        </button>
                        <p className="font-mono text-2xl font-bold">
                          {Math.floor(duration / 60)}:
                          {String(duration % 60).padStart(2, "0")}
                        </p>
                        <button
                          onClick={() => setDuration(0)}
                          className="text-xs font-bold text-[#8b3d37] underline"
                          type="button"
                        >
                          Clear duration
                        </button>
                      </div>
                    ) : null}
                    {collectionMode === "ABC" ? (
                      <div className="mt-4 grid gap-2 md:grid-cols-3">
                        {(
                          [
                            [
                              "antecedent",
                              "Antecedent",
                              "What happened right before?",
                            ],
                            ["behavior", "Behavior", "Observable action"],
                            ["consequence", "Consequence", "What followed?"],
                          ] as const
                        ).map(([key, label, placeholder]) => (
                          <label
                            key={key}
                            className="text-xs font-bold text-[#597069]"
                          >
                            <span>{label}</span>
                            <textarea
                              value={abc[key]}
                              onChange={(event) =>
                                setAbc((current) => ({
                                  ...current,
                                  [key]: event.target.value,
                                }))
                              }
                              placeholder={placeholder}
                              className="mt-1.5 min-h-20 w-full resize-y rounded-xl border border-[#19352f]/12 bg-white p-2.5 text-sm font-normal outline-none focus:border-[#3b8a68]"
                            />
                          </label>
                        ))}
                        <button
                          onClick={() => void recordAbc()}
                          disabled={
                            !abc.antecedent.trim() ||
                            !abc.behavior.trim() ||
                            !abc.consequence.trim()
                          }
                          className="rounded-xl bg-[#19352f] px-3 py-2 text-sm font-bold text-white disabled:opacity-40"
                          type="button"
                        >
                          Record ABC
                        </button>
                      </div>
                    ) : null}
                    {collectionMode === "Trials" ? (
                      <p className="mt-4 text-xs text-[#75877c]">
                        Trial-by-trial data is active above. Use the capture
                        buttons to log response level.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-[#19352f]/10 border-t px-5 py-3 text-sm text-[#597069]">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-[#3b8a68]" /> 67%
                      independent
                    </span>
                    <span>Last trial · 2 min ago</span>
                    <button
                      onClick={() =>
                        setCounts({ Independent: 0, Prompted: 0, Incorrect: 0 })
                      }
                      className="ml-auto flex items-center gap-1 font-semibold text-[#8b3d37] hover:underline"
                      type="button"
                    >
                      <Minus size={14} /> Reset counts
                    </button>
                  </div>
                </section>

                <section className="rounded-3xl border border-[#19352f]/10 bg-white p-5 shadow-[4px_5px_0_rgba(25,53,47,0.1)]">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#75877c]">
                        Narrative note
                      </p>
                      <h2 className="mt-1 font-serif text-2xl">
                        What happened today?
                      </h2>
                    </div>
                    <button
                      className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#e9e4d8] px-3 py-1.5 text-xs font-bold text-[#554f43] transition hover:bg-[#ded7c7]"
                      type="button"
                    >
                      <Sparkles size={14} /> Suggest phrasing
                    </button>
                  </div>
                  <textarea
                    value={note}
                    onChange={(event) => {
                      setNote(event.target.value);
                      setSaved(false);
                    }}
                    className="min-h-44 w-full resize-y rounded-2xl border border-[#19352f]/12 bg-[#fcfbf7] p-4 text-[15px] leading-7 outline-none transition focus:border-[#3b8a68] focus:ring-2 focus:ring-[#3b8a68]/15"
                    placeholder="Capture observations, client response, and context…"
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#75877c]">
                    <span>Objective, observable language works best.</span>
                    <span className="font-mono">
                      {dataSource === "api"
                        ? `Clinical API sheet ${liveSheetId ? "connected" : "available"} · `
                        : "Offline clinical draft · "}
                      {syncState === "synced"
                        ? "synced"
                        : syncState === "syncing"
                          ? "syncing…"
                          : autosavedAt
                            ? `local draft ${autosavedAt}`
                            : "saving draft…"}{" "}
                      · {note.length} characters
                    </span>
                  </div>
                </section>

                <div className="grid gap-5 lg:grid-cols-2">
                  <NoteField
                    label="Family / caregiver update"
                    placeholder="What should the family know today?"
                    value={caregiverUpdate}
                    onChange={setCaregiverUpdate}
                  />
                  <NoteField
                    label="Plan for next session"
                    placeholder="Next target, materials, or follow-up…"
                    value={nextPlan}
                    onChange={setNextPlan}
                  />
                </div>
              </main>

              <aside className="space-y-5 xl:sticky xl:top-5 xl:h-fit">
                <section className="rounded-3xl border border-[#19352f]/10 bg-[#f7d66a] p-5 shadow-[4px_5px_0_#cfb24b]">
                  <div className="flex items-center gap-2 text-[#5b4910]">
                    <Flag size={17} fill="currentColor" />
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                      Clinical signal
                    </p>
                  </div>
                  <h2 className="mt-3 font-serif text-2xl leading-tight">
                    A strong start to the session.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#5b4910]">
                    Maya is showing more spontaneous requests than her last
                    three sessions.
                  </p>
                  <button
                    className="mt-4 text-sm font-bold underline decoration-2 underline-offset-4"
                    type="button"
                  >
                    View trend
                  </button>
                </section>
                <section className="rounded-3xl border border-[#19352f]/10 bg-white p-5 shadow-[4px_5px_0_rgba(25,53,47,0.1)]">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#75877c]">
                    Note check
                  </p>
                  <div className="mt-4 space-y-4">
                    {[
                      ["Client & service", true],
                      ["Targets captured", total > 0],
                      ["Narrative observation", note.length > 20],
                      ["Caregiver update", caregiverUpdate.length > 5],
                    ].map(([label, complete]) => (
                      <div
                        key={String(label)}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span>{label}</span>
                        <span
                          className={`grid size-5 place-items-center rounded-full ${complete ? "bg-[#d9efe4] text-[#245b47]" : "bg-[#f1eee7] text-[#a09b90]"}`}
                        >
                          {complete ? (
                            <Check size={13} strokeWidth={3} />
                          ) : (
                            <span className="size-1.5 rounded-full bg-current" />
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    disabled={
                      note.trim().length < 20 ||
                      caregiverUpdate.trim().length < 6 ||
                      total === 0
                    }
                    onClick={completeNote}
                    className="mt-5 w-full rounded-xl border border-[#19352f]/15 px-4 py-2.5 text-sm font-bold transition hover:bg-[#19352f] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    type="button"
                  >
                    Complete &amp; sign note
                  </button>
                  <p className="mt-2 text-center text-[11px] text-[#75877c]">
                    Signing requires trials, a narrative observation, and a
                    caregiver update.
                  </p>
                </section>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SessionArchive({
  clientName,
  sessions,
  onCreateNote,
}: { clientName: string; sessions: SavedSession[]; onCreateNote: () => void }) {
  return (
    <section className="rounded-3xl border border-[#19352f]/10 bg-white p-5 shadow-[4px_5px_0_rgba(25,53,47,0.1)] sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#75877c]">
            {clientName} · care timeline
          </p>
          <h2 className="mt-1 font-serif text-3xl">Session archive</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-[#597069]">
            Drafts and completed notes stay in this client record. Notes created
            in this MVP are saved in this browser.
          </p>
        </div>
        <button
          onClick={onCreateNote}
          className="flex items-center justify-center gap-2 rounded-full bg-[#19352f] px-4 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_#d9b848]"
          type="button"
        >
          <Plus size={16} /> New session note
        </button>
      </div>
      <div className="mt-7 overflow-hidden rounded-2xl border border-[#19352f]/10">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-[#fcfbf7] font-mono text-[10px] uppercase tracking-[0.13em] text-[#75877c]">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Trials</th>
              <th className="px-4 py-3">Note status</th>
              <th className="px-4 py-3">Observation</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-[#19352f]/10 border-t">
                <td className="px-4 py-4 font-semibold">{session.date}</td>
                <td className="px-4 py-4 text-[#597069]">{session.service}</td>
                <td className="px-4 py-4 font-mono">
                  {session.independent + session.prompted + session.incorrect}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${session.status === "Complete" ? "bg-[#d9efe4] text-[#245b47]" : "bg-[#fff0bd] text-[#805f10]"}`}
                  >
                    {session.status}
                  </span>
                </td>
                <td className="max-w-[280px] truncate px-4 py-4 text-[#597069]">
                  {session.narrative}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProgressCharts({
  clientName,
  sessions,
  onCreateNote,
}: { clientName: string; sessions: SavedSession[]; onCreateNote: () => void }) {
  const complete = sessions
    .filter((session) => session.status === "Complete")
    .slice(0, 6)
    .reverse();
  const values = complete.map((session) =>
    Math.round(
      (session.independent /
        Math.max(
          1,
          session.independent + session.prompted + session.incorrect,
        )) *
        100,
    ),
  );
  const average = values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : 0;
  const polyline = values
    .map(
      (value, index) =>
        `${20 + index * (260 / Math.max(1, values.length - 1))},${126 - value}`,
    )
    .join(" ");
  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-[#19352f] p-6 text-[#f7f5ed] shadow-[5px_5px_0_#b9c7aa] sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#b9c7aa]">
              {clientName} · COMM-04
            </p>
            <h2 className="mt-2 font-serif text-3xl">
              Requests preferred items
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#d7e0d2]">
              A clear, clinically useful view of independent responding across
              signed session notes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => window.print()}
              className="rounded-full border border-white/25 px-4 py-2.5 text-sm font-bold"
              type="button"
            >
              Print report
            </button>
            <button
              onClick={onCreateNote}
              className="rounded-full bg-[#f7d66a] px-4 py-2.5 text-sm font-bold text-[#19352f]"
              type="button"
            >
              Capture today’s data
            </button>
          </div>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <Stat
            label="Independent responding"
            value={`${average}%`}
            detail="across signed notes"
          />
          <Stat
            label="Current goal trend"
            value="↑ 23%"
            detail="from first session"
          />
          <Stat label="Mastery threshold" value="80%" detail="for 3 sessions" />
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section className="rounded-3xl border border-[#19352f]/10 bg-white p-5 shadow-[4px_5px_0_rgba(25,53,47,0.1)] sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#75877c]">
                Line chart
              </p>
              <h3 className="mt-1 font-serif text-2xl">Independent trials</h3>
            </div>
            <span className="rounded-full bg-[#e8f0e4] px-3 py-1.5 text-xs font-bold text-[#35644f]">
              Target 80%
            </span>
          </div>
          <div className="mt-7 overflow-x-auto">
            <svg
              viewBox="0 0 320 160"
              className="h-52 min-w-[320px] w-full"
              role="img"
              aria-label="Independent response trend"
            >
              <line
                x1="20"
                y1="46"
                x2="300"
                y2="46"
                stroke="#d9efe4"
                strokeWidth="1"
                strokeDasharray="4 5"
              />
              <text x="304" y="49" fill="#597069" fontSize="9">
                80%
              </text>
              <line
                x1="20"
                y1="126"
                x2="300"
                y2="126"
                stroke="#d8ddd5"
                strokeWidth="1"
              />
              <polyline
                points={polyline || "20,126"}
                fill="none"
                stroke="#3b8a68"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {values.map((value, index) => (
                <g key={`${value}-${index}`}>
                  <circle
                    cx={20 + index * (260 / Math.max(1, values.length - 1))}
                    cy={126 - value}
                    r="5"
                    fill="#f7d66a"
                    stroke="#19352f"
                    strokeWidth="2"
                  />
                  <text
                    x={20 + index * (260 / Math.max(1, values.length - 1))}
                    y="148"
                    textAnchor="middle"
                    fill="#597069"
                    fontSize="9"
                  >
                    S{index + 1}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <p className="mt-2 text-xs text-[#75877c]">
            Each point represents a completed session. Draft notes are excluded.
          </p>
        </section>
        <section className="rounded-3xl border border-[#19352f]/10 bg-white p-5 shadow-[4px_5px_0_rgba(25,53,47,0.1)]">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#75877c]">
            Latest session
          </p>
          <div className="mt-5 space-y-4">
            {(
              [
                ["Independent", sessions[0]?.independent ?? 0, "#3b8a68"],
                ["Prompted", sessions[0]?.prompted ?? 0, "#d9b848"],
                ["Incorrect", sessions[0]?.incorrect ?? 0, "#c96860"],
              ] as const
            ).map(([label, value, color]) => (
              <div key={label}>
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-mono font-bold">{value}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eef0ea]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Number(value) * 10)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-[#19352f]/10 border-t pt-4 text-sm text-[#597069]">
            <UserRound className="mr-2 inline" size={15} />
            Caregiver update still needed
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  detail,
}: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
      <p className="text-xs text-[#b9c7aa]">{label}</p>
      <p className="mt-1 font-serif text-3xl">{value}</p>
      <p className="mt-1 text-xs text-[#d7e0d2]">{detail}</p>
    </div>
  );
}

function ClientProfile({
  client,
  onStartNote,
}: { client: (typeof clients)[number]; onStartNote: () => void }) {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-[#19352f]/10 bg-white shadow-[4px_5px_0_rgba(25,53,47,0.1)]">
        <div className="bg-[#19352f] p-6 text-[#f7f5ed] sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#b9c7aa]">
                Active client record
              </p>
              <h2 className="mt-2 font-serif text-4xl">{client.name}</h2>
              <p className="mt-2 text-sm text-[#d7e0d2]">
                Age {client.age} · {client.program} · Care plan reviewed Mar 1
              </p>
            </div>
            <button
              onClick={onStartNote}
              className="rounded-full bg-[#f7d66a] px-4 py-2.5 text-sm font-bold text-[#19352f]"
              type="button"
            >
              Start session note
            </button>
          </div>
        </div>
        <div className="grid gap-5 p-6 md:grid-cols-3">
          <ProfileItem
            label="Care team"
            value="A. Patel, BCBA"
            detail="Jordan Lee, RBT"
          />
          <ProfileItem
            label="Authorization"
            value="42 of 80 units"
            detail="Renews May 31, 2026"
          />
          <ProfileItem
            label="Communication"
            value="AAC + verbal"
            detail="Visual first, wait time"
          />
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <section className="rounded-3xl border border-[#19352f]/10 bg-white p-6 shadow-[4px_5px_0_rgba(25,53,47,0.1)]">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#75877c]">
            Active treatment goals
          </p>
          <div className="mt-5 space-y-4">
            {goalCards.map((goal) => (
              <div
                key={goal.code}
                className="rounded-2xl border border-[#19352f]/10 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{goal.title}</p>
                    <p className="mt-1 text-xs text-[#75877c]">
                      {goal.code} · Mastery: 80% for 3 sessions
                    </p>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#35644f]">
                    {goal.progress}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eef0ea]">
                  <div
                    className="h-full rounded-full bg-[#3b8a68]"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
        <aside className="rounded-3xl border border-[#f0d16b] bg-[#fff6d6] p-6 shadow-[4px_5px_0_#e0c06a]">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#80651b]">
            Care guidance
          </p>
          <h3 className="mt-3 font-serif text-2xl leading-tight">
            Start with visual schedule and preferred-item choice.
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#6f5b24]">
            Use brief, concrete language. Offer AAC access before prompting
            verbal response. No medical or safety alerts recorded.
          </p>
          <button
            className="mt-5 text-sm font-bold underline decoration-2 underline-offset-4"
            type="button"
          >
            Edit care guidance
          </button>
        </aside>
      </div>
    </div>
  );
}

function ProfileItem({
  label,
  value,
  detail,
}: { label: string; value: string; detail: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#75877c]">
        {label}
      </p>
      <p className="mt-2 font-serif text-xl">{value}</p>
      <p className="mt-1 text-sm text-[#597069]">{detail}</p>
    </div>
  );
}

function ClientSchedule({
  clientName,
  onStartNote,
}: { clientName: string; onStartNote: () => void }) {
  const [status, setStatus] = useState<"All" | "Due" | "Completed">("All");
  const visits = [
    {
      date: "Today · 2:00 PM",
      service: "ABA direct therapy",
      clinician: "Jordan Lee, RBT",
      state: "Due",
    },
    {
      date: "Thu, Mar 13 · 2:00 PM",
      service: "ABA direct therapy",
      clinician: "Jordan Lee, RBT",
      state: "Scheduled",
    },
    {
      date: "Fri, Mar 14 · 10:30 AM",
      service: "BCBA supervision",
      clinician: "A. Patel, BCBA",
      state: "Scheduled",
    },
    {
      date: "Mon, Mar 10 · 2:00 PM",
      service: "ABA direct therapy",
      clinician: "Jordan Lee, RBT",
      state: "Completed",
    },
  ];
  const visible = visits.filter(
    (visit) => status === "All" || visit.state === status,
  );
  return (
    <section className="rounded-3xl border border-[#19352f]/10 bg-white p-6 shadow-[4px_5px_0_rgba(25,53,47,0.1)] sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#75877c]">
            {clientName} · appointments
          </p>
          <h2 className="mt-1 font-serif text-3xl">Care schedule</h2>
          <p className="mt-2 text-sm text-[#597069]">
            Know what is due, scheduled, and ready for note completion.
          </p>
        </div>
        <button
          onClick={onStartNote}
          className="rounded-full bg-[#19352f] px-4 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_#d9b848]"
          type="button"
        >
          <Plus className="mr-1 inline" size={15} /> Document today
        </button>
      </div>
      <div className="mt-6 flex gap-1 rounded-xl bg-[#e7e8de] p-1 w-fit">
        {(["All", "Due", "Completed"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setStatus(item)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${status === item ? "bg-white shadow-sm" : "text-[#597069]"}`}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-5 divide-y divide-[#19352f]/10 rounded-2xl border border-[#19352f]/10">
        {visible.map((visit) => (
          <div
            key={visit.date}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold">{visit.date}</p>
              <p className="mt-1 text-sm text-[#597069]">
                {visit.service} · {visit.clinician}
              </p>
            </div>
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${visit.state === "Due" ? "bg-[#fff0bd] text-[#805f10]" : visit.state === "Completed" ? "bg-[#d9efe4] text-[#245b47]" : "bg-[#edf0eb] text-[#597069]"}`}
            >
              {visit.state}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewQueue({
  sessions,
  onOpenNote,
}: { sessions: SavedSession[]; onOpenNote: () => void }) {
  const drafts = sessions.filter((session) => session.status === "Draft");
  const signed = sessions.filter((session) => session.signedAt);
  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-[#19352f] p-6 text-[#f7f5ed] shadow-[5px_5px_0_#b9c7aa] sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#b9c7aa]">
          Clinical quality control
        </p>
        <h2 className="mt-2 font-serif text-3xl">Review queue</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[#d7e0d2]">
          Check for missing session documentation, signatures, and caregiver
          communication before records are finalized.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat
            label="Draft notes"
            value={String(drafts.length)}
            detail="require completion"
          />
          <Stat
            label="Signed notes"
            value={String(signed.length)}
            detail="ready for supervisor review"
          />
          <Stat
            label="Missing caregiver update"
            value={drafts.length ? "1" : "0"}
            detail="needs attention"
          />
        </div>
      </section>
      <section className="rounded-3xl border border-[#19352f]/10 bg-white p-6 shadow-[4px_5px_0_rgba(25,53,47,0.1)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#75877c]">
              Items requiring action
            </p>
            <h3 className="mt-1 font-serif text-2xl">Documentation review</h3>
          </div>
          <span className="rounded-full bg-[#fff0bd] px-3 py-1.5 text-xs font-bold text-[#805f10]">
            {Math.max(1, drafts.length)} open
          </span>
        </div>
        <div className="mt-5 space-y-3">
          {drafts.length ? (
            drafts.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-3 rounded-2xl border border-[#19352f]/10 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {session.date} · draft session note
                  </p>
                  <p className="mt-1 text-sm text-[#597069]">
                    Narrative or caregiver update needs final confirmation.
                  </p>
                </div>
                <button
                  onClick={onOpenNote}
                  className="rounded-xl bg-[#19352f] px-3 py-2 text-sm font-bold text-white"
                  type="button"
                >
                  Open note
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-[#e9f3ed] p-4 text-sm text-[#245b47]">
              <Check className="mr-2 inline" size={16} />
              No saved drafts are waiting for completion.
            </div>
          )}
          <div className="flex flex-col gap-3 rounded-2xl border border-[#19352f]/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Supervisor co-signature</p>
              <p className="mt-1 text-sm text-[#597069]">
                Signed notes can be routed to a BCBA once server roles are
                connected.
              </p>
            </div>
            <span className="rounded-full bg-[#edf0eb] px-3 py-1 text-xs font-bold text-[#597069]">
              Ready
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

function NoteField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-[#19352f]/10 bg-white p-5 shadow-[4px_5px_0_rgba(25,53,47,0.1)]">
      <label className="font-serif text-xl" htmlFor={label}>
        {label}
      </label>
      <textarea
        id={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 min-h-28 w-full resize-y rounded-2xl border border-[#19352f]/12 bg-[#fcfbf7] p-3 text-sm leading-6 outline-none focus:border-[#3b8a68]"
        placeholder={placeholder}
      />
    </section>
  );
}
