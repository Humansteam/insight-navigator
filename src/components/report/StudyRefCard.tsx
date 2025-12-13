import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudyRef } from '@/lib/reportParser';

interface StudyRefCardProps {
  studyRef: StudyRef;
}

export const StudyRefCard = ({ studyRef }: StudyRefCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const truncatedFinding = studyRef.finding.length > 120
    ? studyRef.finding.slice(0, 120) + '...'
    : studyRef.finding;

  const fullFinding = studyRef.finding.length > 280
    ? studyRef.finding.slice(0, 280) + '...'
    : studyRef.finding;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="my-4 border border-border rounded-lg overflow-visible bg-card/50"
    >
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left py-2 px-3 w-10 text-xs font-medium text-muted-foreground">#</th>
            <th className="text-left py-2 px-3 w-[40%] text-xs font-medium text-muted-foreground">Study (Paper)</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Key Findings / Focus</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-muted/20 transition-colors">
            <td className="py-3 px-3 align-top">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                {studyRef.id}
              </div>
            </td>
            <td className="py-3 px-3 align-top">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground leading-snug">
                  {studyRef.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {studyRef.year} • {studyRef.authors}
                </span>
              </div>
            </td>
            <td
              className="py-3 px-3 align-top relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span className="text-sm text-muted-foreground leading-relaxed line-clamp-2 cursor-help">
                {truncatedFinding || '—'}
              </span>

              {/* Popup on hover */}
              <AnimatePresence>
                {isHovered && studyRef.finding && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="absolute left-0 bottom-full mb-2 z-[100] w-80 p-3 rounded-lg border border-border bg-background shadow-xl"
                    style={{
                      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    }}
                  >
                    <p className="text-sm text-foreground leading-relaxed">
                      {fullFinding}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
};