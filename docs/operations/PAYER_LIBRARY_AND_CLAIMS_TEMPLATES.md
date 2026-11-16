# Payer Library and Claims Templates

Last updated: 2026-07-05

This document defines the payer-template approach for Washington, North Dakota, Connecticut, and Missouri. It is a starter library. Every payer must be verified directly before submission because portals, forms, prior authorization rules, timely filing, and claim requirements change.

## Why This Is Needed

Each client can have a different payer, MCO, authorization rule, claim portal, CPT/modifier requirement, and appeal deadline. The software should avoid free-form billing by giving staff a payer-specific template where they only fill missing information.

## State Payer Starter Library

### Washington

Starter payers/workflows:

- Washington Apple Health / ProviderOne.
- Community Health Plan of Washington.
- Coordinated Care of Washington.
- Molina Healthcare of Washington.
- UnitedHealthcare Community Plan of Washington.
- Wellpoint Washington.

### North Dakota

Starter payers/workflows:

- North Dakota Medicaid.
- BCBSND Medicaid Expansion, if applicable to the client category.
- Commercial plans by contract: Aetna, Cigna/Evernorth, UnitedHealthcare, BCBS local plan, and others as discovered.

### Connecticut

Starter payers/workflows:

- Connecticut Medical Assistance Program / HUSKY.
- CTDSSMAP / Gainwell provider workflow.
- HUSKY Health / ASO workflow.
- Commercial plans by contract.

### Missouri

Starter payers/workflows:

- MO HealthNet.
- Home State Health.
- Healthy Blue Missouri.
- UnitedHealthcare Community Plan Missouri.
- Show Me Healthy Kids.
- Commercial plans by contract.

## Enrollment Template

For every payer, collect:

- Legal entity name and DBA.
- EIN.
- NPI Type 1 and Type 2.
- Taxonomy.
- Service location.
- Owner BCBA license and BACB certificate.
- BCBA/BCaBA/RBT roster.
- Professional liability insurance.
- General liability insurance.
- W-9.
- EFT enrollment.
- ERA enrollment.
- CAQH/DataSpring profile.
- Contact person.
- Portal username owner.
- Contract/effective date.
- Revalidation date.

## Authorization Template

For every client and payer:

- Client name.
- Date of birth.
- Member ID.
- Diagnosis.
- Assessment summary.
- Treatment plan.
- Requested CPT codes.
- Requested hours/units.
- Service setting.
- Start/end dates.
- BCBA signature.
- Parent/caregiver consent where required.
- Supporting documentation requested by payer.

## Claim Template

For every claim:

- Client/member ID.
- Payer.
- Billing provider NPI.
- Rendering provider NPI.
- Tax ID.
- Date of service.
- CPT code.
- Modifier.
- Units.
- Place of service.
- Diagnosis.
- Authorization number.
- Session note signed.
- RBT supervision status.
- Claim status.
- Clearinghouse trace.
- Payer claim number.

## Follow-Up Template

For every unpaid or denied claim:

- Payer.
- Phone number or portal.
- Claim number.
- Date of service.
- Billed amount.
- CPT/modifier/units.
- Authorization number.
- Representative name.
- Reference number.
- Claim status.
- Denial reason.
- Documents requested.
- Appeal deadline.
- Next action.
- Follow-up date.
- Assigned staff.

## Software Requirement

The app should store payer templates by:

- State.
- Payer.
- Plan type.
- Portal.
- Credentialing requirements.
- Authorization requirements.
- Claim requirements.
- Follow-up script.
- Timely filing and appeal windows.
- Required documents.
- Verification status.

The app should not release a claim unless the payer template checklist is complete for that client, date of service, CPT code, authorization, and provider.

