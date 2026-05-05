# AuditUs Seed Data

This directory contains the production-ready question library for AuditUs.

## Directory Structure

- `supabase/seed/`: Current source of truth for the database.
- `supabase/seed/legacy/`: Archived/old versions of seeds (drafts, intermediate fixes).

## Production Files

- `questions.sql`: Base question definitions.
- `questions_creative_en.sql`: Creative English question pack.
- `questions_creative_es.sql`: Creative Spanish (ES) question pack.
- `questions_creative_es-MX.sql`: Creative Spanish (MX) question pack.
- `questions_translations_en.sql`: English translations for base questions.
- `questions_translations_es.sql`: Spanish (ES) translations for base questions.
- `questions_translations_es-MX.sql`: Spanish (MX) translations for base questions.
- `questions_translations_de.sql`: German translations.
- `questions_translations_fr.sql`: French translations.
- `questions_translations_it.sql`: Italian translations.
- `questions_translations_pt.sql`: Portuguese translations.
- `questions_translations_en-UK.sql`: British English translations.

## Database Sync Status

- Current DB count: **204 questions**.
- Total local library: **~3,000+ questions/translations**.
- **Action Required**: Run the seeds to reach full parity.
