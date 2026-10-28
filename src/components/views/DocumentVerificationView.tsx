import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Trash2, 
  Sparkles, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  AlertCircle, 
  Info,
  Calendar,
  Layers,
  Building,
  Hash,
  Award,
  Zap,
  Lock,
  GitCompare,
  ArrowRight,
  Printer,
  FileCheck2,
  FileQuestion,
  Search,
  ExternalLink
} from 'lucide-react';
import { 
  InstitutionApplication, 
  ScrutinyDocument, 
  VerificationStatus, 
  DocumentAnalysisResult,
  CrossDocumentFinding,
  TextExtractionResult
} from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SAMPLE_TEST_DOCUMENTS } from '../../data/mockData';

interface DocumentVerificationViewProps {
  currentApplication?: InstitutionApplication;
  onDocumentVerified?: (doc: ScrutinyDocument) => void;
  onNavigateToReports?: () => void;
}

interface UploadedFileItem {
  id: string;
  file?: File;
  name: string;
  size: string;
  type: string;
  category: string;
  categoryLabel: string;
  previewUrl: string;
  progress: number;
  stage: 'idle' | 'validating' | 'extracting' | 'validating_text' | 'analyzing_ai' | 'completed' | 'error';
  errorMessage?: string;
  extractionResult?: TextExtractionResult;
  analysis?: DocumentAnalysisResult;
  fileBase64?: string;
}

