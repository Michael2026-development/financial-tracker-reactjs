import {
    pgTable,
    text,
    timestamp,
    boolean,
    uuid,
    integer,
    date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// Better Auth Tables
// ============================================

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// Application Tables
// ============================================

export const category = pgTable("category", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    icon: text("icon").notNull().default("category"),
    color: text("color").notNull().default("#10b981"),
    monthlyBudget: integer("monthly_budget").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transaction = pgTable("transaction", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
        .notNull()
        .references(() => category.id, { onDelete: "cascade" }),
    sessionId: text("session_id"),
    description: text("description").notNull(),
    totalPrice: integer("total_price").notNull().default(0),
    transactionDate: date("transaction_date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transactionItem = pgTable("transaction_item", {
    id: uuid("id").primaryKey().defaultRandom(),
    transactionId: uuid("transaction_id")
        .notNull()
        .references(() => transaction.id, { onDelete: "cascade" }),
    productNumber: integer("product_number").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    location: text("location"),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: integer("unit_price").notNull().default(0),
    totalPrice: integer("total_price").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notification = pgTable("notification", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    message: text("message").notNull(),
    icon: text("icon").default("notifications"),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userSettings = pgTable("user_settings", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .unique()
        .references(() => user.id, { onDelete: "cascade" }),
    currency: text("currency").notNull().default("IDR"),
    language: text("language").notNull().default("id"),
    budgetAlerts: boolean("budget_alerts").notNull().default(true),
    weeklyReports: boolean("weekly_reports").notNull().default(false),
    financeTips: boolean("finance_tips").notNull().default(true),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================
// Relations
// ============================================

export const userRelations = relations(user, ({ many, one }) => ({
    sessions: many(session),
    accounts: many(account),
    categories: many(category),
    transactions: many(transaction),
    notifications: many(notification),
    settings: one(userSettings),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
    user: one(user, {
        fields: [category.userId],
        references: [user.id],
    }),
    transactions: many(transaction),
}));

export const transactionRelations = relations(transaction, ({ one, many }) => ({
    user: one(user, {
        fields: [transaction.userId],
        references: [user.id],
    }),
    category: one(category, {
        fields: [transaction.categoryId],
        references: [category.id],
    }),
    items: many(transactionItem),
}));

export const transactionItemRelations = relations(transactionItem, ({ one }) => ({
    transaction: one(transaction, {
        fields: [transactionItem.transactionId],
        references: [transaction.id],
    }),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
    user: one(user, {
        fields: [notification.userId],
        references: [user.id],
    }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
    user: one(user, {
        fields: [userSettings.userId],
        references: [user.id],
    }),
}));
