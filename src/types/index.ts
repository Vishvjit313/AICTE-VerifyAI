export type VerificationStatus = 'PASS' | 'WARNING' | 'FAILED CHECK' | 'NOT CHECKED';

export type DocumentCategory = 
  | 'land_deed'
  | 'building_plan'
  | 'fire_safety'
  | 'society_trust'
  | 'faculty_list'
  | 'fdr_guarantee'
  | 'affiliation_noc'
  | 'aicte_approval'
  | 'other';

export interface Finding {
  id: string;
  checkName: string;
  status: VerificationStatus;
  evidenceText: string;
  extractedValue?: string;
  expectedValue?: string;
  recommendedAction: string;
  aphClause?: string;
  sourceDoc?: string;
  sourcePage?: number | null;
}

export interface ExtractedMetrics {
  landAreaAcres?: number | null;
  builtUpAreaSqM?: number | null;
  surveyPlotNumbers?: string | null;
  approvedIntake?: number | null;
  facultyCount?: number | null;
  cadreRatio?: string | null;
  fdrAmountLakhs?: number | null;
  approvedPrograms?: string[];
}

export interface ExtractedFieldItem {
  fieldName: string;
  value: string | null;
  sourcePage?: number | null;
  confidence: number;
  isMissingOrUncertain: boolean;
  notes?: string;
}

export interface AuthenticationCheck {
  pdfMetadata?: {
    title?: string;
    author?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
    pageCount?: number;
    hasDigitalSignatureFlag?: boolean;
    isEncrypted?: boolean;
  };
  officialRegistryStatus: 'NOT_CHECKED_GATEWAY_UNAVAILABLE' | 'AUTHENTICATED' | 'UNAUTHENTICATED';
  officialRegistryReason: string;
  signatureAnalysis: 'SIGNATURE_DETECTED_UNVALIDATED' | 'NO_SIGNATURE_FOUND' | 'UNSUPPORTED_FORMAT';
  tamperRisk: 'LOW' | 'ELEVATED' | 'UNKNOWN';
}

export interface TextPage {
  page: number;
  text: string;
  characterCount: number;
}

export interface TextExtractionResult {
  success: boolean;
  text: string;
  pages: TextPage[];
  pageCount: number;
  characterCount: number;
  wordCount: number;
  isScanned: boolean;
  isEmptyOrUnreadable: boolean;
  extractionMethod: 'PDF_EMBEDDED_TEXT' | 'SCANNED_PDF_OCR' | 'IMAGE_OCR_GEMINI' | 'IMAGE_OCR_TESSERACT';
  warningMessage?: string;
  pdfMetadata?: AuthenticationCheck['pdfMetadata'];
}

export interface DocumentAnalysisResult {
  institutionNameExtracted: string;
  documentIdentifier: string;
  issuanceDate: string;
  expiryDate?: string | null;
  issuingAuthority: string;
  extractedAddress?: string;
  extractedMetrics: ExtractedMetrics;
  fields: ExtractedFieldItem[];
  missingFieldsDetected: string[];
  findings: Finding[];
  aphRuleReference: string;
  summary: string;
  status: VerificationStatus;
  confidenceScore: number;
  textExtractionMethod: 'PDF_EMBEDDED_TEXT' | 'SCANNED_PDF_OCR' | 'IMAGE_OCR_GEMINI' | 'IMAGE_OCR_TESSERACT' | 'DETERMINISTIC_PARSER';
  isScannedDocument: boolean;
  pageCount: number;
  rawTextPreview?: string;
  authentication: AuthenticationCheck;
}

export interface ScrutinyDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  categoryLabel: string;
  size: string;
  uploadDate: string;
  status: VerificationStatus;
  confidenceScore: number;
  documentIdentifier: string;
  issuanceDate: string;
  expiryDate?: string | null;
  issuingAuthority: string;
  extractedMetrics: ExtractedMetrics;
  missingFields: string[];
  findings: Finding[];
  previewUrl?: string;
  isRealUploaded?: boolean;
  analysis?: DocumentAnalysisResult;
}

export interface CrossDocumentFinding {
  id: string;
  field: string;
  documentA: {
    id: string;
    name: string;
    value: string;
    page?: number | null;
  };
  documentB: {
    id: string;
    name: string;
    value: string;
    page?: number | null;
  };
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  explanation: string;
  recommendedAction: string;
}

export interface InstitutionApplication {
  id: string;
  applicationNumber: string;
  institutionName: string;
  trustName: string;
  region: 'Northern' | 'Southern' | 'Western' | 'Eastern' | 'Central' | 'North-Western';
  category: 'Engineering & Tech' | 'Management' | 'Applied Arts & Crafts' | 'Pharmacy' | 'Polytechnic';
  status: VerificationStatus;
  documentsSubmittedCount: number;
  totalDocumentsRequired: number;
  lastUpdated: string;
  appliedIntake: number;
  campusLocation: string;
  complianceScore: number;
  documents: ScrutinyDocument[];
  reviewerNotes?: string;
}

export interface ComplianceRule {
  id: string;
  name: string;
  aphClause: string;
  category: 'Land & Infrastructure' | 'Safety & Environment' | 'Faculty & Cadre' | 'Legal & Governance' | 'Academic Affiliation';
  description: string;
  status: VerificationStatus;
  evidence: string;
  mandatory: boolean;
  actionRequired?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  actionType: 'AI_OCR_EXTRACTION' | 'APH_NORM_EVALUATION' | 'DISCREPANCY_FLAGGED' | 'MANUAL_REVIEW_OVERRIDE' | 'REPORT_GENERATED';
  applicationId: string;
  institutionName: string;
  details: string;
  evidenceHash: string;
  status: VerificationStatus;
}

export type UserRole = 
  | 'Senior Scrutiny Officer' 
  | 'Regional Director' 
  | 'Accreditation Inspector' 
  | 'Institutional Registrar'
  | 'Auditor';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  organization: string;
  avatarInitials: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: number;
}

export type ThemeMode = 'light' | 'dark';
