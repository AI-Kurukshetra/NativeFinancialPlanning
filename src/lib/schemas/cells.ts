import { z } from "zod";

const jsonObjectSchema = z.record(z.string(), z.unknown());

const cellMutationSchema = z
  .object({
    rowIndex: z.number().int().min(1).max(100000),
    columnIndex: z.number().int().min(1).max(10000),
    rawValue: z.string().max(5000).nullable().optional(),
    displayValue: z.string().max(5000).nullable().optional(),
    formula: z.string().trim().min(1).max(5000).nullable().optional(),
    valueType: z.string().trim().min(1).max(32).optional(),
    format: jsonObjectSchema.optional(),
    metadata: jsonObjectSchema.optional(),
    clear: z.boolean().optional().default(false),
  })
  .superRefine((value, ctx) => {
    if (
      !value.clear &&
      value.rawValue == null &&
      value.displayValue == null &&
      value.formula == null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Each cell must include a value, a formula, or set clear=true.",
      });
    }
  });

export const persistCellsSchema = z
  .object({
    worksheetId: z.string().uuid(),
    cells: z.array(cellMutationSchema).min(1).max(500),
  })
  .superRefine((value, ctx) => {
    const seen = new Set<string>();

    for (const cell of value.cells) {
      const key = `${cell.rowIndex}:${cell.columnIndex}`;

      if (seen.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate cell coordinate provided for row ${cell.rowIndex}, column ${cell.columnIndex}.`,
        });
        return;
      }

      seen.add(key);
    }
  });

export type PersistCellsInput = z.infer<typeof persistCellsSchema>;
