import { z } from 'zod';

export const createTicketSchema = z.object({
  category: z.enum([
    'payment',
    'invoice',
    'portal_access',
    'document_clarification',
    'vendor_code',
    'contract',
    'onboarding',
    'commercial',
    'grievance',
    'other',
  ]),
  subject: z.string().min(5, 'Subject line must be at least 5 characters'),
  description: z.string().min(10, 'Detailed description is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
});

export const updateTicketSchema = z.object({
  status: z.enum([
    'open',
    'assigned',
    'in_progress',
    'waiting_for_vendor',
    'waiting_for_internal',
    'escalated',
    'resolved',
    'closed',
    'reopened',
  ]).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  assigned_to_id: z.string().optional(),
  resolution_notes: z.string().optional(),
});

export const addTicketMessageSchema = z.object({
  message: z.string().min(2, 'Message text cannot be empty'),
  is_internal_note: z.boolean().default(false),
  attachment_path: z.string().optional(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type AddTicketMessageInput = z.infer<typeof addTicketMessageSchema>;
