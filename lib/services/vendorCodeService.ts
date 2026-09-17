import { VendorCategory } from '@/types';
import { MOCK_VENDORS } from '@/lib/supabase/mockDb';

export class VendorCodeService {
  /**
   * Format vendor code based on category and sequential number
   * Format: VND-{CAT_PREFIX}-{YEAR}-{SEQUENCE}
   * Examples:
   * VND-CASH-2026-00001
   * VND-WCC-2026-00002
   * VND-B2B-2026-00003
   */
  static generateCode(category: VendorCategory, sequenceNumber: number): string {
    const year = new Date().getFullYear();
    let prefix = 'CASH';
    if (category === 'wcc_partner') prefix = 'WCC';
    if (category === 'back_to_back') prefix = 'B2B';

    const formattedSeq = String(sequenceNumber).padStart(5, '0');
    return `VND-${prefix}-${year}-${formattedSeq}`;
  }

  /**
   * Assign vendor code to vendor profile upon final L3 approval
   */
  static assignVendorCode(vendorId: string, category: VendorCategory): string {
    const existingCodes = MOCK_VENDORS.map((v) => v.vendor_code).filter(Boolean);
    const nextSeq = existingCodes.length + 1;
    const newCode = this.generateCode(category, nextSeq);

    const vendor = MOCK_VENDORS.find((v) => v.id === vendorId);
    if (vendor) {
      vendor.vendor_code = newCode;
      vendor.activated_at = new Date().toISOString();
    }

    return newCode;
  }
}
