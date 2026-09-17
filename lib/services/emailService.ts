import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const senderEmail = process.env.NOTIFICATION_SENDER_EMAIL || 'notifications@portal.company.com';

const resend = resendApiKey && resendApiKey !== 'mock_resend_key' ? new Resend(resendApiKey) : null;

export interface NotificationPayload {
  to: string;
  subject: string;
  templateName:
    | 'vendor_registered'
    | 'document_review'
    | 'invoice_submitted'
    | 'invoice_approval_step'
    | 'payment_processed'
    | 'ticket_updated';
  params: Record<string, any>;
}

export async function sendEmailNotification(payload: NotificationPayload): Promise<{ success: boolean; id?: string }> {
  try {
    if (resend) {
      const response = await resend.emails.send({
        from: senderEmail,
        to: payload.to,
        subject: payload.subject,
        html: generateHtmlTemplate(payload.templateName, payload.params),
      });

      return { success: true, id: response.data?.id };
    } else {
      console.log(`[Email Notification Queued - Fallback Mode] To: ${payload.to} | Subject: ${payload.subject}`);
      return { success: true, id: `mock-email-${Date.now()}` };
    }
  } catch (error) {
    console.error('Email dispatch error (transaction safely preserved):', error);
    return { success: false };
  }
}

function generateHtmlTemplate(templateName: string, params: Record<string, any>): string {
  return `
    <div style="font-family: system-ui, sans-serif; padding: 24px; color: #1e293b;">
      <h2 style="color: #0284c7;">Vendor & Customer Management Portal Notification</h2>
      <p style="font-size: 15px; line-height: 1.6;">Hello <strong>${params.recipientName || 'User'}</strong>,</p>
      <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 16px; margin: 16px 0;">
        <p style="margin: 0; font-weight: 500;">${params.message || 'You have an updated record in the portal.'}</p>
      </div>
      <p style="font-size: 13px; color: #64748b;">This is an automated notification. Please log into the portal to review complete details.</p>
    </div>
  `;
}
