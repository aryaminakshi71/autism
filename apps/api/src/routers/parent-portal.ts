/**
 * Parent Portal Router
 *
 * Parent communication and engagement features for autism care.
 * Includes session notes, messaging, home activities, and progress sharing.
 */

import {
  getOrCache,
  invalidateCache,
} from "@autism-legacy-20260205/storage/redis";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import type { OrgContext } from "../context";
import { isDemoRequest } from "../lib/demo";
import { getDb, orgAuthed, schema } from "../procedures";

const { sessions, parentResources, parentNotes, parentMessages, patients } =
  schema;

// Demo data
const demoParentNotes: any[] = [
  {
    id: "demo-note-001",
    sessionId: "demo-session-001",
    patientId: "demo-patient-001",
    organizationId: "demo-org",
    date: "2026-03-28",
    sessionType: "Direct Therapy",
    duration: 60,
    summary:
      "Today we worked on manding for preferred items. Alex did great requesting bubbles and the iPad!",
    wins: [
      "Requested bubbles independently 5 times",
      "Used 'more' sign without prompting",
      "Sat at the table for 20 minutes",
    ],
    challenges: [
      "Needed hand-over-hand for hand-washing",
      "Got upset during transition to cleanup",
    ],
    homePractice: [
      {
        skill: "Asking for things",
        howToPractice: "Put favorite toys slightly out of reach",
        timeNeeded: "5-10 minutes",
      },
      {
        skill: "Following directions",
        howToPractice: "Give 1-step directions during daily routines",
        timeNeeded: "Throughout the day",
      },
    ],
    photos: [],
    therapistNote:
      "Great session! Alex is making excellent progress on functional communication.",
    parentAcknowledged: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-note-002",
    sessionId: "demo-session-002",
    patientId: "demo-patient-001",
    organizationId: "demo-org",
    date: "2026-03-26",
    sessionType: "Social Skills Group",
    duration: 45,
    summary:
      "Alex participated in group activities with 2 other children. Worked on turn-taking and sharing.",
    wins: [
      "Waited for his turn 3 times",
      "Shared toys when asked",
      "Said 'hi' to a peer",
    ],
    challenges: [
      "Needed prompting to stay with the group",
      "Short attention span during circle time",
    ],
    homePractice: [
      {
        skill: "Turn-taking",
        howToPractice: "Play simple turn-taking games at home",
        timeNeeded: "10 minutes",
      },
    ],
    photos: ["demo-photo-001.jpg"],
    therapistNote: "Good progress in social skills!",
    parentAcknowledged: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const demoParentMessages: any[] = [
  {
    id: "demo-msg-001",
    patientId: "demo-patient-001",
    organizationId: "demo-org",
    fromUserId: "demo-therapist-001",
    toUserId: "demo-parent-001",
    subject: "Great progress this week!",
    message:
      "Hi! Just wanted to let you know that Alex had a wonderful week. He's been independently requesting his favorite activities using complete phrases. Let me know if you'd like to discuss strategies for home practice!",
    attachments: [],
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-msg-002",
    patientId: "demo-patient-001",
    organizationId: "demo-org",
    fromUserId: "demo-parent-001",
    toUserId: "demo-therapist-001",
    subject: "Question about home practice",
    message:
      "Hi Sarah, I've been practicing the manding strategies at home, but Alex seems to get frustrated when I don't give him the item immediately. Any tips for managing this?",
    attachments: [],
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const getDemoParentNotes = (
  page: number,
  limit: number,
  patientId?: string,
  acknowledged?: boolean,
) => {
  let filtered = [...demoParentNotes];

  if (patientId) {
    filtered = filtered.filter((n) => n.patientId === patientId);
  }
  if (acknowledged !== undefined) {
    filtered = filtered.filter((n) => n.parentAcknowledged === acknowledged);
  }

  const total = filtered.length;
  const offset = (page - 1) * limit;
  const data = filtered.slice(offset, offset + limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getDemoParentMessages = (
  page: number,
  limit: number,
  patientId?: string,
  unreadOnly?: boolean,
) => {
  let filtered = [...demoParentMessages];

  if (patientId) {
    filtered = filtered.filter((m) => m.patientId === patientId);
  }
  if (unreadOnly) {
    filtered = filtered.filter((m) => !m.isRead);
  }

  const total = filtered.length;
  const offset = (page - 1) * limit;
  const data = filtered.slice(offset, offset + limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const parentPortalRouter = {
  /**
   * List parent notes (session summaries for parents)
   */
  listNotes: orgAuthed
    .route({
      method: "GET",
      path: "/parent/notes",
      summary: "List parent session notes",
      tags: ["Parent Portal"],
    })
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        patientId: z.string().optional(),
        acknowledged: z.boolean().optional(),
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
          acknowledged?: boolean;
        };
      }) => {
        if (isDemoRequest(context)) {
          return getDemoParentNotes(
            input.page,
            input.limit,
            input.patientId,
            input.acknowledged,
          );
        }

        const db = getDb(context);
        const offset = (input.page - 1) * input.limit;

        const conditions = [
          eq(parentNotes.organizationId, context.organization.id),
        ];
        if (input.patientId) {
          conditions.push(eq(parentNotes.patientId, input.patientId));
        }
        if (input.acknowledged !== undefined) {
          conditions.push(
            eq(parentNotes.parentAcknowledged, input.acknowledged),
          );
        }

        const cacheKey = `parent:notes:${context.organization.id}:${input.patientId || "all"}:${input.page}`;

        return getOrCache(
          cacheKey,
          async () => {
            const notes = await db
              .select()
              .from(parentNotes)
              .where(and(...conditions))
              .orderBy(desc(parentNotes.createdAt))
              .limit(input.limit)
              .offset(offset);

            const [{ count }] = await db
              .select({ count: sql<number>`count(*)::int` })
              .from(parentNotes)
              .where(and(...conditions));

            return {
              data: notes,
              total: Number(count),
              page: input.page,
              limit: input.limit,
              totalPages: Math.ceil(Number(count) / input.limit),
            };
          },
          300,
        );
      },
    ),

  /**
   * Create parent note
   */
  createNote: orgAuthed
    .route({
      method: "POST",
      path: "/parent/notes",
      summary: "Create parent session note",
      tags: ["Parent Portal"],
    })
    .input(
      z.object({
        patientId: z.string().uuid(),
        sessionId: z.string().uuid().optional(),
        summary: z.string(),
        wins: z.array(z.string()).default([]),
        challenges: z.array(z.string()).default([]),
        homePractice: z
          .array(
            z.object({
              skill: z.string(),
              howToPractice: z.string(),
              timeNeeded: z.string(),
            }),
          )
          .default([]),
        photos: z.array(z.string()).default([]),
        therapistNote: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: {
          patientId: string;
          sessionId?: string;
          summary: string;
          wins: string[];
          challenges: string[];
          homePractice: any[];
          photos: string[];
          therapistNote?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return {
            id: `demo-note-${Date.now()}`,
            organizationId: context.organization.id,
            ...input,
            date: new Date().toISOString().split("T")[0],
            parentAcknowledged: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }

        const db = getDb(context);

        // Get session details if provided
        let sessionType = "Not specified";
        let duration = 0;
        if (input.sessionId) {
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
          if (session) {
            sessionType = session.type;
            duration = session.durationMinutes || 0;
          }
        }

        const [note] = await db
          .insert(parentNotes)
          .values({
            organizationId: context.organization.id,
            patientId: input.patientId,
            sessionId: input.sessionId,
            date: new Date().toISOString().split("T")[0],
            sessionType,
            duration,
            summary: input.summary,
            wins: input.wins,
            challenges: input.challenges,
            homePractice: input.homePractice,
            photos: input.photos,
            therapistNote: input.therapistNote,
            parentAcknowledged: false,
          })
          .returning();

        await invalidateCache(`parent:notes:${context.organization.id}`);

        return note;
      },
    ),

  /**
   * Acknowledge parent note
   */
  acknowledgeNote: orgAuthed
    .route({
      method: "POST",
      path: "/parent/notes/:id/acknowledge",
      summary: "Acknowledge parent note",
      tags: ["Parent Portal"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: { id: string };
      }) => {
        if (isDemoRequest(context)) {
          const note = demoParentNotes.find((n) => n.id === input.id);
          if (!note) throw new Error("Note not found");
          note.parentAcknowledged = true;
          note.updatedAt = new Date().toISOString();
          return note;
        }

        const db = getDb(context);

        const [updated] = await db
          .update(parentNotes)
          .set({
            parentAcknowledged: true,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(parentNotes.id, input.id),
              eq(parentNotes.organizationId, context.organization.id),
            ),
          )
          .returning();

        await invalidateCache(`parent:notes:${context.organization.id}`);

        return updated;
      },
    ),

  /**
   * List parent messages
   */
  listMessages: orgAuthed
    .route({
      method: "GET",
      path: "/parent/messages",
      summary: "List parent messages",
      tags: ["Parent Portal"],
    })
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        patientId: z.string().optional(),
        unreadOnly: z.boolean().default(false),
      }),
    )
    .output(
      z.object({
        data: z.array(z.any()),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
        unreadCount: z.number(),
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
          unreadOnly?: boolean;
        };
      }) => {
        if (isDemoRequest(context)) {
          const result = getDemoParentMessages(
            input.page,
            input.limit,
            input.patientId,
            input.unreadOnly,
          );
          return {
            ...result,
            unreadCount: demoParentMessages.filter((m) => !m.isRead).length,
          };
        }

        const db = getDb(context);
        const offset = (input.page - 1) * input.limit;

        const conditions = [
          eq(parentMessages.organizationId, context.organization.id),
        ];
        if (input.patientId) {
          conditions.push(eq(parentMessages.patientId, input.patientId));
        }
        if (input.unreadOnly) {
          conditions.push(eq(parentMessages.isRead, false));
        }

        const messages = await db
          .select()
          .from(parentMessages)
          .where(and(...conditions))
          .orderBy(desc(parentMessages.createdAt))
          .limit(input.limit)
          .offset(offset);

        const [{ count }] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(parentMessages)
          .where(and(...conditions));

        const [{ unreadCount }] = await db
          .select({ unreadCount: sql<number>`count(*)::int` })
          .from(parentMessages)
          .where(
            and(
              eq(parentMessages.organizationId, context.organization.id),
              input.patientId
                ? eq(parentMessages.patientId, input.patientId)
                : undefined,
              eq(parentMessages.isRead, false),
            ),
          );

        return {
          data: messages,
          total: Number(count),
          page: input.page,
          limit: input.limit,
          totalPages: Math.ceil(Number(count) / input.limit),
          unreadCount: Number(unreadCount),
        };
      },
    ),

  /**
   * Send message to parent
   */
  sendMessage: orgAuthed
    .route({
      method: "POST",
      path: "/parent/messages",
      summary: "Send message to parent",
      tags: ["Parent Portal"],
    })
    .input(
      z.object({
        patientId: z.string().uuid(),
        toUserId: z.string(),
        subject: z.string(),
        message: z.string(),
        attachments: z.array(z.string()).default([]),
      }),
    )
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: {
          patientId: string;
          toUserId: string;
          subject: string;
          message: string;
          attachments: string[];
        };
      }) => {
        if (isDemoRequest(context)) {
          return {
            id: `demo-msg-${Date.now()}`,
            organizationId: context.organization.id,
            fromUserId: context.user.id,
            ...input,
            isRead: false,
            createdAt: new Date().toISOString(),
          };
        }

        const db = getDb(context);

        const [msg] = await db
          .insert(parentMessages)
          .values({
            organizationId: context.organization.id,
            patientId: input.patientId,
            fromUserId: context.user.id,
            toUserId: input.toUserId,
            subject: input.subject,
            message: input.message,
            attachments: input.attachments,
            isRead: false,
          })
          .returning();

        await invalidateCache(`parent:messages:${context.organization.id}`);

        return msg;
      },
    ),

  /**
   * Mark message as read
   */
  markMessageRead: orgAuthed
    .route({
      method: "POST",
      path: "/parent/messages/:id/read",
      summary: "Mark message as read",
      tags: ["Parent Portal"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: { id: string };
      }) => {
        if (isDemoRequest(context)) {
          const msg = demoParentMessages.find((m) => m.id === input.id);
          if (!msg) throw new Error("Message not found");
          msg.isRead = true;
          return msg;
        }

        const db = getDb(context);

        const [updated] = await db
          .update(parentMessages)
          .set({ isRead: true })
          .where(
            and(
              eq(parentMessages.id, input.id),
              eq(parentMessages.organizationId, context.organization.id),
            ),
          )
          .returning();

        await invalidateCache(`parent:messages:${context.organization.id}`);

        return updated;
      },
    ),

  /**
   * Get home activities/resources
   */
  getHomeActivities: orgAuthed
    .route({
      method: "GET",
      path: "/parent/home-activities",
      summary: "Get recommended home activities",
      tags: ["Parent Portal"],
    })
    .input(
      z.object({
        patientId: z.string().optional(),
        category: z.string().optional(),
        ageMin: z.number().optional(),
        ageMax: z.number().optional(),
      }),
    )
    .output(z.array(z.any()))
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: {
          patientId?: string;
          category?: string;
          ageMin?: number;
          ageMax?: number;
        };
      }) => {
        if (isDemoRequest(context)) {
          return [
            {
              id: "demo-activity-001",
              title: "Practice Manding at Mealtime",
              category: "Communication",
              description:
                "Place favorite foods slightly out of reach and wait for your child to request them",
              materials: ["Favorite foods", "Drinks"],
              duration: 10,
              difficulty: "easy",
              tips: [
                "Wait 5-10 seconds",
                "Celebrate all attempts",
                "Use visual supports if needed",
              ],
            },
            {
              id: "demo-activity-002",
              title: "Turn-Taking Game",
              category: "Social Skills",
              description: "Play simple games that require taking turns",
              materials: ["Ball", "Toys", "Board game"],
              duration: 15,
              difficulty: "medium",
              tips: [
                "Use visual cue cards",
                "Start with short turns",
                "Provide lots of praise",
              ],
            },
          ];
        }

        const db = getDb(context);

        const conditions = [
          eq(parentResources.organizationId, context.organization.id),
          eq(parentResources.isPublished, true),
        ];

        if (input.category) {
          conditions.push(eq(parentResources.category, input.category));
        }
        if (input.ageMin !== undefined) {
          conditions.push(
            eq(
              sql<boolean>`${parentResources.targetAgeMax} >= ${input.ageMin}`,
              true,
            ),
          );
        }
        if (input.ageMax !== undefined) {
          conditions.push(
            eq(
              sql<boolean>`${parentResources.targetAgeMin} <= ${input.ageMax}`,
              true,
            ),
          );
        }

        const resources: (typeof parentResources.$inferSelect)[] = await db
          .select()
          .from(parentResources)
          .where(and(...conditions))
          .orderBy(parentResources.category);

        return resources.map((r) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          description: r.description,
          duration: r.duration,
          content: r.content,
        }));
      },
    ),

  /**
   * Get parent dashboard stats
   */
  getDashboardStats: orgAuthed
    .route({
      method: "GET",
      path: "/parent/dashboard-stats",
      summary: "Get parent portal dashboard statistics",
      tags: ["Parent Portal"],
    })
    .input(
      z.object({
        patientId: z.string().optional(),
      }),
    )
    .output(
      z.object({
        unreadMessages: z.number(),
        unacknowledgedNotes: z.number(),
        recentSessions: z.number(),
        upcomingSessions: z.number(),
        milestonesThisMonth: z.number(),
      }),
    )
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: { patientId?: string };
      }) => {
        if (isDemoRequest(context)) {
          return {
            unreadMessages: 1,
            unacknowledgedNotes: 1,
            recentSessions: 8,
            upcomingSessions: 2,
            milestonesThisMonth: 3,
          };
        }

        const db = getDb(context);

        const conditions = [
          eq(parentMessages.organizationId, context.organization.id),
          eq(parentMessages.isRead, false),
        ];
        if (input.patientId) {
          conditions.push(eq(parentMessages.patientId, input.patientId));
        }

        const [{ unreadMessages }] = await db
          .select({ unreadMessages: sql<number>`count(*)::int` })
          .from(parentMessages)
          .where(and(...conditions));

        const noteConditions = [
          eq(parentNotes.organizationId, context.organization.id),
          eq(parentNotes.parentAcknowledged, false),
        ];
        if (input.patientId) {
          noteConditions.push(eq(parentNotes.patientId, input.patientId));
        }

        const [{ unacknowledgedNotes }] = await db
          .select({ unacknowledgedNotes: sql<number>`count(*)::int` })
          .from(parentNotes)
          .where(and(...noteConditions));

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const sessionConditions = [
          eq(
            (sessions as any).organizationId ||
              (sessions as any).activeOrganizationId,
            context.organization.id,
          ),
        ];
        if (input.patientId) {
          sessionConditions.push(
            eq((sessions as any).patientId, input.patientId),
          );
        }

        const [{ recentSessions }] = await db
          .select({ recentSessions: sql<number>`count(*)::int` })
          .from(sessions)
          .where(
            and(
              ...sessionConditions,
              eq((sessions as any).status, "completed"),
              eq(
                sql<boolean>`${(sessions as any).scheduledStart} >= ${thirtyDaysAgo}`,
                true,
              ),
            ),
          );

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [{ upcomingSessions }] = await db
          .select({ upcomingSessions: sql<number>`count(*)::int` })
          .from(sessions)
          .where(
            and(
              ...sessionConditions,
              eq((sessions as any).status, "scheduled"),
              eq(
                sql<boolean>`${(sessions as any).scheduledStart} >= ${tomorrow}`,
                true,
              ),
            ),
          );

        return {
          unreadMessages: Number(unreadMessages),
          unacknowledgedNotes: Number(unacknowledgedNotes),
          recentSessions: Number(recentSessions),
          upcomingSessions: Number(upcomingSessions),
          milestonesThisMonth: 0, // Would need separate tracking
        };
      },
    ),
};
