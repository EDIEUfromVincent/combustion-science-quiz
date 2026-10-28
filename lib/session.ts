import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const STUDENT_COOKIE = "science_student_session";
const TEACHER_COOKIE = "science_teacher_session";

export type StudentSession = { classNo: number; studentNo: number; name: string; exp: number };
type TeacherSession = { role: "teacher"; exp: number };

function secret() {
  const value = process.env.APP_SESSION_SECRET;
  if (!value) throw new Error("APP_SESSION_SECRET is not configured");
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function createToken<T extends object>(payload: T) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

function verifyToken<T>(token?: string | null): T | null {
  if (!token) return null;
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature || !safeEqual(signature, sign(data))) return null;
    return JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function classAccessCode(classNo: number) {
  return process.env[`CLASS_${classNo}_CODE`];
}

export function accessCodeMatches(classNo: number, code: string) {
  const expected = classAccessCode(classNo)?.trim().toUpperCase();
  return Boolean(expected && safeEqual(code.trim().toUpperCase(), expected));
}

export function teacherPasswordMatches(password: string) {
  const expected = process.env.TEACHER_PASSWORD;
  return Boolean(expected && safeEqual(password, expected));
}

export async function setStudentSession(payload: Omit<StudentSession, "exp">) {
  const store = await cookies();
  store.set(STUDENT_COOKIE, createToken({ ...payload, exp: Date.now() + 8 * 60 * 60 * 1000 }), { ...cookieOptions, maxAge: 8 * 60 * 60 });
}

export async function getStudentSession(): Promise<StudentSession | null> {
  const store = await cookies();
  const session = verifyToken<StudentSession>(store.get(STUDENT_COOKIE)?.value);
  if (!session || session.exp < Date.now() || session.classNo < 1 || session.classNo > 5) return null;
  return session;
}

export async function clearStudentSession() {
  const store = await cookies();
  store.delete(STUDENT_COOKIE);
}

export async function setTeacherSession() {
  const store = await cookies();
  store.set(TEACHER_COOKIE, createToken<TeacherSession>({ role: "teacher", exp: Date.now() + 4 * 60 * 60 * 1000 }), { ...cookieOptions, maxAge: 4 * 60 * 60 });
}

export async function getTeacherSession() {
  const store = await cookies();
  const session = verifyToken<TeacherSession>(store.get(TEACHER_COOKIE)?.value);
  return Boolean(session?.role === "teacher" && session.exp >= Date.now());
}

export async function clearTeacherSession() {
  const store = await cookies();
  store.delete(TEACHER_COOKIE);
}
