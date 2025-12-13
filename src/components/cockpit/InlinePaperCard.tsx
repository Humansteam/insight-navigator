import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataNode } from '@/types/morphik';

interface InlinePaperCardProps {
  paper: DataNode;
  index: number;
}

export const InlinePaperCard = ({ paper, index }: InlinePaperCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const keyFindings = paper.dimensions?.['Key Findings']?.value || paper.abstract || '—';
  const fullText = paper.abstract || keyFindings;
  const truncatedPopup = fullText.length > 280 ? fullText.slice(0, 280) + '...' : fullText;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="my-4 border border-border rounded-lg overflow-hidden bg-card/50 relative"
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
                {index}
              </div>
            </td>
            <td className="py-3 px-3 align-top">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground leading-snug">
                  {paper.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {paper.year} • {paper.authors?.slice(0, 2).join(', ')}
                </span>
              </div>
            </td>
            <td 
              className="py-3 px-3 align-top relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="text-sm text-muted-foreground leading-relaxed line-clamp-2 cursor-help">
                {keyFindings}
              </span>
              
              {/* Popup on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1 z-50 w-80 p-3 rounded-lg border border-border bg-popover shadow-lg"
                  >
                    <p className="text-sm text-popover-foreground leading-relaxed">
                      {truncatedPopup}
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
