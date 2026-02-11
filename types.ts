
export enum CaseStatus {
  ACTIVE = 'Active',
  PENDING = 'Pending',
  CLOSED = 'Closed',
  APPEALED = 'Appealed'
}

export enum CaseDirection {
  PLAINTIFF = 'By Me (Plaintiff)',
  DEFENDANT = 'Against Me (Defendant)'
}

export enum CourtType {
  DISTRICT = 'District Court',
  HIGH_COURT = 'High Court',
  SUPREME_COURT = 'Supreme Court',
  TRIBUNAL = 'Tribunal',
  DEPT_AUTHORITY = 'Departmental Authority'
}

export enum CaseType {
  RECOVERY_SUIT = 'Recovery Suit',
  CHECK_BOUNCE = 'Check Bounce (NI Act)',
  GST_DEPT = 'GST Department',
  CUSTOMS_DEPT = 'Customs Department',
  INCOME_TAX = 'Income Tax',
  CIVIL_APPEAL = 'Civil Appeal',
  CRIMINAL_APPEAL = 'Criminal Appeal',
  OTHER = 'Other'
}

export interface Advocate {
  id: string;
  name: string;
  specialization?: string;
  contact?: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isAdvocate: boolean;
}

export interface Hearing {
  id: string;
  date: string;
  court: string;
  appearingPerson: string;
  purpose: string;
  summary?: string;
}

export interface FinancialEntry {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'Payment' | 'Invoice';
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  status: CaseStatus;
  direction: CaseDirection;
  type: string; // Changed to string to support dynamic types
  courtType: CourtType;
  court: string;
  department?: string;
  advocateName: string;
  nextHearingDate: string;
  courseOfAction: string;
  totalFees: number;
  feesPaid: number;
  hearings: Hearing[];
  financials: FinancialEntry[];
  comments: Comment[];
}

export type ViewState = 'dashboard' | 'caseList' | 'caseDetail' | 'financials' | 'addCase' | 'advocates' | 'addAdvocate';
