import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { prisma } from "../utils/prisma";
import { Session, User } from "@prisma/client";
import { Response } from "express";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: number
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await prisma.session.create({
    data: session,
  });
  return session;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });
  if (result === null) {
    return { session: null, user: null };
  }
  const { user, ...session } = result;
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: session.expiresAt,
      },
    });
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}

export async function invalidateAllSessions(userId: number): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      userId: userId,
    },
  });
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

// COOKIES
export function setSessionTokenCookie(
  res: Response,
  token: string,
  expiresAt: Date
): void {
  if (process.env.NODE_ENV === "production") {
    console.log("Setting production cookie");
    res.cookie("sessionToken", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      expires: expiresAt,
      path: "/",
    });
  } else {
    console.log("Setting development cookie");
    res.cookie("sessionToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });
  }
}

export function deleteSessionTokenCookie(res: Response): void {
  if (process.env.NODE_ENV === "production") {
    res.cookie("sessionToken", "", {
      httpOnly: true,
      sameSite: "none",
      maxAge: 0,
      path: "/",
      secure: true,
    });
  } else {
    res.cookie("sessionToken", "", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 0,
      secure: false,
      path: "/",
    });
  }
}
