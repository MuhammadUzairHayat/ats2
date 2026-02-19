import { Session } from "next-auth";
import { File } from "node:buffer";
import { ComponentType, SVGProps } from "react";

export interface UserSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    expires?: string | null;
  };
  accessToken?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DashboardClientProps {
  candidates: Candidate[];
  statuses: Status[];
  positions: Position[];
  stats?: { [key: string]: number };
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  position: string;
  status: string;
  statusFlag?: string;
  experience?: string[];
  currentSalary?: string;
  expectedSalary?: string;
  noticePeriod?: string;
  linkedin?: string;
  reference?: string;
  comments?: string;
  fileId?: string;
  isDeleted?: number;
  entryDate?: string;
  statusHistory?: StatusHistoryEntry[]; // ✅ Added: Embedded history
}

export type StatusFlag = "active" | "onHold" | "rejected" | "";

export interface Status {
  id: string;
  name: string;
  color: string;
  description: string;
  isDeleted: number; // 0 = not deleted, 1 = deleted
}

export interface Position {
  id: string;
  name: string;
  description: string;
  department: string;
  criteria?: number;
  isDeleted: number; // 0 = not deleted, 1 = deleted
}

export interface SessionProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    expires?: string | null;
  };
}

export interface NavLinkProps {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface PositionActionState {
  error: string | null;
  success?: boolean;
  updatedCandidates?: number;
}

export interface StatusActionState {
  error: string | null;
  success?: boolean;
  updatedCandidates?: number;
}

export interface CandidateActionState {
  error: string | null;
}

export interface Filters {
  position: string;
  status: string;
  statusFlag: string; // ✅ Add this
  search: string;
}

export interface CVDataValidation {
  name: boolean;
  email: boolean;
  phone: boolean;
  experience: boolean;
  linkedIn: boolean;
  cvFile?: File | null;
}

export interface StatusHistoryEntry {
  historyId: string;
  oldStatus: string;
  newStatus: string;
  changedAt: string;
  changedBy: string;
}