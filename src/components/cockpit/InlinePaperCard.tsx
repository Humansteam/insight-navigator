import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataNode } from '@/types/morphik';
import { cn } from '@/lib/utils';

interface InlinePaperCardProps {
  paper: DataNode;
  index: number;
}

export const InlinePaperCard = ({ paper, index }: InlinePaperCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const keyFindings = paper.dimensions?.['Key Findings']?.value || paper.abstract || '—';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="my-4 border border-border rounded-lg overflow-hidden bg-card/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            <td className="py-3 px-3 align-top">
              <span className={cn(
                "text-sm text-muted-foreground leading-relaxed transition-all duration-200",
                isHovered ? "" : "line-clamp-2"
              )}>
                {keyFindings}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      
      {/* Expanded details on hover */}
      <AnimatePresence>
        {isHovered && paper.abstract && paper.abstract !== keyFindings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-muted/20 px-4 py-3"
          >
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Abstract:</span> {paper.abstract}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
