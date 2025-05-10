import { z } from "zod";

export const DurationSchema = z
  .strictObject({
    years: z.number().min(0).optional(),
    months: z.number().min(0).optional(),
    days: z.number().min(0).optional(),
    hours: z.number().min(0).optional(),
    minutes: z.number().min(0).optional(),
    seconds: z.number().min(0).optional(),
  })
  .refine(
    (data) => {
      // Ensure at least one property is defined and not zero
      return Object.values(data).some(value => 
        value !== undefined && value > 0
      );
    },
    {
      message: "At least one duration property must be specified with a value greater than zero",
      path: [], // Show error at object level
    },
  );

export type Duration = z.infer<typeof DurationSchema>;
