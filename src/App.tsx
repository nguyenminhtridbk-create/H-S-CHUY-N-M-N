import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OfficialLegalRefModal } from './components/OfficialLegalRefModal';
import { DocumentBuilderTab } from './components/DocumentBuilderTab';
import { DocumentEditorView } from './components/DocumentEditorView';
import { DocumentArchiveTab } from './components/DocumentArchiveTab';
import { DepartmentDirectivesTab } from './components/DepartmentDirectivesTab';
import { SchoolContextPanel } from './components/SchoolContextPanel';
import { TeacherDirectoryTab } from './components/TeacherDirectoryTab';
import { SchoolDocument, DepartmentDirective } from './types/document';
import { INITIAL_SCHOOL_DOCUMENTS } from './data/mockDocuments';
import { INITIAL_DEPARTMENT_DIRECTIVES } from './data/mockDirectives';

const DEFAULT_SCHOOL_FACTS = `- Quy mô: 53 lớp, 2.143 học sinh (39 lớp THCS gồm 24 lớp điểm Đốc Binh Kiều, 15 lớp điểm Tân Kiều cách 11km; 14 lớp THPT).
- Đội ngũ: 120 Cán bộ, giáo viên, nhân viên (04 Ban Giám hiệu, 102 Giáo viên trực tiếp giảng dạy, 14 Nhân viên).
- 08 Tổ chuyên môn: BGH (04), Toán (15 GV), Ngữ văn - Thư viện - Thiết bị (17), KHTN-CN (26 GV), KHXH (16 GV), Tiếng Anh-Tin học (16 GV), GDTC-QPAN-NT (12 GV), Tổ Văn phòng (14).
- Lãnh đạo ký văn bản: Thầy Hiệu trưởng Lê Thanh Cường phụ trách chung; Thầy Phó Hiệu trưởng Nguyễn Minh Trí trực tiếp phụ trách chuyên môn toàn trường.
- Định hướng chuyển đổi số: 100% hồ sơ, học bạ số, sổ điểm điện tử; khai thác AI an toàn, liêm chính trong dạy và học.`;

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  // Department Directives Repository (Lưu trữ sẵn trên webapp)
  const [directivesList, setDirectivesList] = useState<DepartmentDirective[]>(() => {
    try {
      const saved = localStorage.getItem('dbk_department_directives');
      if (saved) {
        const parsed: DepartmentDirective[] = JSON.parse(saved);
        const map = new Map<string, DepartmentDirective>();
        for (const initDir of INITIAL_DEPARTMENT_DIRECTIVES) {
          map.set(initDir.id, initDir);
        }
        for (const userDir of parsed) {
          if (map.has(userDir.id)) continue;
          const isDuplicate = Array.from(map.values()).some((existing) => {
            const sameNumber =
              existing.documentNumber &&
              userDir.documentNumber &&
              existing.documentNumber.trim().toLowerCase() === userDir.documentNumber.trim().toLowerCase();
            const sameTitle =
              existing.title.trim().toLowerCase() === userDir.title.trim().toLowerCase();
            const sameFile =
              existing.fileName &&
              userDir.fileName &&
              existing.fileName.trim().toLowerCase() === userDir.fileName.trim().toLowerCase();
            return sameNumber || sameTitle || sameFile;
          });
          if (!isDuplicate) {
            map.set(userDir.id, userDir);
          }
        }
        return Array.from(map.values());
      }
      return INITIAL_DEPARTMENT_DIRECTIVES;
    } catch {
      return INITIAL_DEPARTMENT_DIRECTIVES;
    }
  });

  // Selected Directive to be contextualized in Builder
  const [selectedDirectiveForBuilder, setSelectedDirectiveForBuilder] = useState<DepartmentDirective | null>(null);

  // School Documents Archive (Kho văn bản của trường)
  const [documentsList, setDocumentsList] = useState<SchoolDocument[]>(() => {
    try {
      const saved = localStorage.getItem('dbk_school_documents_archive');
      if (saved) {
        const parsed: SchoolDocument[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_SCHOOL_DOCUMENTS;
    } catch {
      return INITIAL_SCHOOL_DOCUMENTS;
    }
  });

  // Current document for Viewing / Editing in Editor
  const [currentDocument, setCurrentDocument] = useState<SchoolDocument>(() => {
    const assessmentPlan = INITIAL_SCHOOL_DOCUMENTS.find(d => d.id === 'doc-kh-ktdg-52');
    return assessmentPlan || INITIAL_SCHOOL_DOCUMENTS[0];
  });

  // Custom School Facts
  const [customFacts, setCustomFacts] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dbk_custom_school_facts');
      return saved || DEFAULT_SCHOOL_FACTS;
    } catch {
      return DEFAULT_SCHOOL_FACTS;
    }
  });

  // Load documents from backend server storage on mount
  useEffect(() => {
    fetch('/api/documents')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setDocumentsList(res.data);
          try {
            localStorage.setItem('dbk_school_documents_archive', JSON.stringify(res.data));
          } catch (e) {
            console.error('Failed to save to localStorage', e);
          }
          setCurrentDocument((prev) => {
            const match = res.data.find((d: SchoolDocument) => d.id === prev?.id);
            return match || res.data.find((d: SchoolDocument) => d.id === 'doc-kh-ktdg-52') || res.data[0];
          });
        }
      })
      .catch((err) => console.log('Using local data', err));
  }, []);

  // Save directives list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dbk_department_directives', JSON.stringify(directivesList));
    } catch (e) {
      console.error('Failed to save directives to localStorage', e);
    }
  }, [directivesList]);

  // Save school documents list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dbk_school_documents_archive', JSON.stringify(documentsList));
    } catch (e) {
      console.error('Failed to save documents to localStorage', e);
    }
  }, [documentsList]);

  // Save custom facts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dbk_custom_school_facts', customFacts);
    } catch (e) {
      console.error('Failed to save facts to localStorage', e);
    }
  }, [customFacts]);

  // Handler: Add new directive to webapp repository
  const handleAddDirective = (newDirective: DepartmentDirective) => {
    setDirectivesList((prev) => {
      const existingIdx = prev.findIndex(
        (d) =>
          d.id === newDirective.id ||
          (d.documentNumber &&
            newDirective.documentNumber &&
            d.documentNumber.trim().toLowerCase() === newDirective.documentNumber.trim().toLowerCase()) ||
          d.title.trim().toLowerCase() === newDirective.title.trim().toLowerCase()
      );
      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], ...newDirective };
        return copy;
      }
      return [newDirective, ...prev];
    });
  };

  // Handler: Delete directive
  const handleDeleteDirective = (id: string) => {
    setDirectivesList((prev) => prev.filter((d) => d.id !== id));
  };

  // Handler: Trigger contextualize from DepartmentDirectivesTab
  const handleContextualizeDirective = (directive: DepartmentDirective) => {
    setSelectedDirectiveForBuilder(directive);
    setActiveTab('builder');
  };

  // Handler: When a new document is generated or synced from chat
  const handleDocumentGenerated = (doc: SchoolDocument) => {
    // If generated from a selected directive, link them both!
    if (selectedDirectiveForBuilder) {
      doc.sourceDirectiveId = selectedDirectiveForBuilder.id;
      doc.sourceDirective = `${selectedDirectiveForBuilder.documentNumber} - ${selectedDirectiveForBuilder.title}`;
      doc.sourceDirectiveFullText = selectedDirectiveForBuilder.fullContent;

      // Update the directive's linkedSchoolDocumentIds
      setDirectivesList((prev) =>
        prev.map((d) => {
          if (d.id === selectedDirectiveForBuilder.id) {
            const linked = d.linkedSchoolDocumentIds || [];
            if (!linked.includes(doc.id)) {
              return { ...d, linkedSchoolDocumentIds: [...linked, doc.id] };
            }
          }
          return d;
        })
      );
      setSelectedDirectiveForBuilder(null);
    }

    setCurrentDocument(doc);
    setDocumentsList((prev) => {
      const existingIdx = prev.findIndex((d) => d.id === doc.id);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = doc;
        return updated;
      }
      return [doc, ...prev];
    });
    // Immediately switch to the Editor / Viewer tab so Thầy can read and export!
    setActiveTab('editor');
  };

  // Handler: Update document from editor
  const handleUpdateDocument = (updatedDoc: SchoolDocument) => {
    setCurrentDocument(updatedDoc);
    setDocumentsList((prev) =>
      prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
    );
    // Persist permanently to server disk file
    fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDoc),
    }).catch((e) => console.error('Failed to save document to server', e));
  };

  // Handler: Save to archive
  const handleSaveToArchive = (doc: SchoolDocument) => {
    const officialDoc = { ...doc, status: 'official' as const };
    setDocumentsList((prev) => {
      const existingIdx = prev.findIndex((d) => d.id === doc.id);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = officialDoc;
        return updated;
      }
      return [officialDoc, ...prev];
    });
    // Persist permanently to server disk file
    fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(officialDoc),
    }).catch((e) => console.error('Failed to save document to server', e));
  };

  // Handler: Reset a document back to default template
  const handleResetToDefault = (docId: string) => {
    fetch(`/api/documents/reset-default/${docId}`, { method: 'POST' })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const resetDoc = res.data;
          setCurrentDocument(resetDoc);
          setDocumentsList((prev) =>
            prev.map((d) => (d.id === docId ? resetDoc : d))
          );
        }
      })
      .catch((e) => {
        const defaultDoc = INITIAL_SCHOOL_DOCUMENTS.find((d) => d.id === docId);
        if (defaultDoc) {
          setCurrentDocument(defaultDoc);
          setDocumentsList((prev) =>
            prev.map((d) => (d.id === docId ? defaultDoc : d))
          );
        }
      });
  };

  // Handler: Select document from Archive
  const handleSelectFromArchive = (doc: SchoolDocument) => {
    setCurrentDocument(doc);
    setActiveTab('editor');
  };

  // Handler: Delete document from Archive
  const handleDeleteDocument = (id: string) => {
    setDocumentsList((prev) => prev.filter((d) => d.id !== id));
    if (currentDocument?.id === id && documentsList.length > 1) {
      setCurrentDocument(documentsList.find((d) => d.id !== id) || INITIAL_SCHOOL_DOCUMENTS[0]);
    }
    // Delete from server disk
    fetch(`/api/documents/${id}`, { method: 'DELETE' }).catch((e) => console.error(e));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        onOpenLegalModal={() => setIsLegalModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveDocument={!!currentDocument}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Tab 1: Builder (Tra cứu & Cụ thể hóa văn bản) */}
        {activeTab === 'builder' && (
          <DocumentBuilderTab 
            onDocumentGenerated={handleDocumentGenerated}
            prefilledDirective={selectedDirectiveForBuilder}
            onClearPrefilledDirective={() => setSelectedDirectiveForBuilder(null)}
          />
        )}

        {/* Tab 2: Editor & A4 Viewer (Xuất file Word docx / PDF) */}
        {activeTab === 'editor' && currentDocument && (
          <DocumentEditorView
            document={currentDocument}
            onUpdateDocument={handleUpdateDocument}
            onSaveToArchive={handleSaveToArchive}
            onResetToDefault={handleResetToDefault}
            onBack={() => setActiveTab('archive')}
            onViewSourceDirective={(directiveTitle, fullContent) => {
              // Switch to directives tab or locate the directive
              setActiveTab('directives');
            }}
          />
        )}

        {/* Tab 3: Directives from Department (Văn bản chỉ đạo của Sở nằm sẵn trên webapp) */}
        {activeTab === 'directives' && (
          <DepartmentDirectivesTab
            directives={directivesList}
            schoolDocuments={documentsList}
            onAddDirective={handleAddDirective}
            onDeleteDirective={handleDeleteDirective}
            onContextualizeDirective={handleContextualizeDirective}
            onViewSchoolDocument={(sd) => {
              setCurrentDocument(sd);
              setActiveTab('editor');
            }}
          />
        )}

        {/* Tab 4: Archive (Kho văn bản hoàn chỉnh của trường) */}
        {activeTab === 'archive' && (
          <DocumentArchiveTab
            documents={documentsList}
            onSelectDocument={handleSelectFromArchive}
            onDeleteDocument={handleDeleteDocument}
            onOpenCreateNew={() => setActiveTab('builder')}
          />
        )}

        {/* Tab 5: School Profile & Staff (Dữ liệu trường & 120 CB-GV-NV) */}
        {activeTab === 'school_profile' && (
          <div className="space-y-6">
            <SchoolContextPanel
              customFacts={customFacts}
              onUpdateCustomFacts={setCustomFacts}
              onViewSchoolPlanDoc={() => {
                const plan34 = documentsList.find((d) => d.id === 'doc-kh-gd-34') || INITIAL_SCHOOL_DOCUMENTS[0];
                if (plan34) {
                  setCurrentDocument(plan34);
                  setActiveTab('editor');
                }
              }}
            />

            <TeacherDirectoryTab
              onSelectTeacherForLessonPlan={() => {
                setActiveTab('builder');
              }}
              onSelectDepartmentForPlan={() => {
                setActiveTab('builder');
              }}
            />
          </div>
        )}
      </main>

      {/* Official Legal Reference Modal */}
      <OfficialLegalRefModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />
    </div>
  );
}
