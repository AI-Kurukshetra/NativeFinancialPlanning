import { z } from "zod";

export const workbookStatusSchema = z.enum([
  "draft",
  "in_review",
  "published",
  "archived",
]);

export const createWorkbookSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).optional().default(""),
  status: workbookStatusSchema.optional().default("draft"),
  initialWorksheetName: z.string().trim().min(1).max(120).optional().default("Sheet 1"),
});

export const updateWorkbookSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().max(1000).optional(),
    status: workbookStatusSchema.optional(),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.description !== undefined ||
      value.status !== undefined,
    {
      message: "At least one workbook field must be provided.",
    },
  );

export const createWorksheetSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

export const updateWorksheetSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
  })
  .refine((value) => value.name !== undefined, {
    message: "At least one worksheet field must be provided.",
  });

export type CreateWorkbookInput = z.infer<typeof createWorkbookSchema>;
export type UpdateWorkbookInput = z.infer<typeof updateWorkbookSchema>;
export type CreateWorksheetInput = z.infer<typeof createWorksheetSchema>;
export type UpdateWorksheetInput = z.infer<typeof updateWorksheetSchema>;
