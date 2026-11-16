#!/usr/bin/env node
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the local database.");
}

const sql = postgres(databaseUrl, { max: 1 });

try {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sessionEnd = new Date(today.getTime() + 60 * 60 * 1000);

  await sql.begin(async (transaction) => {
    await transaction`
      INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
      VALUES ('local-clinician-001', 'Jordan Lee', 'jordan@example.local', true, ${now}, ${now})
      ON CONFLICT (id) DO NOTHING
    `;
    await transaction`
      INSERT INTO organization (id, name, slug, created_at, updated_at)
      VALUES ('local-org-001', 'Harbor Care ABA', 'harbor-care', ${now}, ${now})
      ON CONFLICT (id) DO NOTHING
    `;
    await transaction`
      INSERT INTO member (id, organization_id, user_id, role, created_at)
      VALUES ('local-member-001', 'local-org-001', 'local-clinician-001', 'owner', ${now})
      ON CONFLICT (id) DO NOTHING
    `;
    await transaction`
      INSERT INTO patients (
        id, organization_id, first_name, last_name, date_of_birth, diagnosis,
        primary_language, preferred_communication, status, assigned_therapist_id,
        created_by, created_at, updated_at
      ) VALUES (
        'local-patient-maya', 'local-org-001', 'Maya', 'Rivera', '2018-06-12',
        'Autism spectrum disorder', 'en', 'aac_and_verbal', 'active',
        'local-clinician-001', 'local-clinician-001', ${now}, ${now}
      ) ON CONFLICT (id) DO NOTHING
    `;
    await transaction`
      INSERT INTO goals (
        id, organization_id, patient_id, name, description, category, target_behavior,
        baseline_value, target_value, current_value, unit, mastery_criteria, status,
        priority, start_date, created_by, created_at, updated_at
      ) VALUES (
        'local-goal-requesting', 'local-org-001', 'local-patient-maya',
        'Requests preferred items', 'Maya will independently request a preferred item.',
        'Communication', 'Functional requests', 40, 80, 72, '%', 80, 'active',
        'high', ${today}, 'local-clinician-001', ${now}, ${now}
      ) ON CONFLICT (id) DO NOTHING
    `;
    await transaction`
      INSERT INTO sessions (
        id, organization_id, patient_id, therapist_id, type, status, scheduled_start,
        scheduled_end, actual_start, duration_minutes, location, room, telehealth,
        notes, created_by, created_at, updated_at
      ) VALUES (
        'local-session-today', 'local-org-001', 'local-patient-maya',
        'local-clinician-001', 'ABA direct therapy', 'in-progress', ${today},
        ${sessionEnd}, ${today}, 60, 'Clinic', 'Room 2', false,
        'Local development session.', 'local-clinician-001', ${now}, ${now}
      ) ON CONFLICT (id) DO NOTHING
    `;
  });

  console.log(JSON.stringify({ ok: true, seed: "local-clinical-demo" }, null, 2));
} finally {
  await sql.end();
}
