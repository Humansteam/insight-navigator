// Papers Screening Types

export interface ScreeningCriteria {
  name: string;
  status: 'pass' | 'fail' | 'partial';
}

export interface PaperScreening {
  verdict: 'include' | 'exclude';
  score: number;
  rationale: string;
  criteria: ScreeningCriteria[];
}

export interface PaperWithScreening {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  citations: number;
  country: 'china' | 'usa' | 'europe' | 'other';
  screening: PaperScreening;
}

export type ReportView = 'report' | 'papers' | 'topology' | 'timeline';
