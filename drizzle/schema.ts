import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Irrigation logs table for tracking recommendations and water savings
 */
export const irrigationLogs = mysqlTable("irrigation_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  crop: varchar("crop", { length: 255 }).notNull(),
  soil: mysqlEnum("soil", ["Clay", "Loamy", "Sandy"]).notNull(),
  lastIrrigationDate: varchar("lastIrrigationDate", { length: 10 }).notNull(),
  fieldSize: decimal("fieldSize", { precision: 10, scale: 2 }).notNull(),
  temperature: decimal("temperature", { precision: 5, scale: 2 }),
  humidity: decimal("humidity", { precision: 5, scale: 2 }),
  rainProbability: int("rainProbability"),
  recommendation: text("recommendation").notNull(),
  waterSaved: decimal("waterSaved", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type IrrigationLog = typeof irrigationLogs.$inferSelect;
export type InsertIrrigationLog = typeof irrigationLogs.$inferInsert;