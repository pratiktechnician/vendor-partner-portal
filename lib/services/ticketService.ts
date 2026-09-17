import { Ticket, TicketMessage, TicketInternalNote, TicketPriority, TicketStatus, SLAStatus } from '@/types';
import { MOCK_TICKETS } from '@/lib/supabase/mockDb';

export class TicketService {
  /**
   * Calculate SLA status based on ticket priority and creation date
   */
  static calculateSLA(createdAt: string, priority: TicketPriority): { slaDueAt: string; slaStatus: SLAStatus } {
    const createdDate = new Date(createdAt);
    let targetHours = 48; // Default low/medium priority
    if (priority === 'high') targetHours = 24;
    if (priority === 'critical') targetHours = 12;

    const dueTime = new Date(createdDate.getTime() + targetHours * 60 * 60 * 1000);
    const now = new Date();

    let slaStatus: SLAStatus = 'Within SLA';
    const remainingHours = (dueTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (remainingHours < 0) {
      slaStatus = 'SLA Breached';
    } else if (remainingHours <= 6) {
      slaStatus = 'SLA Approaching';
    }

    return {
      slaDueAt: dueTime.toISOString(),
      slaStatus,
    };
  }

  /**
   * Create a new non-technical grievance ticket
   */
  static async createTicket(input: {
    organization_id: string;
    organization_name?: string;
    category: Ticket['category'];
    subject: string;
    description?: string;
    priority: TicketPriority;
    created_by_name: string;
    created_by_id: string;
  }): Promise<Ticket> {
    const ticketCount = MOCK_TICKETS.length + 1;
    const ticketNumber = `TKT-${new Date().getFullYear()}-${String(ticketCount).padStart(6, '0')}`;
    const createdAt = new Date().toISOString();
    const { slaDueAt, slaStatus } = this.calculateSLA(createdAt, input.priority);

    const initialMessage: TicketMessage = {
      id: `msg-${Date.now()}-1`,
      ticket_id: `tkt-${Date.now()}`,
      sender_id: input.created_by_id,
      sender_name: input.created_by_name,
      sender_role: 'vendor',
      message: input.description || input.subject,
      created_at: createdAt,
    };

    const newTicket: Ticket = {
      id: initialMessage.ticket_id,
      organization_id: input.organization_id,
      organization_name: input.organization_name || 'Vendor Organization',
      ticket_number: ticketNumber,
      category: input.category,
      subject: input.subject,
      description: input.description,
      priority: input.priority,
      status: 'open',
      created_by_name: input.created_by_name,
      created_at: createdAt,
      sla_due_at: slaDueAt,
      sla_status: slaStatus,
      messages: [initialMessage],
      internal_notes: [],
    };

    MOCK_TICKETS.unshift(newTicket);
    return newTicket;
  }

  /**
   * Add a public reply message to a ticket thread
   */
  static async addMessage(
    ticketId: string,
    senderId: string,
    senderName: string,
    senderRole: string,
    message: string
  ): Promise<TicketMessage> {
    const ticket = MOCK_TICKETS.find((t) => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const newMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticket_id: ticketId,
      sender_id: senderId,
      sender_name: senderName,
      sender_role: senderRole,
      message,
      created_at: new Date().toISOString(),
    };

    if (!ticket.messages) ticket.messages = [];
    ticket.messages.push(newMessage);

    // Update status based on who replied
    if (senderRole === 'vendor') {
      ticket.status = 'waiting_for_internal';
    } else {
      ticket.status = 'waiting_for_vendor';
    }

    return newMessage;
  }

  /**
   * Add an internal staff note hidden from vendors
   */
  static async addInternalNote(
    ticketId: string,
    authorId: string,
    authorName: string,
    note: string
  ): Promise<TicketInternalNote> {
    const ticket = MOCK_TICKETS.find((t) => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    const newNote: TicketInternalNote = {
      id: `note-${Date.now()}`,
      ticket_id: ticketId,
      author_id: authorId,
      author_name: authorName,
      note,
      created_at: new Date().toISOString(),
    };

    if (!ticket.internal_notes) ticket.internal_notes = [];
    ticket.internal_notes.push(newNote);

    return newNote;
  }

  /**
   * Update ticket status or assignment
   */
  static async updateTicket(
    ticketId: string,
    updates: Partial<Pick<Ticket, 'status' | 'priority' | 'assigned_to_name' | 'assigned_to_id'>>
  ): Promise<Ticket> {
    const ticket = MOCK_TICKETS.find((t) => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    Object.assign(ticket, updates);
    return ticket;
  }
}
