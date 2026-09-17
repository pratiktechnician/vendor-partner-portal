'use client';

import React, { useState } from 'react';
import { Ticket, TicketPriority, TicketStatus, SLAStatus } from '@/types';
import { TicketService } from '@/lib/services/ticketService';
import { MessageSquare, Plus, Lock, Clock, Send, ShieldAlert, CheckCircle2, UserCheck, Search, Filter } from 'lucide-react';

interface TicketingDeskProps {
  tickets: Ticket[];
  currentUserId: string;
  currentUserName: string;
  currentUserRole: string;
  onRefresh: () => void;
}

export const TicketingDesk: React.FC<TicketingDeskProps> = ({
  tickets: initialTickets,
  currentUserId,
  currentUserName,
  currentUserRole,
  onRefresh,
}) => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(initialTickets[0] || null);
  const [replyText, setReplyText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Ticket Form State
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<Ticket['category']>('payment');
  const [newPriority, setNewPriority] = useState<TicketPriority>('medium');
  const [newDescription, setNewDescription] = useState('');

  const isStaff = currentUserRole !== 'vendor' && currentUserRole !== 'customer';

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newDescription) return;

    const ticket = await TicketService.createTicket({
      organization_id: 'org-vendor-01',
      organization_name: 'Apex Tech Solutions Pvt Ltd',
      category: newCategory,
      subject: newSubject,
      description: newDescription,
      priority: newPriority,
      created_by_name: currentUserName,
      created_by_id: currentUserId,
    });

    setTickets((prev) => [ticket, ...prev]);
    setSelectedTicket(ticket);
    setShowNewModal(false);
    setNewSubject('');
    setNewDescription('');
    onRefresh();
  };

  const handleSendReply = async () => {
    if (!replyText || !selectedTicket) return;

    await TicketService.addMessage(selectedTicket.id, currentUserId, currentUserName, currentUserRole, replyText);
    setReplyText('');
    setTickets([...tickets]);
  };

  const handleAddInternalNote = async () => {
    if (!internalNoteText || !selectedTicket) return;

    await TicketService.addInternalNote(selectedTicket.id, currentUserId, currentUserName, internalNoteText);
    setInternalNoteText('');
    setTickets([...tickets]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[750px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Left Sidebar: Ticket List */}
      <div className="border-r border-slate-800 flex flex-col bg-slate-950">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" /> Vendor Grievance Tickets
            </h3>
            <p className="text-xs text-slate-400">Total: {tickets.length} tickets</p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>

        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Ticket ID or Subject..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {tickets.map((tkt) => (
            <div
              key={tkt.id}
              onClick={() => setSelectedTicket(tkt)}
              className={`p-4 cursor-pointer transition-all hover:bg-slate-900/60 ${
                selectedTicket?.id === tkt.id ? 'bg-slate-900 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-blue-400">{tkt.ticket_number}</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    tkt.priority === 'critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : tkt.priority === 'high'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tkt.priority}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate">{tkt.subject}</div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">{tkt.organization_name}</div>
              <div className="flex items-center justify-between mt-2 text-[10px]">
                <span className="text-slate-400 capitalize">{tkt.status.replace('_', ' ')}</span>
                <span
                  className={`font-semibold ${
                    tkt.sla_status === 'SLA Breached'
                      ? 'text-rose-400'
                      : tkt.sla_status === 'SLA Approaching'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {tkt.sla_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Selected Ticket Thread & Reply Center */}
      {selectedTicket ? (
        <div className="lg:col-span-2 flex flex-col bg-slate-900 overflow-hidden">
          {/* Ticket Header Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-blue-400">{selectedTicket.ticket_number}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold capitalize">
                  {selectedTicket.category.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-100 mt-1">{selectedTicket.subject}</h2>
              <div className="text-xs text-slate-400 mt-0.5">
                Vendor: <span className="text-slate-200 font-medium">{selectedTicket.organization_name}</span> • Submitted by:{' '}
                <span className="text-slate-200 font-medium">{selectedTicket.created_by_name}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 capitalize">
                {selectedTicket.status.replace('_', ' ')}
              </span>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3 text-slate-400" /> {selectedTicket.sla_status}
              </div>
            </div>
          </div>

          {/* Conversation Messages Thread */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/40">
            {selectedTicket.messages?.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border max-w-2xl text-xs space-y-1 ${
                  msg.sender_role === 'vendor'
                    ? 'bg-slate-900 border-slate-800 text-slate-200 mr-auto'
                    : 'bg-blue-950/40 border-blue-500/40 text-slate-100 ml-auto'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span className="text-blue-400">{msg.sender_name} ({msg.sender_role.toUpperCase()})</span>
                  <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="leading-relaxed">{msg.message}</div>
              </div>
            ))}

            {/* Internal Staff Notes (Hidden from Vendors) */}
            {isStaff && selectedTicket.internal_notes && selectedTicket.internal_notes.length > 0 && (
              <div className="my-4 space-y-2">
                <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Lock className="w-3 h-3" /> Internal Staff Notes (Hidden from Vendor)
                </div>
                {selectedTicket.internal_notes.map((note) => (
                  <div key={note.id} className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-amber-400 mb-1">
                      <span>{note.author_name}</span>
                      <span>{new Date(note.created_at).toLocaleString()}</span>
                    </div>
                    <div>{note.note}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reply Form */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type reply to vendor..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendReply}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
              >
                <Send className="w-3.5 h-3.5" /> Send Reply
              </button>
            </div>

            {isStaff && (
              <div className="flex gap-2 pt-2 border-t border-slate-800/60">
                <input
                  type="text"
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="Add internal staff note (hidden from vendor)..."
                  className="flex-1 bg-amber-950/20 border border-amber-500/30 rounded-xl px-4 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleAddInternalNote}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" /> Add Internal Note
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="lg:col-span-2 flex items-center justify-center text-slate-500 text-xs">
          Select a grievance ticket from the list to view thread details.
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 mb-4">Raise Non-Technical Grievance Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Grievance Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                >
                  <option value="payment">Payment Issue</option>
                  <option value="invoice">Invoice Issue</option>
                  <option value="portal_access">Portal Access</option>
                  <option value="document_clarification">Document Clarification</option>
                  <option value="vendor_code">Vendor Code Issue</option>
                  <option value="contract">Contract Query</option>
                  <option value="onboarding">Onboarding Assistance</option>
                  <option value="grievance">General Grievance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Priority SLA</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                >
                  <option value="low">Low (48 Hours SLA)</option>
                  <option value="medium">Medium (36 Hours SLA)</option>
                  <option value="high">High (24 Hours SLA)</option>
                  <option value="critical">Critical (12 Hours SLA)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Brief summary of your grievance..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide complete details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20">
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
