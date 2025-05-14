import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  lastLogin: timestamp("last_login"),
});

// Transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // 'transfer', 'moveCall', 'nftMint', 'aggregate'
  status: text("status").notNull(), // 'pending', 'completed', 'failed'
  txDigest: text("tx_digest"), // Transaction hash/digest
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  details: jsonb("details").notNull(), // JSON with transaction details
});

// SDK Usage schema
export const sdkUsage = pgTable("sdk_usage", {
  id: serial("id").primaryKey(),
  apiKey: text("api_key").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  calls: integer("calls").default(0).notNull(),
  lastCall: timestamp("last_call"),
});

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  status: true,
  txDigest: true,
  details: true,
});

export const insertSdkUsageSchema = createInsertSchema(sdkUsage).pick({
  apiKey: true,
  userId: true,
});

// Types using zod inference
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertSdkUsage = z.infer<typeof insertSdkUsageSchema>;
export type SdkUsage = typeof sdkUsage.$inferSelect;

// Sui Transaction schemas
export const transactionTypeSchema = z.enum([
  "transfer",
  "moveCall",
  "nftMint",
  "aggregate"
]);

export const transferTransactionSchema = z.object({
  recipient: z.string().min(1),
  amount: z.string().or(z.number()),
  objectId: z.string().optional(),
});

export const moveCallTransactionSchema = z.object({
  packageObjectId: z.string().min(1),
  module: z.string().min(1),
  function: z.string().min(1), 
  typeArguments: z.array(z.string()),
  arguments: z.array(z.any()),
  gasBudget: z.number().optional(),
});

export const nftMintTransactionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  url: z.string().optional(),
  properties: z.record(z.string(), z.any()).optional(),
});

export const aggregateTransactionSchema = z.object({
  transactions: z.array(z.any()), // Array of different transaction types
});

export type TransactionType = z.infer<typeof transactionTypeSchema>;
export type TransferTransaction = z.infer<typeof transferTransactionSchema>;
export type MoveCallTransaction = z.infer<typeof moveCallTransactionSchema>;
export type NftMintTransaction = z.infer<typeof nftMintTransactionSchema>;
export type AggregateTransaction = z.infer<typeof aggregateTransactionSchema>;
