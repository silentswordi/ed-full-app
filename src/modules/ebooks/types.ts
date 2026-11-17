export type EbookFormat = 'epub' | 'pdf' | 'txt' | 'md' | 'html';

export type TocSource = 'outline' | 'toc' | 'headings' | 'pages';

export type BookDirection = 'rtl' | 'ltr';

export interface EbookTopic {
  id: string;
  title: string;
  normalizedTitle: string;
  content: string;
  htmlContent?: string;
  normalizedContent: string;
  pageStart?: number;
  pageEnd?: number;
  order: number;
}

export interface EbookChapter {
  id: string;
  title: string;
  normalizedTitle: string;
  pageStart?: number;
  pageEnd?: number;
  order: number;
  topics: EbookTopic[];
}

export interface EbookRecord {
  id: string;
  title: string;
  author?: string;
  language?: string;
  dir?: BookDirection;
  format: EbookFormat;
  fileName: string;
  fileSize: number;
  totalPages?: number;
  tocSource: TocSource;
  addedAt: number;
  schemaVersion?: number;
  chapters: EbookChapter[];
}

export interface ParseProgress {
  stage: string;
  percent: number;
}
