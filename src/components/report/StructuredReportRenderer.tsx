import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { parseReport, ReportSection, StudyRef } from '@/lib/reportParser';
import { StudyRefCard } from './StudyRefCard';
import { cn } from '@/lib/utils';

interface StructuredReportRendererProps {
  markdown: string;
  className?: string;
}

export const StructuredReportRenderer = ({ markdown, className }: StructuredReportRendererProps) => {
  const [methodsExpanded, setMethodsExpanded] = useState(false);
  const report = parseReport(markdown);

  const renderSection = (section: ReportSection, index: number) => {
    switch (section.type) {
      case 'section':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="mt-8 mb-4"
          >
            <h2 className="text-lg font-semibold text-foreground uppercase tracking-wider border-b border-border pb-2">
              {section.sectionTitle}
            </h2>
          </motion.div>
        );

      case 'subsection':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="mt-6 mb-3"
          >
            <h3 className="text-base font-medium text-foreground">
              {section.sectionTitle}
            </h3>
          </motion.div>
        );

      case 'paragraph':
        return (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className={cn(
              "text-sm text-muted-foreground leading-relaxed mb-3",
              section.hasCitation && "border-l-2 border-primary/30 pl-3"
            )}
          >
            {section.content}
            {section.hasCitation && (
              <span className="text-primary ml-1 text-xs align-super">*</span>
            )}
          </motion.p>
        );

      case 'study_ref':
        if (section.studyRef) {
          return (
            <StudyRefCard key={index} studyRef={section.studyRef} />
          );
        }
        return null;

      case 'methods':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="mt-8 mb-4"
          >
            <button
              onClick={() => setMethodsExpanded(!methodsExpanded)}
              className="flex items-center gap-2 w-full text-left group"
            >
              <h2 className="text-lg font-semibold text-foreground uppercase tracking-wider">
                METHODS
              </h2>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                {methodsExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </span>
              <span className="text-xs text-muted-foreground">
                {methodsExpanded ? 'Click to collapse' : 'Click to expand'}
              </span>
            </button>

            {methodsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-4 bg-muted/30 rounded-lg border border-border"
              >
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("max-w-3xl mx-auto", className)}>
      {/* Date */}
      {report.date && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-4"
        >
          {report.date}
        </motion.div>
      )}

      {/* Title */}
      {report.title && (
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground mb-4 leading-tight"
        >
          {report.title}
        </motion.h1>
      )}

      {/* Lead paragraph */}
      {report.lead && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-base text-muted-foreground leading-relaxed mb-6 italic"
        >
          {report.lead}
        </motion.p>
      )}

      {/* Sections */}
      {report.sections.map((section, index) => renderSection(section, index))}

      {/* Study References summary */}
      {report.studyRefs.size > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-4 border-t border-border"
        >
          <div className="text-xs text-muted-foreground">
            This analysis includes {report.studyRefs.size} referenced {report.studyRefs.size === 1 ? 'study' : 'studies'}.
          </div>
        </motion.div>
      )}
    </div>
  );
};