export const DocumentVerificationView: React.FC<DocumentVerificationViewProps> = ({
  currentApplication,
  onDocumentVerified,
  onNavigateToReports,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'single' | 'cross_check'>('single');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('land_deed');
  const [institutionNameInput, setInstitutionNameInput] = useState<string>(
    currentApplication?.institutionName || 'Aryavart Institute of Advanced Engineering & Technology'
  );

  // Uploaded Files State
  const [filesQueue, setFilesQueue] = useState<UploadedFileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [expandedFindings, setExpandedFindings] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showExtractedTextModal, setShowExtractedTextModal] = useState<boolean>(false);

  // Cross-verification State
  const [selectedForCrossCheck, setSelectedForCrossCheck] = useState<string[]>([]);
  const [crossFindings, setCrossFindings] = useState<CrossDocumentFinding[]>([]);
  const [isCrossChecking, setIsCrossChecking] = useState(false);

  const categories = [
    { value: 'land_deed', label: 'Land Title Deed / Ownership (APH 4.1)' },
    { value: 'building_plan', label: 'Municipal Sanctioned Building Plan (Appendix 4)' },
    { value: 'fire_safety', label: 'Statutory Fire Safety NOC (APH 5.3)' },
    { value: 'society_trust', label: 'Sponsoring Society / Trust Deed' },
    { value: 'faculty_list', label: 'Faculty Register & Form 16 (Appendix 7)' },
    { value: 'fdr_guarantee', label: 'Joint Corpus FDR with AICTE (Appendix 1)' },
    { value: 'affiliation_noc', label: 'University & State Govt NOC' },
    { value: 'other', label: 'Other Regulatory Submission' },
  ];

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Upload handler with validation
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const newItems: UploadedFileItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 1. Check for empty files
      if (file.size === 0) {
        setUploadError(`File "${file.name}" is empty (0 bytes). Unreadable or blank files cannot be verified.`);
        continue;
      }

      // 2. Validate file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        setUploadError(`File "${file.name}" exceeds the 25MB size limit.`);
        continue;
      }

      // 3. Validate file format
      const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidExt = validExtensions.includes(fileExt);
      const isValidMime = file.type === 'application/pdf' || file.type.startsWith('image/');

      if (!isValidExt && !isValidMime) {
        setUploadError(`Unsupported format for "${file.name}". AICTE VerifyAI accepts PDF, JPG, JPEG, and PNG documents.`);
        continue;
      }

      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;

      let base64 = '';
      try {
        base64 = await readFileAsBase64(file);
      } catch (readErr) {
        console.error('Failed to read file buffer:', readErr);
        setUploadError(`Failed to read file data from "${file.name}".`);
        continue;
      }

      const isPdf = file.type === 'application/pdf' || fileExt === '.pdf';
      const previewUrl = isPdf 
        ? '/src/assets/images/document_scrutiny_graphic_1793170320748.jpg'
        : URL.createObjectURL(file);

      const catObj = categories.find(c => c.value === selectedCategory);

      const item: UploadedFileItem = {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        file,
        name: file.name,
        size: formattedSize,
        type: isPdf ? 'application/pdf' : (file.type || 'image/png'),
        category: selectedCategory,
        categoryLabel: catObj ? catObj.label : 'Institutional Document',
        previewUrl,
        progress: 10,
        stage: 'validating',
        fileBase64: base64,
      };

      newItems.push(item);
    }

    if (newItems.length > 0) {
      setFilesQueue(prev => [...newItems, ...prev]);
      setActiveFileId(newItems[0].id);

      newItems.forEach(item => {
        executeCompleteVerificationWorkflow(item);
      });
    }
  };

  // Test preset loader
  const handleLoadPreset = async (presetId: string) => {
    setUploadError(null);
    const preset = SAMPLE_TEST_DOCUMENTS.find(p => p.id === presetId);
    if (!preset) return;

    const previewUrl = preset.category === 'land_deed' 
      ? '/src/assets/images/document_scrutiny_graphic_1793170320748.jpg'
      : preset.category === 'building_plan'
      ? '/src/assets/images/institutional_campus_aerial_1793170320366.jpg'
      : '/src/assets/images/document_scrutiny_graphic_1793170320748.jpg';

    const dummyBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const mockFileItem: UploadedFileItem = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${preset.title.replace(/[\s\(\)]+/g, '_')}.png`,
      size: preset.fileSize,
      type: 'image/png',
      category: preset.category,
      categoryLabel: preset.categoryLabel,
      previewUrl,
      progress: 15,
      stage: 'validating',
      fileBase64: dummyBase64,
    };

    setFilesQueue(prev => [mockFileItem, ...prev]);
    setActiveFileId(mockFileItem.id);
    setInstitutionNameInput(preset.institution);

    executeCompleteVerificationWorkflow(mockFileItem);
  };

  // Complete 7-step Workflow Execution
  const executeCompleteVerificationWorkflow = async (item: UploadedFileItem) => {
    try {
      // Step 1: Validation
      setFilesQueue(prev => prev.map(f => f.id === item.id ? { ...f, progress: 20, stage: 'extracting' } : f));

      // Step 2: Extract text across all pages
      const extractResponse = await fetch('/api/extract-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: item.name,
          fileBase64: item.fileBase64,
          mimeType: item.type,
        }),
      });

      let extractionData: TextExtractionResult | null = null;
      if (extractResponse.ok) {
        extractionData = await extractResponse.json();
      }

      setFilesQueue(prev => prev.map(f => f.id === item.id ? { 
        ...f, 
        progress: 50, 
        stage: 'validating_text',
        extractionResult: extractionData || undefined,
      } : f));

      // Step 3: Validate extracted text & trigger AI scrutiny
      setFilesQueue(prev => prev.map(f => f.id === item.id ? { ...f, progress: 70, stage: 'analyzing_ai' } : f));

      const verifyResponse = await fetch('/api/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: item.name,
          documentType: item.category,
          fileBase64: item.fileBase64,
          mimeType: item.type,
          institutionName: institutionNameInput,
          applicationId: currentApplication?.applicationNumber || 'AICTE/SCRUT/2026/INP',
          extractedText: extractionData?.text || '',
          pages: extractionData?.pages || [],
          isScanned: extractionData?.isScanned || false,
          pdfMetadata: extractionData?.pdfMetadata,
        }),
      });

      if (!verifyResponse.ok) {
        const errJson = await verifyResponse.json().catch(() => ({}));
        throw new Error(errJson.error || `Server verification failed with status ${verifyResponse.status}`);
      }

      const resData = await verifyResponse.json();
      const analysisResult: DocumentAnalysisResult = resData.data;

      // Update file queue item
      setFilesQueue(prev => prev.map(f => {
        if (f.id === item.id) {
          return {
            ...f,
            progress: 100,
            stage: 'completed',
            analysis: analysisResult,
          };
        }
        return f;
      }));

      // Propagate into central application state
      if (onDocumentVerified) {
        const verifiedDoc: ScrutinyDocument = {
          id: item.id,
          name: item.name,
          category: item.category as any,
          categoryLabel: item.categoryLabel,
          size: item.size,
          uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: analysisResult.status,
          confidenceScore: analysisResult.confidenceScore,
          documentIdentifier: analysisResult.documentIdentifier,
          issuanceDate: analysisResult.issuanceDate,
          expiryDate: analysisResult.expiryDate,
          issuingAuthority: analysisResult.issuingAuthority,
          extractedMetrics: analysisResult.extractedMetrics,
          missingFields: analysisResult.missingFieldsDetected,
          findings: analysisResult.findings,
          previewUrl: item.previewUrl,
          isRealUploaded: true,
          analysis: analysisResult,
        };
        onDocumentVerified(verifiedDoc);
      }
    } catch (err: any) {
      console.error('Workflow execution error:', err);
      setFilesQueue(prev => prev.map(f => {
        if (f.id === item.id) {
          return {
            ...f,
            progress: 100,
            stage: 'error',
            errorMessage: err?.message || 'Verification workflow encountered an error.',
          };
        }
        return f;
      }));
    }
  };

  const handleRemoveFile = (id: string) => {
    setFilesQueue(prev => prev.filter(f => f.id !== id));
    setSelectedForCrossCheck(prev => prev.filter(item => item !== id));
    if (activeFileId === id) {
      const remaining = filesQueue.filter(f => f.id !== id);
      setActiveFileId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleRetryFile = (item: UploadedFileItem) => {
    setUploadError(null);
    executeCompleteVerificationWorkflow(item);
  };

  const toggleFindingEvidence = (findingId: string) => {
    setExpandedFindings(prev => ({
      ...prev,
      [findingId]: !prev[findingId],
    }));
  };

  const handleRunCrossCheck = async () => {
    const selectedDocs = filesQueue.filter(f => selectedForCrossCheck.includes(f.id));
    if (selectedDocs.length < 2) {
      alert('Please select at least two analyzed documents using the checkboxes to perform cross-document consistency verification.');
      return;
    }

    setIsCrossChecking(true);
    try {
      const response = await fetch('/api/cross-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: selectedDocs.map(d => ({
            id: d.id,
            name: d.name,
            category: d.category,
            institutionName: d.analysis?.institutionNameExtracted || institutionNameInput,
            analysis: d.analysis,
          })),
        }),
      });

      const data = await response.json();
      if (data.anomalies) {
        setCrossFindings(data.anomalies);
      }
    } catch (err) {
      console.error('Cross-verification request failed:', err);
    } finally {
      setIsCrossChecking(false);
    }
  };

  const toggleSelectForCross = (id: string) => {
    setSelectedForCrossCheck(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const activeFile = filesQueue.find(f => f.id === activeFileId) || filesQueue[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Workspace Header */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Source Optical & Regulatory Scrutiny Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Document Verification Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Multi-page PDF parsing, OCR image extraction, grounded Gemini APH analysis, and cross-document discrepancy auditing.
            </p>
          </div>

          {/* Quick Presets for Evaluator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Load Test Scenarios:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleLoadPreset('sample-pass-land')}
                className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800/50 rounded-lg transition-colors flex items-center gap-1.5 min-h-[36px]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Compliant Title Deed</span>
              </button>
              <button
                onClick={() => handleLoadPreset('sample-fail-fire')}
                className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-800/50 rounded-lg transition-colors flex items-center gap-1.5 min-h-[36px]"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Expired Fire NOC</span>
              </button>
              <button
                onClick={() => handleLoadPreset('sample-warn-mismatch')}
                className="px-2.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800/50 rounded-lg transition-colors flex items-center gap-1.5 min-h-[36px]"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Area Discrepancy</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'single'
                ? 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800/60'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document Scrutiny View</span>
          </button>
          <button
            onClick={() => setActiveTab('cross_check')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'cross_check'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Cross-Document Parity Audit</span>
            {crossFindings.length > 0 && (
              <span className="font-mono text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded-full">
                {crossFindings.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {uploadError && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 flex items-start justify-between gap-3 text-xs text-rose-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-rose-300">File Validation Issue: </strong>
              <span>{uploadError}</span>
            </div>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="text-rose-400 hover:text-white font-bold text-sm px-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload Zone & Metadata Configuration */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Institution Legal Entity Name
            </label>
            <input
              type="text"
              value={institutionNameInput}
              onChange={(e) => setInstitutionNameInput(e.target.value)}
              placeholder="e.g. Aryavart Institute of Advanced Engineering & Technology"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Target Document Category (APH Standard)
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drag & Drop Box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileSelect(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20'
              : 'border-slate-300 dark:border-slate-700/80 hover:border-cyan-500 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-900/70'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileSelect(e.target.files)}
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/50 flex items-center justify-center mx-auto text-cyan-600 dark:text-cyan-400">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Drop PDF, JPG, JPEG, or PNG files here, or{' '}
                <span className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 underline underline-offset-2">
                  Browse Files
                </span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports multi-page PDFs, scanned certificates, and high-resolution images up to 25MB.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-2 font-mono">
              <span>✓ Multi-Page PDF Parser</span>
              <span>·</span>
              <span>✓ Tesseract & Gemini OCR</span>
              <span>·</span>
              <span>✓ APH Clause Evidence Matcher</span>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Documents Queue */}
      {filesQueue.length > 0 && (
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Verification Processing Queue ({filesQueue.length} Documents)
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Select for Cross-Verification:</span>
              <button
                onClick={() => setSelectedForCrossCheck(filesQueue.map(f => f.id))}
                className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-medium text-[11px]"
              >
                Select All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filesQueue.map((item) => {
              const isSelected = item.id === activeFile?.id;
              const isCheckedForCross = selectedForCrossCheck.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveFileId(item.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-400 dark:border-cyan-500/60 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isCheckedForCross}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelectForCross(item.id);
                        }}
                        className="mt-1 w-3.5 h-3.5 rounded text-cyan-500 bg-slate-900 border-slate-700"
                        title="Include in Cross-Verification"
                      />
                      <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {item.size} · {item.type.includes('pdf') ? 'PDF' : 'Image'} · {item.categoryLabel}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {item.stage === 'error' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRetryFile(item);
                          }}
                          className="p-1 text-slate-400 hover:text-cyan-300 rounded"
                          title="Retry Analysis"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(item.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded"
                        title="Remove Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Stage-based progress display */}
                  <div className="mt-3">
                    {item.stage !== 'completed' && item.stage !== 'error' ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1 text-cyan-400">
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                            {item.stage === 'validating' && 'Validating file integrity...'}
                            {item.stage === 'extracting' && 'Extracting multi-page text & OCR...'}
                            {item.stage === 'validating_text' && 'Validating extracted text quality...'}
                            {item.stage === 'analyzing_ai' && 'Grounded Gemini APH scrutiny...'}
                          </span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${item.progress}%` }}
                            className="h-full bg-cyan-400 transition-all duration-300"
                          />
                        </div>
                      </div>
                    ) : item.stage === 'completed' && item.analysis ? (
                      <div className="flex items-center justify-between pt-1">
                        <StatusBadge status={item.analysis.status} size="sm" />
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.analysis.pageCount} Pages · {item.analysis.confidenceScore}% Conf
                        </span>
                      </div>
                    ) : item.stage === 'error' ? (
                      <div className="space-y-1">
                        <span className="text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {item.errorMessage || 'Analysis Failed'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRetryFile(item);
                          }}
                          className="text-[10px] text-cyan-400 underline"
                        >
                          Retry Processing
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 1: Single Document Scrutiny View */}
      {activeTab === 'single' && activeFile && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Pane: Document Optical Preview & Text Extraction Summary */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Source Document Scan
                </span>
                <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                  {activeFile.type.includes('pdf') ? 'PDF Source' : 'Raster Image'}
                </span>
              </div>

              {/* Preview Canvas */}
              <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-950 relative min-h-[360px] max-h-[500px] flex items-center justify-center">
                <img
                  src={activeFile.previewUrl}
                  alt={activeFile.name}
                  className="w-full h-full object-contain max-h-[480px]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-white/90 dark:bg-slate-950/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-800 dark:text-slate-300 font-mono truncate max-w-[200px]">{activeFile.name}</span>
                  <span className="text-cyan-600 dark:text-cyan-400 text-[11px] font-mono">
                    {activeFile.analysis?.pageCount ? `${activeFile.analysis.pageCount} Pages` : 'Page 1'}
                  </span>
                </div>
              </div>
            </div>

            {/* Extracted Text & Quality Check Box */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  Text Extraction Quality
                </span>
                <button
                  onClick={() => setShowExtractedTextModal(true)}
                  className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-mono underline"
                >
                  View Full Extracted Text ({activeFile.extractionResult?.characterCount || activeFile.analysis?.rawTextPreview?.length || 0} chars)
                </button>
              </div>

              {activeFile.extractionResult?.warningMessage && (
                <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-200 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{activeFile.extractionResult.warningMessage}</span>
                </div>
              )}

              {activeFile.analysis?.rawTextPreview && (
                <p className="text-slate-700 dark:text-slate-300 text-[11px] font-mono max-h-20 overflow-y-auto leading-relaxed border-t border-slate-200 dark:border-slate-800/80 pt-1.5">
                  "{activeFile.analysis.rawTextPreview}..."
                </p>
              )}
            </div>

            {/* Document metadata summary */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Category: <strong className="text-slate-900 dark:text-slate-200">{activeFile.categoryLabel}</strong></span>
              <span>Method: <strong className="text-cyan-600 dark:text-cyan-400">{activeFile.analysis?.textExtractionMethod || 'Evaluating'}</strong></span>
            </div>
          </div>

          {/* Right Pane: Structured Analysis View */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-5">
            {activeFile.stage !== 'completed' && activeFile.stage !== 'error' ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-cyan-600 dark:text-cyan-400 animate-spin mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Extracting & Scrutinizing Document</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Performing multi-page text extraction, digital signature validation, and grounded APH compliance scrutiny...
                </p>
              </div>
            ) : activeFile.analysis ? (
              <>
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={activeFile.analysis.status} size="lg" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {activeFile.analysis.status === 'PASS' 
                          ? 'Satisfies AICTE APH Regulatory Standards'
                          : activeFile.analysis.status === 'WARNING'
                          ? 'Requires Regulatory Clarification'
                          : 'Deficiency Found in Verification'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {activeFile.analysis.aphRuleReference}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Scrutiny Confidence</span>
                      <span className="text-sm font-bold font-mono text-cyan-300">
                        {activeFile.analysis.confidenceScore}%
                      </span>
                    </div>

                    {/* Direct link to Reports View */}
                    {onNavigateToReports && (
                      <button
                        onClick={onNavigateToReports}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-colors min-h-[36px]"
                      >
                        <Printer className="w-3.5 h-3.5 text-cyan-400" />
                        <span>View Report</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Extracted Core Fields Grid */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Verified Institutional Identifiers
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                        <Building className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Extracted Institution Name</span>
                      </div>
                      <p className="text-xs font-bold text-white">
                        {activeFile.analysis.institutionNameExtracted || 'Not Identified'}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                        <Hash className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Certificate / Registration No.</span>
                      </div>
                      <p className="text-xs font-bold font-mono text-cyan-300">
                        {activeFile.analysis.documentIdentifier || 'Not Available'}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                        <Award className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Issuing Competent Authority</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200">
                        {activeFile.analysis.issuingAuthority || 'Not Stated'}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Validity Chronology</span>
                      </div>
                      <p className="text-xs font-mono text-slate-200">
                        Issued: {activeFile.analysis.issuanceDate || 'N/A'} {activeFile.analysis.expiryDate ? `· Expiry: ${activeFile.analysis.expiryDate}` : '· Freehold / Unspecified'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Structured Fields Table with Page References & Confidence */}
                {activeFile.analysis.fields && activeFile.analysis.fields.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      Individual Field Scrutiny Matrix ({activeFile.analysis.fields.length} Fields)
                    </span>

                    <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/50">
                      <table className="min-w-full divide-y divide-slate-800 text-left text-xs">
                        <thead>
                          <tr className="text-slate-400 text-[11px] bg-slate-900/80">
                            <th className="py-2.5 px-3 font-semibold">Field Name</th>
                            <th className="py-2.5 px-3 font-semibold">Extracted Value</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Source Page</th>
                            <th className="py-2.5 px-3 font-semibold text-right">Confidence</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                          {activeFile.analysis.fields.map((f, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/30">
                              <td className="py-2 px-3 font-sans font-medium text-slate-300">
                                {f.fieldName}
                              </td>
                              <td className="py-2 px-3">
                                {f.isMissingOrUncertain || !f.value ? (
                                  <span className="text-rose-400 font-sans italic bg-rose-950/40 border border-rose-900/40 px-2 py-0.5 rounded text-[10px]">
                                    Missing / Unspecified
                                  </span>
                                ) : (
                                  <span className="text-slate-100 font-bold">{f.value}</span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-center text-slate-400">
                                {f.sourcePage ? `p. ${f.sourcePage}` : '—'}
                              </td>
                              <td className="py-2 px-3 text-right">
                                <span className={f.confidence >= 90 ? 'text-emerald-400' : 'text-amber-400'}>
                                  {f.confidence}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Document Authentication Status Section */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      Document Authenticity & Integrity Inspection
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded">
                      Official verification unavailable
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {activeFile.analysis.authentication?.officialRegistryReason}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] font-mono">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Digital Signature</span>
                      <span className="text-slate-200 font-bold">
                        {activeFile.analysis.authentication?.signatureAnalysis === 'SIGNATURE_DETECTED_UNVALIDATED' 
                          ? 'Present (Unvalidated)' 
                          : 'No Embedded Sig'}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">PDF Producer</span>
                      <span className="text-slate-200 truncate block">
                        {activeFile.analysis.authentication?.pdfMetadata?.producer || 'Standard Export'}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                      <span className="text-slate-400 block text-[10px]">Structural Tamper Risk</span>
                      <span className={activeFile.analysis.authentication?.tamperRisk === 'LOW' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {activeFile.analysis.authentication?.tamperRisk || 'LOW'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Evidence Supporting Findings (Expandable) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Specific Evidence-Backed Regulatory Checks ({activeFile.analysis.findings?.length || 0})
                    </h4>
                    <span className="text-[11px] text-slate-400">APH Compliance Traceability</span>
                  </div>

                  <div className="space-y-2">
                    {activeFile.analysis.findings?.map((finding: any, idx: number) => {
                      const isExpanded = expandedFindings[idx] ?? true;
                      return (
                        <div
                          key={idx}
                          className="rounded-lg bg-slate-900/80 border border-slate-800 overflow-hidden"
                        >
                          <div
                            onClick={() => toggleFindingEvidence(String(idx))}
                            className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/40 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <StatusBadge status={finding.status} size="sm" />
                              <span className="text-xs font-bold text-slate-200 truncate">
                                {finding.checkName}
                              </span>
                            </div>

                            <button className="text-slate-400 hover:text-white">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/60 space-y-2 text-xs">
                              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                                <span className="text-[10px] text-cyan-400 font-mono uppercase block mb-1">
                                  Evidence from Source Document ({finding.sourcePage ? `Page ${finding.sourcePage}` : 'Scanned Sheet'}):
                                </span>
                                <p className="text-slate-300 italic font-mono text-[11px] leading-relaxed">
                                  "{finding.evidenceText}"
                                </p>
                              </div>

                              <div className="flex items-start gap-1.5 text-slate-400">
                                <strong className="text-slate-300 font-medium shrink-0">Action Directive:</strong>
                                <span>{finding.recommendedAction}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scrutiny Summary */}
                <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                    AI Scrutiny Synthesis
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeFile.analysis.summary}
                  </p>
                </div>
              </>
            ) : (
              <div className="py-20 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">No document selected</h4>
                <p className="text-xs text-slate-400">Upload a file or choose one from the queue above.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Cross-Document Parity Audit */}
      {activeTab === 'cross_check' && (
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                Cross-Document Consistency & Discrepancy Checker
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Compare extracted values across multiple documents to detect legal name divergences, land area variances, and conflicting dates.
              </p>
            </div>

            <button
              onClick={handleRunCrossCheck}
              disabled={isCrossChecking || selectedForCrossCheck.length < 2}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all min-h-[40px] ${
                selectedForCrossCheck.length >= 2
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              {isCrossChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <GitCompare className="w-4 h-4" />}
              <span>Compare Selected ({selectedForCrossCheck.length})</span>
            </button>
          </div>

          {selectedForCrossCheck.length < 2 && (
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>
                Please check at least two documents in the queue above (e.g., Land Title Deed and Sanctioned Building Plan) to run cross-document analysis.
              </span>
            </div>
          )}

          {/* Cross-Verification Findings */}
          {crossFindings.length > 0 ? (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                Detected Cross-Document Inconsistencies ({crossFindings.length})
              </span>

              <div className="space-y-3.5">
                {crossFindings.map((finding) => (
                  <div
                    key={finding.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase ${
                          finding.severity === 'CRITICAL' 
                            ? 'bg-rose-950 text-rose-300 border-rose-800' 
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}>
                          {finding.severity}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {finding.field}
                        </span>
                      </div>
                    </div>

                    {/* Side-by-side comparison strip */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                        <span className="text-[10px] text-slate-400 block font-mono truncate">
                          Source A: {finding.documentA.name}
                        </span>
                        <p className="text-xs font-bold text-cyan-300 font-mono">
                          {finding.documentA.value}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                        <span className="text-[10px] text-slate-400 block font-mono truncate">
                          Source B: {finding.documentB.name}
                        </span>
                        <p className="text-xs font-bold text-rose-300 font-mono">
                          {finding.documentB.value}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {finding.explanation}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-start gap-1.5 text-xs text-amber-300">
                      <strong className="shrink-0">Required Action:</strong>
                      <span>{finding.recommendedAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-200">
                {selectedForCrossCheck.length >= 2 
                  ? 'No critical cross-document discrepancies detected between selected files.' 
                  : 'Ready for cross-document parity check.'}
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Documents exhibit consistent legal names, compatible demarcated footprints, and matching chronological clearance dates.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal: Full Multi-Page Extracted Text Viewer */}
      {showExtractedTextModal && activeFile && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowExtractedTextModal(false)}
        >
          <div 
            className="w-full max-w-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Extracted Document Text Breakdown
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeFile.name} · {activeFile.extractionResult?.pageCount || activeFile.analysis?.pageCount || 1} Pages Extracted
                </p>
              </div>
              <button
                onClick={() => setShowExtractedTextModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Page by page text */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 font-mono text-xs">
              {activeFile.extractionResult?.pages && activeFile.extractionResult.pages.length > 0 ? (
                activeFile.extractionResult.pages.map((p) => (
                  <div key={p.page} className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider block">
                      Page {p.page} ({p.characterCount} characters):
                    </span>
                    <pre className="whitespace-pre-wrap font-mono text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                      {p.text || '[Empty or Unextractable Page]'}
                    </pre>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {activeFile.analysis?.rawTextPreview || 'No raw text extractable from this document.'}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowExtractedTextModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Close Text Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
