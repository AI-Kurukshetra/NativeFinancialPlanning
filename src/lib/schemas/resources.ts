import { z } from "zod";

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
};

const jsonRecordSchema = z.record(z.string(), z.unknown());

export const membershipRoleSchema = z.enum([
  "admin",
  "editor",
  "viewer",
  "approver",
]);

export const planStatusSchema = z.enum([
  "draft",
  "active",
  "locked",
  "archived",
]);

export const reportStatusSchema = z.enum([
  "draft",
  "generated",
  "published",
  "archived",
]);

export const workflowStatusSchema = z.enum([
  "draft",
  "pending_approval",
  "approved",
  "rejected",
]);

export const approvalStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
]);

export const approvalDecisionSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  decisionNote: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().max(2000).optional(),
  ),
});

export const organizationCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.preprocess(emptyStringToUndefined, z.string().trim().min(2).max(120).optional()),
  makeDefault: z.boolean().optional().default(true),
});

export const organizationUpdateSchema = z
  .object({
    name: z.preprocess(emptyStringToUndefined, z.string().trim().min(2).max(120).optional()),
    slug: z.preprocess(emptyStringToUndefined, z.string().trim().min(2).max(120).optional()),
    makeDefault: z.boolean().optional(),
  })
  .refine((value) => value.name !== undefined || value.slug !== undefined || value.makeDefault !== undefined, {
    message: "At least one organization field must be provided.",
  });

export const budgetCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  workbookId: z.preprocess(emptyStringToUndefined, z.string().uuid().optional()),
  ownerId: z.preprocess(emptyStringToUndefined, z.string().uuid().optional()),
  status: planStatusSchema.optional().default("draft"),
  startsOn: z.preprocess(emptyStringToUndefined, z.string().date().optional()),
  endsOn: z.preprocess(emptyStringToUndefined, z.string().date().optional()),
});

export const budgetUpdateSchema = z
  .object({
    name: z.preprocess(emptyStringToUndefined, z.string().trim().min(2).max(120).optional()),
    workbookId: z.preprocess(emptyStringToUndefined, z.string().uuid().nullable().optional()),
    ownerId: z.preprocess(emptyStringToUndefined, z.string().uuid().nullable().optional()),
    status: planStatusSchema.optional(),
    startsOn: z.preprocess(emptyStringToUndefined, z.string().date().nullable().optional()),
    endsOn: z.preprocess(emptyStringToUndefined, z.string().date().nullable().optional()),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.workbookId !== undefined ||
      value.ownerId !== undefined ||
      value.status !== undefined ||
      value.startsOn !== undefined ||
      value.endsOn !== undefined,
    {
      message: "At least one budget field must be provided.",
    },
  );

export const forecastCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  workbookId: z.preprocess(emptyStringToUndefined, z.string().uuid().optional()),
  ownerId: z.preprocess(emptyStringToUndefined, z.string().uuid().optional()),
  status: planStatusSchema.optional().default("draft"),
  horizonMonths: z.number().int().min(1).max(120).optional(),
});

export const forecastUpdateSchema = z
  .object({
    name: z.preprocess(emptyStringToUndefined, z.string().trim().min(2).max(120).optional()),
    workbookId: z.preprocess(emptyStringToUndefined, z.string().uuid().nullable().optional()),
    ownerId: z.preprocess(emptyStringToUndefined, z.string().uuid().nullable().optional()),
    status: planStatusSchema.optional(),
    horizonMonths: z.number().int().min(1).max(120).nullable().optional(),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.workbookId !== undefined ||
      value.ownerId !== undefined ||
      value.status !== undefined ||
      value.horizonMonths !== undefined,
    {
      message: "At least one forecast field must be provided.",
    },
  );

export const reportCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  workbookId: z.preprocess(emptyStringToUndefined, z.string().uuid().optional()),
  status: reportStatusSchema.optional().default("draft"),
  definition: jsonRecordSchema.optional().default({}),
  generatedAt: z.preprocess(emptyStringToUndefined, z.string().datetime().optional()),
});

export const reportUpdateSchema = z
  .object({
    name: z.preprocess(emptyStringToUndefined, z.string().trim().min(2).max(120).optional()),
    workbookId: z.preprocess(emptyStringToUndefined, z.string().uuid().nullable().optional()),
    status: reportStatusSchema.optional(),
    definition: jsonRecordSchema.optional(),
    generatedAt: z.preprocess(emptyStringToUndefined, z.string().datetime().nullable().optional()),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.workbookId !== undefined ||
      value.status !== undefined ||
      value.definition !== undefined ||
      value.generatedAt !== undefined,
    {
      message: "At least one report field must be provided.",
    },
  );

export const workflowCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  workbookId: z.preprocess(emptyStringToUndefined, z.string().uuid().optional()),
  status: workflowStatusSchema.optional().default("draft"),
  currentStep: z.preprocess(emptyStringToUndefined, z.string().trim().max(120).optional()),
  approverIds: z.array(z.string().uuid()).max(25).optional().default([]),
});

export const workflowUpdateSchema = z
  .object({
    name: z.preprocess(emptyStringToUndefined, z.string().trim().min(2).max(120).optional()),
    workbookId: z.preprocess(emptyStringToUndefined, z.string().uuid().nullable().optional()),
    status: workflowStatusSchema.optional(),
    currentStep: z.preprocess(emptyStringToUndefined, z.string().trim().max(120).nullable().optional()),
    approverIds: z.array(z.string().uuid()).max(25).optional(),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.workbookId !== undefined ||
      value.status !== undefined ||
      value.currentStep !== undefined ||
      value.approverIds !== undefined,
    {
      message: "At least one workflow field must be provided.",
    },
  );

export const templateCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(1).max(60).optional().default("general"),
  description: z.string().trim().max(1000).optional().default(""),
  workbookTemplate: jsonRecordSchema.optional().default({}),
  isGlobal: z.boolean().optional().default(false),
});

