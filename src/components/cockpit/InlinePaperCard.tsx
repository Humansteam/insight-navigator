import { motion } from 'framer-motion';
import { DataNode } from '@/types/morphik';

interface InlinePaperCardProps {
  paper: DataNode;
  index: number;
}

export const InlinePaperCard = ({ paper, index }: InlinePaperCardProps) => {
  const keyFindings = paper.dimensions?.['Key Findings']?.value || paper.abstract || '—';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="my-4 border border-border rounded-lg overflow-hidden bg-card/50"
    >
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left py-2 px-3 w-12 text-xs font-medium text-muted-foreground">#</th>
            <th className="text-left py-2 px-3 w-[45%] text-xs font-medium text-muted-foreground">Study (Paper)</th>
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
              <span className="text-sm text-primary/80 leading-relaxed">
                {keyFindings}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
};
