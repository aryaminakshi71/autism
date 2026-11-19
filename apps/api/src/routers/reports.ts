import { and, desc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import type { OrgContext } from "../context";
import { isDemoRequest } from "../lib/demo";
import { getDb, orgAuthed, schema } from "../procedures";

const {
  sessions,
  goals,
  goalProgress,
  dataCollectionSheets,
  patients,
  assessments,
  users,
} = schema;

// Report types
const ReportType = z.enum([
  "session_summary",
  "progress_report",
  "assessment_report",
  "parent_report",
  "treatment_plan",
]);

// Demo data generators
const generateDemoSessionSummary = (sessionId: string): any => {
  return {
    reportType: "session_summary",
    generatedAt: new Date().toISOString(),
    session: {
      id: sessionId,
      date: "2026-03-28",
      duration: 60,
      therapist: "Sarah Johnson, BCBA",
      type: "Direct Therapy",
      location: "Clinic Room 3",
    },
    patient: {
      name: "Alex Smith",
      age: "5 years, 3 months",
      diagnosis: "Autism Spectrum Disorder (Level 2)",
    },
    goalsTargeted: [
      {
        goalId: "goal-001",
        name: "Request preferred items using 2-word phrases",
        domain: "Communication",
        trials: 10,
        correct: 8,
        percentage: 80,
        promptLevel: "Gestural",
        notes: "Good progress with gestural prompts",
      },
      {
        goalId: "goal-002",
        name: "Follow 2-step directions",
        domain: "Receptive Language",
        trials: 6,
        correct: 4,
        percentage: 66.7,
        promptLevel: "Verbal",
        notes: "Needs continued practice",
      },
    ],
    behaviors: [
      {
        type: "Tantrum",
        frequency: 1,
        duration: "2 minutes",
        antecedent: "Transition from play to work",
        intervention: "Visual schedule, priming",
        outcome: "De-escalated with calm voice",
      },
      {
        type: "Hand-flapping",
        frequency: 3,
        context: "Excitement during preferred activity",
        intervention: "Ignored, redirected to task",
      },
    ],
    reinforcers: ["iPad time", "Bubbles", "Praise"],
    summary:
      "Alex demonstrated good progress on manding goals. Responded well to visual supports during transitions.",
    recommendations: [
      "Continue with gestural prompt fading",
      "Introduce visual timer for transitions",
      "Practice 2-step directions during natural routines",
    ],
    nextSession: "2026-03-30",
  };
};

const generateDemoProgressReport = (
  patientId: string,
  startDate: string,
  endDate: string,
): any => {
  return {
    reportType: "progress_report",
    generatedAt: new Date().toISOString(),
    period: { start: startDate, end: endDate },
    patient: {
      id: patientId,
      name: "Alex Smith",
      age: "5 years, 3 months",
      therapist: "Sarah Johnson, BCBA",
    },
    summary: {
      totalSessions: 12,
      attendance: 100,
      averageDuration: 58,
      newGoalsMastered: 2,
      goalsInProgress: 4,
    },
    goalsProgress: [
      {
        goalId: "goal-001",
        name: "Request preferred items using 2-word phrases",
        baseline: 20,
        current: 80,
        target: 90,
        trend: "improving",
        masterySessions: 3,
        totalSessions: 8,
        dataPoints: [
          { date: "2026-03-01", value: 40, trials: 5 },
          { date: "2026-03-08", value: 60, trials: 5 },
          { date: "2026-03-15", value: 75, trials: 8 },
          { date: "2026-03-22", value: 80, trials: 10 },
        ],
      },
      {
        goalId: "goal-002",
        name: "Follow 2-step directions",
        baseline: 10,
        current: 66.7,
        target: 80,
        trend: "improving",
        masterySessions: 0,
        totalSessions: 6,
        dataPoints: [
          { date: "2026-03-05", value: 33, trials: 3 },
          { date: "2026-03-12", value: 50, trials: 4 },
          { date: "2026-03-19", value: 66.7, trials: 6 },
        ],
      },
    ],
    skillAcquisition: {
      newSkills: [
        "Requests 'more' independently",
        "Points to desired items",
        "Answers 'what' questions",
      ],
      masteredSkills: ["Mands for 'break'", "Follows 'sit down' instruction"],
      maintenanceNeeded: ["Eye contact during greetings"],
    },
    behaviorSummary: {
      targetBehaviors: [
        {
          name: "Tantrums",
          baseline: 5,
          current: 1,
          trend: "decreasing",
        },
        {
          name: "Aggression",
          baseline: 3,
          current: 0,
          trend: "decreasing",
        },
      ],
      replacementBehaviors: [
        {
          name: "Functional communication",
          acquisition: 80,
          generalization: 60,
        },
      ],
    },
    recommendations: [
      "Continue current treatment plan",
      "Begin generalization to home environment",
      "Consider increasing session frequency",
    ],
  };
};

const generateDemoAssessmentReport = (assessmentId: string): any => {
  return {
    reportType: "assessment_report",
    generatedAt: new Date().toISOString(),
    assessment: {
      id: assessmentId,
      type: "VB-MAPP",
      name: "VB-MAPP Milestones Assessment",
      provider: "Emily Chen, BCBA",
      date: "2026-03-15",
    },
    patient: {
      name: "Alex Smith",
      age: "5 years, 3 months",
      dateOfBirth: "2020-12-15",
    },
    results: {
      rawScore: 85,
      standardScore: 92,
      percentile: 30,
      ageEquivalent: "3 years, 6 months",
      descriptiveRating: "Moderate Delay",
      domainScores: [
        {
          domain: "Mand",
          score: 15,
          level: 2,
          description: "Requests items using single words",
        },
        {
          domain: "Tact",
          score: 18,
          level: 2,
          description: "Labels 50+ items",
        },
        {
          domain: "Listener Responding",
          score: 16,
          level: 2,
          description: "Follows 2-step directions",
        },
        {
          domain: "Intraverbal",
          score: 10,
          level: 1,
          description: "Answers simple questions",
        },
        {
          domain: "Echoic",
          score: 12,
          level: 2,
          description: "Imitates 2-3 word phrases",
        },
      ],
    },
    comparison: {
      previousDate: "2025-09-15",
      previousScore: 72,
      change: 13,
      significant: true,
    },
    recommendations: [
      {
        category: "Priority Goals",
        priority: "high",
        description: "Increase intraverbal skills",
        suggestedGoals: ["Answer 'wh-' questions", "Complete fill-in phrases"],
      },
      {
        category: "Maintenance",
        priority: "medium",
        description: "Continue manding and tacting",
        suggestedGoals: ["Expand vocabulary", "Increase sentence length"],
      },
    ],
    nextSteps: [
      "Reassess in 6 months",
      "Focus on intraverbal programming",
      "Begin social skills training",
    ],
  };
};

const generateDemoParentReport = (patientId: string, period: string): any => {
  return {
    reportType: "parent_report",
    generatedAt: new Date().toISOString(),
    child: {
      name: "Alex",
      photo: null,
    },
    period,
    summary: {
      totalSessions: 12,
      attendance: 100,
      milestones: [
        "Started using 2-word phrases!",
        "Learned to ask for breaks",
        "Made a new friend at clinic",
      ],
    },
    highlights: [
      {
        title: "Communication Wins",
        description:
          "Alex is now using 'more' and 'help' without being asked! This is a huge step toward independence.",
        emoji: "🗣️",
      },
      {
        title: "Following Directions",
        description:
          "Alex is getting better at following 2-step directions like 'Get your shoes and sit by the door'.",
        emoji: "👂",
      },
      {
        title: "Calm Transitions",
        description:
          "Using a visual schedule has really helped Alex move between activities without getting upset.",
        emoji: "😊",
      },
    ],
    goalProgress: [
      {
        name: "Asking for things",
        description: "Using words to request favorite items",
        progressEmoji: "⭐⭐⭐",
        progressText: "Great progress!",
        example: "Alex asked for bubbles all by himself!",
      },
      {
        name: "Following directions",
        description: "Completing 2-step instructions",
        progressEmoji: "⭐⭐",
        progressText: "Getting there!",
        example: "Needs a little help, but trying hard",
      },
      {
        name: "Playing with friends",
        description: "Taking turns and sharing",
        progressEmoji: "⭐",
        progressText: "Just started!",
        example: "Working on saying 'my turn'",
      },
    ],
    homeActivities: [
      {
        title: "Practice Manding at Mealtime",
        instructions:
          "During meals, wait for Alex to ask for items before giving them. Start with favorite foods!",
        materials: ["Favorite foods", "Drinks"],
        tips: ["Be patient - wait 5-10 seconds", "Celebrate all attempts!"],
      },
      {
        title: "2-Step Direction Game",
        instructions:
          "Make it fun! Ask Alex to do silly things like 'Touch your nose then jump'.",
        materials: ["No materials needed!"],
        tips: ["Use gestures if needed", "Keep it playful"],
      },
    ],
    upcoming: {
      nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      assessments: ["VB-MAPP reassessment scheduled for September"],
      events: ["Parent training workshop - April 15th"],
    },
  };
};

export const reportsRouter = {
  /**
   * Generate session summary report
   */
  generateSessionSummary: orgAuthed
    .route({
      method: "POST",
      path: "/reports/session-summary",
      summary: "Generate session summary report",
      tags: ["Reports"],
    })
    .input(
      z.object({
        sessionId: z.string().uuid(),
      }),
    )
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: { sessionId: string };
      }) => {
        if (isDemoRequest(context)) {
          return generateDemoSessionSummary(input.sessionId);
        }

        const db = getDb(context);

        // Get session details
        const [session] = await db
          .select()
          .from(sessions)
          .where(
            and(
              eq(sessions.id, input.sessionId),
              eq(
                (sessions as any).organizationId ||
                  (sessions as any).activeOrganizationId,
                context.organization.id,
              ),
            ),
          )
          .limit(1);

        if (!session) {
          throw new Error("Session not found");
        }

        // Get patient details
        const [patient] = await db
          .select()
          .from(patients)
          .where(
            and(
              eq(patients.id, session.patientId),
              eq((patients as any).organizationId, context.organization.id),
            ),
          )
          .limit(1);

        // Get data collection sheets for this session
        const sheets: (typeof dataCollectionSheets.$inferSelect)[] = await db
          .select()
          .from(dataCollectionSheets)
          .where(
            and(
              eq(dataCollectionSheets.sessionId, input.sessionId),
              eq(dataCollectionSheets.organizationId, context.organization.id),
            ),
          );

        // Get therapist details
        const [therapist] = await db
          .select()
          .from(users)
          .where(eq(users.id, session.therapistId))
          .limit(1);

        // Process goals data
        const goalsTargeted = await Promise.all(
          (session.goalsTargeted || []).map(async (goalId: string) => {
            const [goal] = await db
              .select()
              .from(goals)
              .where(eq(goals.id, goalId))
              .limit(1);

            const relatedSheets = sheets.filter((s) => s.goalId === goalId);
            const entries = relatedSheets.flatMap(
              (s) => (s.data as any)?.entries || [],
            );

            const correct = entries.filter(
              (e) => e.response === "Correct" || e.completed === true,
            ).length;

            return {
              goalId,
              name: goal?.name || "Unknown Goal",
              domain: goal?.domain || "General",
              trials: entries.length,
              correct,
              percentage:
                entries.length > 0
                  ? Math.round((correct / entries.length) * 100)
                  : 0,
              promptLevel: "Various", // Simplified
              notes: relatedSheets
                .map((s) => s.notes)
                .filter(Boolean)
                .join(" "),
            };
          }),
        );

        return {
          reportType: "session_summary",
          generatedAt: new Date().toISOString(),
          session: {
            id: session.id,
            date: session.scheduledStart.toISOString().split("T")[0],
            duration: session.durationMinutes,
            therapist: therapist?.name || "Unknown",
            type: session.type,
            location: session.location || "Not specified",
          },
          patient: {
            name: `${patient?.firstName} ${patient?.lastName}`,
            age: patient?.dateOfBirth
              ? calculateAge(patient.dateOfBirth)
              : "Unknown",
            diagnosis: patient?.diagnosis || "Not specified",
          },
          goalsTargeted,
          behaviors: (session.behaviors as any[]) || [],
          reinforcers: session.activities
            ? (session.activities as any[]).map((a) => a.name)
            : [],
          summary: session.notes || "",
          recommendations: [], // Could be derived from goal analysis
          nextSession: null,
        };
      },
    ),

  /**
   * Generate progress report
   */
  generateProgressReport: orgAuthed
    .route({
      method: "POST",
      path: "/reports/progress-report",
      summary: "Generate progress report",
      tags: ["Reports"],
    })
    .input(
      z.object({
        patientId: z.string().uuid(),
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: { patientId: string; startDate: string; endDate: string };
      }) => {
        if (isDemoRequest(context)) {
          return generateDemoProgressReport(
            input.patientId,
            input.startDate,
            input.endDate,
          );
        }

        const db = getDb(context);
        const start = new Date(input.startDate);
        const end = new Date(input.endDate);

        // Get patient
        const [patient] = await db
          .select()
          .from(patients)
          .where(
            and(
              eq(patients.id, input.patientId),
              eq((patients as any).organizationId, context.organization.id),
            ),
          )
          .limit(1);

        if (!patient) {
          throw new Error("Patient not found");
        }

        // Get sessions in date range
        const patientSessions: (typeof sessions.$inferSelect)[] = await db
          .select()
          .from(sessions)
          .where(
            and(
              eq((sessions as any).patientId, input.patientId),
              eq(
                (sessions as any).organizationId ||
                  (sessions as any).activeOrganizationId,
                context.organization.id,
              ),
              gte((sessions as any).scheduledStart, start),
              lte((sessions as any).scheduledStart, end),
            ),
          );

        // Get active goals
        const activeGoals: (typeof goals.$inferSelect)[] = await db
          .select()
          .from(goals)
          .where(
            and(
              eq(goals.patientId, input.patientId),
              eq(goals.organizationId, context.organization.id),
              eq(goals.status, "active"),
            ),
          );

        // Calculate goals progress
        const goalsProgress = await Promise.all(
          activeGoals.map(async (goal) => {
            const progressData: (typeof goalProgress.$inferSelect)[] = await db
              .select()
              .from(goalProgress)
              .where(
                and(
                  eq(goalProgress.goalId, goal.id),
                  gte(goalProgress.recordedAt, start),
                  lte(goalProgress.recordedAt, end),
                ),
              )
              .orderBy(goalProgress.recordedAt);

            const dataPoints = progressData.map((p) => ({
              date: p.recordedAt.toISOString().split("T")[0],
              value: Number(p.value),
              trials: p.totalTrials || 0,
            }));

            const currentValue =
              dataPoints.length > 0
                ? dataPoints[dataPoints.length - 1].value
                : 0;

            return {
              goalId: goal.id,
              name: goal.name,
              baseline: Number(goal.baselineValue) || 0,
              current: currentValue,
              target: Number(goal.targetValue) || 0,
              trend:
                currentValue > Number(goal.baselineValue || 0)
                  ? "improving"
                  : "stable",
              masterySessions: progressData.filter(
                (p) => Number(p.value) >= Number(goal.masteryCriteria || 80),
              ).length,
              totalSessions: progressData.length,
              dataPoints,
            };
          }),
        );

        return {
          reportType: "progress_report",
          generatedAt: new Date().toISOString(),
          period: { start: input.startDate, end: input.endDate },
          patient: {
            id: patient.id,
            name: `${patient.firstName} ${patient.lastName}`,
            age: patient.dateOfBirth
              ? calculateAge(patient.dateOfBirth)
              : "Unknown",
            therapist: patient.assignedTherapistId || "Not assigned",
          },
          summary: {
            totalSessions: patientSessions.length,
            attendance: 100, // Calculate based on scheduled vs completed
            averageDuration: Math.round(
              patientSessions.reduce(
                (sum: number, s) => sum + (s.durationMinutes || 0),
                0,
              ) / (patientSessions.length || 1),
            ),
            newGoalsMastered: 0, // Calculate based on mastery criteria
            goalsInProgress: activeGoals.length,
          },
          goalsProgress,
          skillAcquisition: {
            newSkills: [],
            masteredSkills: [],
            maintenanceNeeded: [],
          },
          behaviorSummary: {
            targetBehaviors: [],
            replacementBehaviors: [],
          },
          recommendations: [],
        };
      },
    ),

  /**
   * Generate assessment report
   */
  generateAssessmentReport: orgAuthed
    .route({
      method: "POST",
      path: "/reports/assessment-report",
      summary: "Generate assessment report",
      tags: ["Reports"],
    })
    .input(
      z.object({
        assessmentId: z.string().uuid(),
      }),
    )
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: { assessmentId: string };
      }) => {
        if (isDemoRequest(context)) {
          return generateDemoAssessmentReport(input.assessmentId);
        }

        const db = getDb(context);

        const [assessment] = await db
          .select()
          .from(assessments)
          .where(
            and(
              eq(assessments.id, input.assessmentId),
              eq(assessments.organizationId, context.organization.id),
            ),
          )
          .limit(1);

        if (!assessment) {
          throw new Error("Assessment not found");
        }

        const [patient] = await db
          .select()
          .from(patients)
          .where(
            and(
              eq(patients.id, assessment.patientId),
              eq((patients as any).organizationId, context.organization.id),
            ),
          )
          .limit(1);

        return {
          reportType: "assessment_report",
          generatedAt: new Date().toISOString(),
          assessment: {
            id: assessment.id,
            type: assessment.type,
            name: assessment.name,
            provider: assessment.provider,
            date: assessment.completedDate?.toISOString() || "",
          },
          patient: {
            name: `${patient?.firstName} ${patient?.lastName}`,
            age: patient?.dateOfBirth
              ? calculateAge(patient.dateOfBirth)
              : "Unknown",
            dateOfBirth: patient?.dateOfBirth?.toISOString(),
          },
          results: assessment.results,
          recommendations: [],
          nextSteps: [],
        };
      },
    ),

  /**
   * Generate parent report
   */
  generateParentReport: orgAuthed
    .route({
      method: "POST",
      path: "/reports/parent-report",
      summary: "Generate parent-friendly report",
      tags: ["Reports"],
    })
    .input(
      z.object({
        patientId: z.string().uuid(),
        period: z.string(), // e.g., "March 2026"
      }),
    )
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: { patientId: string; period: string };
      }) => {
        if (isDemoRequest(context)) {
          return generateDemoParentReport(input.patientId, input.period);
        }

        const db = getDb(context);

        const [patient] = await db
          .select()
          .from(patients)
          .where(
            and(
              eq(patients.id, input.patientId),
              eq((patients as any).organizationId, context.organization.id),
            ),
          )
          .limit(1);

        if (!patient) {
          throw new Error("Patient not found");
        }

        // Get recent sessions
        const recentSessions: (typeof sessions.$inferSelect)[] = await db
          .select()
          .from(sessions)
          .where(
            and(
              eq((sessions as any).patientId, input.patientId),
              eq(
                (sessions as any).organizationId ||
                  (sessions as any).activeOrganizationId,
                context.organization.id,
              ),
            ),
          )
          .orderBy(desc((sessions as any).scheduledStart))
          .limit(10);

        // Get goal progress
        const patientGoals: (typeof goals.$inferSelect)[] = await db
          .select()
          .from(goals)
          .where(
            and(
              eq(goals.patientId, input.patientId),
              eq(goals.organizationId, context.organization.id),
            ),
          );

        return {
          reportType: "parent_report",
          generatedAt: new Date().toISOString(),
          child: {
            name: patient.firstName,
            photo: null,
          },
          period: input.period,
          summary: {
            totalSessions: recentSessions.length,
            attendance: 100,
            milestones: [],
          },
          highlights: [],
          goalProgress: patientGoals.map((goal) => ({
            name: goal.name,
            description: goal.description || "",
            progressEmoji: "⭐",
            progressText: "In progress",
            example: "",
          })),
          homeActivities: [],
          upcoming: {
            nextSession: recentSessions[0]?.scheduledStart || null,
            assessments: [],
            events: [],
          },
        };
      },
    ),

  /**
   * List generated reports
   */
  list: orgAuthed
    .route({
      method: "GET",
      path: "/reports",
      summary: "List generated reports",
      tags: ["Reports"],
    })
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
        patientId: z.string().optional(),
        reportType: ReportType.optional(),
      }),
    )
    .output(
      z.object({
        data: z.array(z.any()),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
      }),
    )
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: {
          page: number;
          limit: number;
          patientId?: string;
          reportType?: z.infer<typeof ReportType>;
        };
      }) => {
        // For now, return empty list as reports are generated on-demand
        // In production, you'd store generated reports in a table
        return {
          data: [],
          total: 0,
          page: input.page,
          limit: input.limit,
          totalPages: 0,
        };
      },
    ),
};

// Helper function to calculate age
function calculateAge(dateOfBirth: Date): string {
  const now = new Date();
  const diff = now.getTime() - dateOfBirth.getTime();
  const ageDate = new Date(diff);
  const years = ageDate.getUTCFullYear() - 1970;
  const months = ageDate.getUTCMonth();

  if (years === 0) {
    return `${months} months`;
  } else if (months === 0) {
    return `${years} years`;
  } else {
    return `${years} years, ${months} months`;
  }
}
