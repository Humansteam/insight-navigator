/**
 * Report Parser - Parses structured markdown with [STUDY_REF:...] markers
 *
 * Input format:
 * ```markdown
 * DECEMBER 13, 2025
 *
 * # Lithium Battery Research Analysis
 *
 * The analysis reveals...
 *
 * ## ABSTRACT
 *
 * This review synthesizes...
 *
 * ## METHODS
 *
 * We analyzed 7 sources...
 *
 * ## RESULTS
 *
 * ### Characteristics of Included Studies
 *
 * This review includes 7 sources...
 *
 * ## Thematic Analysis
 *
 * ### Industrial Processing and Manufacturing
 *
 * Chinese research clusters around high-efficiency extraction methods *
 *
 * [STUDY_REF:id=1,title="Industrial-Scale Direct Lithium Extraction",year=2024,authors="Zhang, W., Liu, H.",finding="A membrane-based DLE system..."]
 * ```
 */

export interface StudyRef {
  id: string;
  title: string;
  year: number;
  authors: string;
  finding: string;
}

export interface ReportSection {
  type: 'date' | 'title' | 'lead' | 'section' | 'subsection' | 'paragraph' | 'study_ref' | 'methods';
  content: string;
  sectionTitle?: string;
  studyRef?: StudyRef;
  hasCitation?: boolean;
  isCollapsible?: boolean;
}

export interface ParsedReport {
  date: string;
  title: string;
  lead: string;
  sections: ReportSection[];
  studyRefs: Map<string, StudyRef>;
}

/**
 * Parse [STUDY_REF:...] marker into StudyRef object
 */
function parseStudyRefMarker(marker: string): StudyRef | null {
  // [STUDY_REF:id=1,title="...",year=2024,authors="...",finding="..."]
  const match = marker.match(/\[STUDY_REF:([^\]]+)\]/);
  if (!match) return null;

  const content = match[1];
  const result: Partial<StudyRef> = {};

  // Parse key="value" pairs
  const regex = /(\w+)=(?:"([^"]*)"|(\d+))/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const key = m[1];
    const value = m[2] || m[3];

    if (key === 'id') result.id = String(value);
    if (key === 'title') result.title = value;
    if (key === 'year') result.year = parseInt(value);
    if (key === 'authors') result.authors = value;
    if (key === 'finding') result.finding = value;
  }

  if (result.id && result.title) {
    return {
      id: result.id,
      title: result.title,
      year: result.year || 2024,
      authors: result.authors || 'Unknown',
      finding: result.finding || '',
    };
  }

  return null;
}

/**
 * Parse markdown report into structured sections
 */
export function parseReport(markdown: string): ParsedReport {
  const lines = markdown.split('\n');
  const sections: ReportSection[] = [];
  const studyRefs = new Map<string, StudyRef>();

  let date = '';
  let title = '';
  let lead = '';
  let currentSection = '';
  let inMethods = false;
  let methodsContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Date (all caps with comma)
    if (/^[A-Z]+ \d+, \d{4}$/.test(line)) {
      date = line;
      continue;
    }

    // Main title (# heading)
    if (line.startsWith('# ') && !title) {
      title = line.replace('# ', '');
      continue;
    }

    // Section headers (## ABSTRACT, ## RESULTS, etc.)
    if (line.startsWith('## ')) {
      const sectionTitle = line.replace('## ', '');
      currentSection = sectionTitle.toUpperCase();

      // Check if METHODS section (collapsible)
      if (currentSection === 'METHODS') {
        inMethods = true;
        methodsContent = [];
      } else {
        if (inMethods && methodsContent.length > 0) {
          sections.push({
            type: 'methods',
            content: methodsContent.join('\n'),
            sectionTitle: 'METHODS',
            isCollapsible: true,
          });
          inMethods = false;
        }
        sections.push({
          type: 'section',
          content: '',
          sectionTitle: sectionTitle,
        });
      }
      continue;
    }

    // Subsection headers (### Industrial Processing...)
    if (line.startsWith('### ')) {
      const subsectionTitle = line.replace('### ', '');
      sections.push({
        type: 'subsection',
        content: '',
        sectionTitle: subsectionTitle,
      });
      continue;
    }

    // STUDY_REF marker
    if (line.startsWith('[STUDY_REF:')) {
      const studyRef = parseStudyRefMarker(line);
      if (studyRef) {
        studyRefs.set(studyRef.id, studyRef);
        sections.push({
          type: 'study_ref',
          content: '',
          studyRef,
        });
      }
      continue;
    }

    // Methods content
    if (inMethods) {
      methodsContent.push(line);
      continue;
    }

    // Lead paragraph (before any section)
    if (!currentSection && !line.startsWith('#')) {
      if (!lead) {
        lead = line;
      } else {
        lead += ' ' + line;
      }
      continue;
    }

    // Regular paragraph
    const hasCitation = line.includes('*');
    const cleanContent = line.replace(/\s*\*\s*$/, ''); // Remove trailing *

    sections.push({
      type: 'paragraph',
      content: cleanContent,
      hasCitation,
    });
  }

  // Handle remaining methods content
  if (inMethods && methodsContent.length > 0) {
    sections.push({
      type: 'methods',
      content: methodsContent.join('\n'),
      sectionTitle: 'METHODS',
      isCollapsible: true,
    });
  }

  return {
    date,
    title,
    lead,
    sections,
    studyRefs,
  };
}

/**
 * Convert our ResearchPaper to StudyRef format
 */
export function paperToStudyRef(paper: {
  paper_id: number;
  title: string;
  publication_year?: number;
  authors?: string | string[];
  abstract?: string;
  key_results?: string | string[];
}, index: number): StudyRef {
  const authors = Array.isArray(paper.authors)
    ? paper.authors.slice(0, 2).join(', ')
    : (paper.authors || 'Unknown');

  const finding = Array.isArray(paper.key_results)
    ? paper.key_results[0]
    : (paper.key_results || paper.abstract?.slice(0, 150) || '');

  return {
    id: String(index),
    title: paper.title,
    year: paper.publication_year || 2024,
    authors,
    finding: finding + (finding.length > 150 ? '...' : ''),
  };
}