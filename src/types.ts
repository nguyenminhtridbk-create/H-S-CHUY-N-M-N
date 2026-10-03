export interface SchoolCampus {
  id: string;
  name: string;
  classCount: number;
  grades: string;
  locationNote: string;
  distanceFromMainCampus: string;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  headName: string;
  memberCount: number;
  subjects: string[];
}

export interface DepartmentPlanEvaluation {
  id: string;
  date: string;
  departmentName: string;
  gradeLevel: string;
  campus: string;
  overallScore: number;
  classification: string;
  summary: string;
  criteriaEvaluation: {
    criteria: string;
    status: string;
    findings: string;
    improvements: string;
  }[];
  digitalAiRecommendations: {
    evaluation: string;
    concreteProposals: string[];
  };
  specificFeedbackForPHT: string[];
  officialConclusion: string;
  status: 'draft' | 'approved' | 'request_changes';
}

export interface SyllabusEvaluation {
  id: string;
  date: string;
  subject: string;
  grade: string;
  semester: string;
  summary: string;
  weeksAnalysis: {
    totalWeeks: number;
    semester1Weeks: number;
    semester2Weeks: number;
    totalPeriods: number;
    evaluationPeriods: string;
  };
  strengths: string[];
  limitations: string[];
  pedagogicalSuggestions: string[];
  digitalAndAiIntegrationMatrix: {
    week: string;
    lesson: string;
    digitalAiActivity: string;
    targetCompetence: string;
  }[];
  approvalStatus: string;
  phtActionRecommendation: string;
}

export interface LessonPlanEvaluation {
  id: string;
  date: string;
  teacherName: string;
  subject: string;
  lessonTitle: string;
  grade: string;
  campus: string;
  lessonOverview: {
    title: string;
    subject: string;
    grade: string;
    teacher: string;
    totalScore: number;
    rank: string;
  };
  objectivesCheck: {
    competenciesStatus: string;
    competenciesComment: string;
    qualitiesStatus: string;
    qualitiesComment: string;
  };
  equipmentCheck: {
    status: string;
    comment: string;
  };
  activitiesCheck: {
    activityNumber: number;
    activityName: string;
    status: string;
    strengths: string;
    improvements: string;
  }[];
  dialogueCheck: {
    isViolated: boolean;
    comment: string;
  };
  digitalAiSuggestions: string[];
  evaluationRubric: string;
  phtDirectRemarks: string;
  approvalStatus: 'approved' | 'revision_required';
}

export interface DigitalAiGuidance {
  subjectTitle: string;
  digitalCompetenceGoals: string[];
  teachingScenarios: {
    topic: string;
    grade: string;
    tool: string;
    activity: string;
    pedagogicalValue: string;
  }[];
  teacherPromptTemplates: {
    title: string;
    promptExample: string;
  }[];
  safetyAndEthicsGuide: string[];
  phtDirectives: string;
}