export const templateUpdateSchema = z
  .object({
    name: z.preprocess(emptyStringToUndefined, z.string().trim().min(2).max(120).optional()),
    category: z.preprocess(emptyStringToUndefined, z.string().trim().min(1).max(60).optional()),
    description: z.preprocess(emptyStringToUndefined, z.string().trim().max(1000).optional()),
    workbookTemplate: jsonRecordSchema.optional(),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.category !== undefined ||
      value.description !== undefined ||
      value.workbookTemplate !== undefined,
    {
      message: "At least one template field must be provided.",
    },
  );

export const commentCreateSchema = z.object({
  workbookId: z.preprocess(emptyStringToUndefined, z.string().uuid().optional()),
  worksheetId: z.preprocess(emptyStringToUndefined, z.string().uuid().optional()),
  versionId: z.preprocess(emptyStringToUndefined, z.string().uuid().optional()),
  rowIndex: z.number().int().min(1).nullable().optional(),
  columnIndex: z.number().int().min(1).nullable().optional(),
  body: z.string().trim().min(1).max(5000),
});

export const commentUpdateSchema = z
  .object({
    body: z.preprocess(emptyStringToUndefined, z.string().trim().min(1).max(5000).optional()),
    resolved: z.boolean().optional(),
  })
  .refine((value) => value.body !== undefined || value.resolved !== undefined, {
    message: "At least one comment field must be provided.",
  });

export const versionCreateSchema = z.object({
  workbookId: z.string().uuid(),
  label: z.string().trim().min(1).max(120),
  snapshot: jsonRecordSchema.optional(),
});

export const versionUpdateSchema = z.object({
  label: z.string().trim().min(1).max(120),
});

export const integrationCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  sourceType: z.string().trim().min(2).max(60),
  config: jsonRecordSchema.optional().default({}),
});

export const integrationUpdateSchema = z
  .object({
    name: z.preprocess(emptyStringToUndefined, z.string().trim().min(2).max(120).optional()),
    sourceType: z.preprocess(emptyStringToUndefined, z.string().trim().min(2).max(60).optional()),
    config: jsonRecordSchema.optional(),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.sourceType !== undefined ||
      value.config !== undefined,
    {
      message: "At least one integration field must be provided.",
    },
  );

export const currencyCreateSchema = z.object({
  code: z.string().trim().min(3).max(8),
  name: z.string().trim().min(2).max(120),
  symbol: z.string().trim().min(1).max(12).optional().default(""),
  decimalPlaces: z.number().int().min(0).max(6).optional().default(2),
  isBase: z.boolean().optional().default(false),
});

export const exchangeRateCreateSchema = z.object({
  baseCurrencyId: z.string().uuid(),
  quoteCurrencyId: z.string().uuid(),
  rate: z.number().positive(),
  source: z.string().trim().min(2).max(60).optional().default("manual"),
  effectiveAt: z.preprocess(emptyStringToUndefined, z.string().datetime().optional()),
});

export const notificationCreateSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().max(5000).optional().default(""),
  kind: z.string().trim().min(1).max(60).optional().default("system"),
  link: z.preprocess(emptyStringToUndefined, z.string().trim().max(255).optional()),
  metadata: jsonRecordSchema.optional().default({}),
});

export const notificationUpdateSchema = z
  .object({
    read: z.boolean().optional(),
  })
  .refine((value) => value.read !== undefined, {
    message: "At least one notification field must be provided.",
  });

export const exportWorkbookSchema = z.object({
  workbookId: z.string().uuid(),
  format: z.enum(["json", "csv"]).optional().default("json"),
});

export const scheduleCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  reportId: z.preprocess(emptyStringToUndefined, z.string().uuid().optional()),
  cronExpression: z.string().trim().min(5).max(120),
  timezone: z.string().trim().min(2).max(60).optional().default("UTC"),
  status: z.enum(["draft", "active", "paused", "archived"]).optional().default("draft"),
  nextRunAt: z.preprocess(emptyStringToUndefined, z.string().datetime().optional()),
});

export const scheduleUpdateSchema = z
  .object({
    name: z.preprocess(emptyStringToUndefined, z.string().trim().min(2).max(120).optional()),
    reportId: z.preprocess(emptyStringToUndefined, z.string().uuid().nullable().optional()),
    cronExpression: z.preprocess(emptyStringToUndefined, z.string().trim().min(5).max(120).optional()),
    timezone: z.preprocess(emptyStringToUndefined, z.string().trim().min(2).max(60).optional()),
    status: z.enum(["draft", "active", "paused", "archived"]).optional(),
    nextRunAt: z.preprocess(emptyStringToUndefined, z.string().datetime().nullable().optional()),
    lastRunAt: z.preprocess(emptyStringToUndefined, z.string().datetime().nullable().optional()),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.reportId !== undefined ||
      value.cronExpression !== undefined ||
      value.timezone !== undefined ||
      value.status !== undefined ||
      value.nextRunAt !== undefined ||
      value.lastRunAt !== undefined,
    {
      message: "At least one schedule field must be provided.",
    },
  );
