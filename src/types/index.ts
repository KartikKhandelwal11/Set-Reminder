export type AccountCategory = 'Cards' | 'Loans' | 'Utilities';
export type AccountType = 'Credit Card' | 'Personal Loan' | 'Business Loan' | 'Home Loan' | 'Electricity' | 'Water/Gas' | 'Internet';

export interface Account {
  id: string;
  bankName: string;
  type: AccountType;
  category: AccountCategory;
  last4Digits?: string;
  fullAccountNumber?: string;
  billAmount?: number;
  dueDate?: string;
  lastPaymentAmount?: number;
  lastPaymentDate?: string;
  reminderDay?: number | null;
  isReminderEnabled: boolean;
  colorHex: string;
  logoUrl?: string;
}

