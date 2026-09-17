# Security & Design Assumptions Document

## Security Architecture

1. **Row Level Security (RLS)**:
   - Enforced at PostgreSQL layer via Supabase policies.
   - Vendors & customers are strictly isolated to their own organization scope (`auth.uid() = user_id`).
   - Private storage bucket policies require short-lived signed URLs for document access.

2. **Data Privacy & Banking Protection**:
   - Bank account numbers are stored encrypted and masked (`XXXX-XXXX-1234`) in standard user interfaces.
   - Unmasked access is restricted exclusively to authorized Finance Officers and Super Admins.

3. **Auditability**:
   - `audit_logs` table is immutable. No `UPDATE` or `DELETE` RLS policies exist.

## Architectural Assumptions

1. **Payment Execution Scope**:
   - Initial release tracks bank payment execution, batch numbers, TDS tax deductions, and transaction references within the portal. Direct money movement via banking APIs is architected for modular integration via `PaymentService`.

2. **Document Verification**:
   - Document verification is performed manually by authorized Verification Officers with built-in hooks for OCR or automated malware scanning.
