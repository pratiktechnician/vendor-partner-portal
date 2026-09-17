import { z } from 'zod';

export const technicalAssessmentSchema = z.object({
  vendor_id: z.string().uuid(),
  technical_capability: z.coerce.number().min(1).max(5),
  relevant_experience: z.coerce.number().min(1).max(5),
  resource_availability: z.coerce.number().min(1).max(5),
  geographical_capability: z.coerce.number().min(1).max(5),
  safety_readiness: z.coerce.number().min(1).max(5),
  quality_capability: z.coerce.number().min(1).max(5),
  delivery_capability: z.coerce.number().min(1).max(5),
  documentation_capability: z.coerce.number().min(1).max(5),
  assessment_notes: z.string().min(10, 'Detailed technical assessment notes required'),
  recommendation: z.enum(['recommend', 'reject', 'request_clarification']),
});

export type TechnicalAssessmentInput = z.infer<typeof technicalAssessmentSchema>;
