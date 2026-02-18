import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, irrigationLogs, InsertIrrigationLog, IrrigationLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new irrigation log entry
 */
export async function createIrrigationLog(log: InsertIrrigationLog): Promise<IrrigationLog | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create irrigation log: database not available");
    return null;
  }

  try {
    const result = await db.insert(irrigationLogs).values(log);
    const insertedId = result[0].insertId;
    
    const rows = await db.select().from(irrigationLogs).where(eq(irrigationLogs.id, Number(insertedId))).limit(1);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create irrigation log:", error);
    throw error;
  }
}

/**
 * Get all irrigation logs for a user, ordered by most recent first
 */
export async function getUserIrrigationLogs(userId: number): Promise<IrrigationLog[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get irrigation logs: database not available");
    return [];
  }

  try {
    const rows = await db
      .select()
      .from(irrigationLogs)
      .where(eq(irrigationLogs.userId, userId))
      .orderBy(desc(irrigationLogs.createdAt));
    
    return rows;
  } catch (error) {
    console.error("[Database] Failed to get irrigation logs:", error);
    throw error;
  }
}

/**
 * Get total water saved by a user across all logs
 */
export async function getUserTotalWaterSaved(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get total water saved: database not available");
    return 0;
  }

  try {
    const rows = await db
      .select()
      .from(irrigationLogs)
      .where(eq(irrigationLogs.userId, userId));
    
    const total = rows.reduce((sum, row) => {
      const waterSaved = typeof row.waterSaved === 'string' ? parseFloat(row.waterSaved) : row.waterSaved;
      return sum + (waterSaved || 0);
    }, 0);
    
    return total;
  } catch (error) {
    console.error("[Database] Failed to get total water saved:", error);
    throw error;
  }
}
