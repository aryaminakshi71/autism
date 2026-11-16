# Data Collection, BCBA Reports & Parent Reports - Improvement Guide

## Overview

This guide outlines comprehensive improvements for the Autism Care Platform's data collection system, BCBA (Board Certified Behavior Analyst) reporting, and parent communication features.

## 1. Enhanced Data Collection System

### A. Data Collection Templates (NEW)

I've created a new router (`data-collection-templates.ts`) with 8 built-in ABA data collection methods:

1. **Discrete Trial Training (DTT)**
   - Track individual trials with prompt levels
   - Record correct/incorrect responses
   - Measure latency for each trial
   - Automatic percentage calculation

2. **Task Analysis**
   - Break complex tasks into sequential steps
   - Track completion and prompt levels per step
   - Visual progress indicators
   - Chaining options (forward/backward)

3. **Frequency Recording**
   - Count occurrences of target behaviors
   - Rate calculation (per minute/hour)
   - Multiple behavior tracking simultaneously

4. **Duration Recording**
   - Measure how long behaviors last
   - Start/stop timing with precision
   - Average duration calculations

5. **Latency Recording**
   - Time between instruction and response
   - Critical for measuring processing speed
   - Baseline and progress tracking

6. **Partial Interval Recording**
   - Record if behavior occurred at any point during interval
   - Good for high-frequency behaviors

7. **Whole Interval Recording**
   - Record if behavior occurred throughout entire interval
   - Good for measuring continuous behaviors

8. **Momentary Time Sampling**
   - Record if behavior is occurring at the end of interval
   - Efficient for multiple behaviors

### Database Schema Added

New tables created:
- `data_collection_templates` - Configuration templates
- `data_collection_sheets` - Actual data collection instances

### Usage

```typescript
// List available templates
const templates = await orpc.dataCollectionTemplates.list.query({
  includeBuiltIn: true
});

// Create a new data collection sheet
const sheet = await orpc.dataCollectionSheets.create.mutate({
  templateId: "builtin-dtt",
  patientId: "patient-id",
  goalId: "goal-id",
  name: "Manding Session - 2026-03-28"
});

// Record trial data
await orpc.dataCollectionSheets.addEntry.mutate({
  sheetId: sheet.id,
  entry: {
    trialNumber: 1,
    promptLevel: "Gestural",
    response: "Correct",
    latencySeconds: 2.5
  }
});
```

## 2. BCBA Reports System

### A. Session Summary Report

Comprehensive report for each therapy session:

```typescript
interface SessionSummaryReport {
  sessionId: string;
  patientInfo: {
    name: string;
    age: number;
    diagnosis: string;
  };
  sessionDetails: {
    date: Date;
    duration: number;
    therapist: string;
    type: string;
  };
  goalsTargeted: {
    goalId: string;
    name: string;
    trials: number;
    correct: number;
    percentage: number;
    promptLevel: string;
  }[];
  behaviors: {
    type: string;
    frequency: number;
    interventions: string[];
    outcomes: string[];
  }[];
  summary: string;
  recommendations: string[];
}
```

### B. Progress Report (Weekly/Monthly)

Track goal mastery over time:

```typescript
interface ProgressReport {
  patientId: string;
  period: {
    start: Date;
    end: Date;
  };
  goalsProgress: {
    goalId: string;
    name: string;
    baseline: number;
    current: number;
    target: number;
    trend: "improving" | "stable" | "declining";
    masterySessions: number;
    totalSessions: number;
    dataPoints: {
      date: Date;
      value: number;
      trials: number;
    }[];
  }[];
  skillAcquisition: {
    newSkills: string[];
    masteredSkills: string[];
    maintenanceNeeded: string[];
  };
  behaviorSummary: {
    targetBehaviors: {
      name: string;
      baseline: number;
      current: number;
      trend: string;
    }[];
    replacementBehaviors: {
      name: string;
      acquisition: number;
      generalization: number;
    }[];
  };
}
```

### C. Assessment Report

Generate reports from standardized assessments:

```typescript
interface AssessmentReport {
  assessmentId: string;
  patientInfo: PatientInfo;
  assessmentType: "ADOS-2" | "VB-MAPP" | "CARS-2" | "M-CHAT-R/F" | "Custom";
  results: {
    rawScore?: number;
    standardScore?: number;
    percentile?: number;
    ageEquivalent?: string;
    descriptiveRating?: string;
    domainScores: {
      domain: string;
      score: number;
      percentile?: number;
      description: string;
    }[];
  };
  comparison?: {
    previousDate: Date;
    previousScore: number;
    change: number;
    significant: boolean;
  };
  recommendations: {
    category: string;
    priority: "high" | "medium" | "low";
    description: string;
    suggestedGoals: string[];
  }[];
  nextSteps: string[];
}
```

### D. Data Analysis Dashboard for BCBAs

Features needed:

1. **Visual Analytics**
   - Line graphs for goal progress
   - Bar charts for frequency data
   - Heat maps for session attendance
   - Scatter plots for correlation analysis

2. **Statistical Insights**
   - Trend analysis (linear regression)
   - Celeration charts (rate of change)
   - Variability indicators
   - Confidence intervals

3. **Comparison Tools**
   - Compare multiple goals
   - Compare across time periods
   - Compare against baseline
   - Peer comparison (anonymized)

## 3. Parent Reports & Communication

