import { z } from "zod";

import { workbookStatusSchema } from "@/lib/schemas/workbooks";

const importCellSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const importWorkbookSchema = z.object({
  workbookName: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional().default(""),
  worksheetName: z.string().trim().min(1).max(120).optional().default("Sheet 1"),
  status: workbookStatusSchema.optional().default("draft"),
  rows: z.array(z.array(importCellSchema).max(200)).min(1).max(500),
});

export type ImportWorkbookInput = z.infer<typeof importWorkbookSchema>;
