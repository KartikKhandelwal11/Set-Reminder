import { Account } from '../types';

export const mockAccounts: Account[] = [
  {
    id: '1',
    bankName: 'SBI Credit Card',
    type: 'Credit Card',
    category: 'Cards',
    last4Digits: '4540',
    billAmount: 14775,
    dueDate: '12th Sep',
    lastPaymentAmount: 100000,
    lastPaymentDate: '30th Dec',
    isReminderEnabled: false,
    reminderDay: null,
    colorHex: '#0072BC',
    logoUrl: `${import.meta.env.BASE_URL}logos/SBI-Logo.png`
  },
  {
    id: '2',
    bankName: 'IDFC First Bank Loan',
    type: 'Business Loan',
    category: 'Loans',
    last4Digits: '5186',
    fullAccountNumber: 'LNBNG41225-267655186',
    billAmount: 22500,
    dueDate: '5th Oct',
    isReminderEnabled: false,
    reminderDay: null,
    colorHex: '#9A2B2E',
    logoUrl: `${import.meta.env.BASE_URL}logos/idfc-first-bank--600.png`
  },
  {
    id: '3',
    bankName: 'Kotak Mahindra Bank Loan',
    type: 'Home Loan',
    category: 'Loans',
    last4Digits: '7795',
    lastPaymentAmount: 66715.00,
    lastPaymentDate: '1st Apr',
    isReminderEnabled: false,
    reminderDay: null,
    colorHex: '#ED1C24',
    logoUrl: `${import.meta.env.BASE_URL}logos/KOTAKBANK.NS-36440c5e.png`
  },
  {
    id: '4',
    bankName: 'Axis Bank Card',
    type: 'Credit Card',
    category: 'Cards',
    last4Digits: '0300',
    isReminderEnabled: false,
    reminderDay: null,
    colorHex: '#9E3953',
    logoUrl: `${import.meta.env.BASE_URL}logos/AXISBANK.BO-8f59e95b.png`
  },
  {
    id: '5',
    bankName: 'Punjab National Bank Loan',
    type: 'Personal Loan',
    category: 'Loans',
    last4Digits: '5157',
    billAmount: 6300,
    dueDate: '14th Oct',
    isReminderEnabled: true,
    reminderDay: 14,
    colorHex: '#FBB03B',
    logoUrl: `${import.meta.env.BASE_URL}logos/pnb-logo.png`
  },
  {
    id: '6',
    bankName: 'BESCOM Electricity Board',
    type: 'Electricity',
    category: 'Utilities',
    fullAccountNumber: '94821034988',
    billAmount: 1250,
    dueDate: '20th Sep',
    lastPaymentAmount: 1100,
    lastPaymentDate: '20th Aug',
    isReminderEnabled: false,
    reminderDay: null,
    colorHex: '#047857',
    logoUrl: 'https://logo.clearbit.com/bescom.org'
  },
  {
    id: '7',
    bankName: 'JioFiber Broadband',
    type: 'Internet',
    category: 'Utilities',
    last4Digits: '9001',
    billAmount: 999,
    dueDate: '5th Oct',
    isReminderEnabled: true,
    reminderDay: 5,
    colorHex: '#E11D48',
    logoUrl: 'https://logo.clearbit.com/jio.com'
  }
];