### A. Parent-Friendly Progress Report

Simplified version of BCBA report with:

```typescript
interface ParentReport {
  childInfo: {
    name: string;
    age: string;
    photo?: string;
  };
  period: string;
  summary: {
    totalSessions: number;
    attendance: number;
    milestones: string[];
  };
  highlights: {
    title: string;
    description: string;
    emoji: string;
  }[];
  goalProgress: {
    name: string;
    description: string;
    progressEmoji: string;
    progressText: string; // "Working on it", "Almost there!", "Mastered!"
    example: string; // Real example child demonstrated
  }[];
  homeActivities: {
    title: string;
    instructions: string;
    materials: string[];
    tips: string[];
  }[];
  upcoming: {
    nextSession: Date;
    assessments: string[];
    events: string[];
  };
}
```

### B. Daily Session Notes for Parents

Quick summary after each session:

```typescript
interface DailySessionNote {
  date: Date;
  sessionType: string;
  duration: number;
  summary: string; // "Today we worked on manding for preferred items..."
  wins: string[]; // ["Requested water independently 5 times!"]
  challenges: string[]; // ["Needed prompting for hand-washing sequence"]
  homePractice: {
    skill: string;
    howToPractice: string;
    timeNeeded: string;
  }[];
  photos: string[]; // Optional, with consent
  therapistNote: string;
}
```

### C. Parent Portal Features

1. **Real-Time Updates**
   - Push notifications for session completion
   - Live progress tracking during session
   - Immediate alert for concerns

2. **Communication Hub**
   - Secure messaging with therapy team
   - Share videos/pictures of home practice
   - Schedule meetings/observations
   - Document home data

3. **Resource Library**
   - Curated articles based on child's goals
   - Video tutorials for home strategies
   - Downloadable visual supports
   - Community forum (moderated)

4. **Data Visualization for Parents**
   - Simple progress charts
   - "Growth garden" gamification
   - Milestone celebrations
   - Goal achievement certificates

## 4. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

1. ✅ Create data collection templates router
2. ✅ Add database schema for data sheets
3. Create data sheets router (CRUD operations)
4. Add template-to-goal linking

### Phase 2: Data Collection UI (Weeks 3-4)

1. Build data collection interface
   - DTT trial recorder
   - Task analysis checklist
   - Frequency counter
   - Duration timer
2. Add offline mode for mobile
3. Sync when online

### Phase 3: BCBA Reports (Weeks 5-6)

1. Create report generation service
2. Build session summary reports
3. Build progress reports with visualizations
4. Add export (PDF, Excel, CSV)

### Phase 4: Parent Portal (Weeks 7-8)

1. Create parent-friendly report templates
2. Build daily note system
3. Add photo/video sharing (with consent)
4. Create resource library

### Phase 5: Advanced Features (Weeks 9-10)

1. AI-powered insights
   - Automatic trend detection
   - Predictive analytics for mastery
   - Recommendation engine
2. Advanced visualizations
3. Comparative analysis tools

## 5. API Endpoints Needed

### Data Collection

```
GET    /api/rpc/dataCollectionTemplates.list
GET    /api/rpc/dataCollectionTemplates.get
POST   /api/rpc/dataCollectionTemplates.create

GET    /api/rpc/dataCollectionSheets.list
GET    /api/rpc/dataCollectionSheets.get
POST   /api/rpc/dataCollectionSheets.create
PATCH  /api/rpc/dataCollectionSheets.update
POST   /api/rpc/dataCollectionSheets.addEntry
POST   /api/rpc/dataCollectionSheets.complete
```

### Reports

```
POST   /api/rpc/reports.generateSessionSummary
POST   /api/rpc/reports.generateProgressReport
POST   /api/rpc/reports.generateAssessmentReport
POST   /api/rpc/reports.generateParentReport
GET    /api/rpc/reports.list
GET    /api/rpc/reports.download/:id
```

### Parent Communication

```
GET    /api/rpc/parentNotes.list
GET    /api/rpc/parentNotes.get
POST   /api/rpc/parentNotes.create
POST   /api/rpc/parentMessages.send
GET    /api/rpc/parentMessages.list
GET    /api/rpc/parentResources.list
```

## 6. Database Migrations

Run these migrations:

```bash
# Generate migration for new tables
bun run db:generate

# Apply migrations
bun run db:migrate
```

## 7. Testing Strategy

1. **Unit Tests**
   - Data collection calculations
   - Report generation logic
   - Template validation

2. **Integration Tests**
   - End-to-end data collection flow
   - Report generation pipeline
   - Parent notification system

3. **User Acceptance Testing**
   - BCBA workflow testing
   - Parent portal usability
   - Mobile data collection

## 8. Security & Compliance

1. **HIPAA Compliance**
   - Encrypt all data in transit and at rest
   - Audit logs for all data access
   - Role-based access control
   - Automatic session timeout

2. **Photo/Video Consent**
   - Explicit consent for each media item
   - Expiration dates for consent
   - Easy revocation process
   - Audit trail of consent changes

3. **Data Retention**
   - Automatic archiving after 7 years
   - Secure deletion procedures
   - Export before deletion

## Next Steps

1. Review and approve the data collection templates router
2. Create the data sheets router for actual data entry
3. Build the database migration
4. Start with the DTT template UI
5. Create BCBA report templates
6. Design parent portal interface

Would you like me to implement any specific part of this system?