import "server-only";
import postgres from "postgres";

let client: ReturnType<typeof postgres> | undefined;
let schemaReady: Promise<void> | undefined;

export function db() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not configured");
    client = postgres(url, { max: 5, prepare: false });
  }
  return client;
}

export function ensureSchema() {
  if (!schemaReady) {
    const sql = db();
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS quiz_results (
          id BIGSERIAL PRIMARY KEY,
          class_no INTEGER NOT NULL CHECK (class_no BETWEEN 1 AND 5),
          student_no INTEGER NOT NULL CHECK (student_no BETWEEN 1 AND 50),
          student_name TEXT NOT NULL,
          score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
          correct_count INTEGER NOT NULL,
          total_count INTEGER NOT NULL,
          duration_seconds INTEGER NOT NULL,
          attempt_no INTEGER NOT NULL,
          category_json JSONB NOT NULL,
          answers_json JSONB NOT NULL,
          submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS quiz_results_class_idx ON quiz_results (class_no)`;
      await sql`CREATE INDEX IF NOT EXISTS quiz_results_student_idx ON quiz_results (class_no, student_no)`;
      await sql`CREATE INDEX IF NOT EXISTS quiz_results_submitted_idx ON quiz_results (submitted_at DESC)`;
    })().catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }
  return schemaReady;
}
