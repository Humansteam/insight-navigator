import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DataNode } from '@/types/morphik';

interface InlinePaperCardProps {
  paper: DataNode;
  index: number;
}

const getMethodologyBadge = (paper: DataNode) => {
  const methodology = paper.dimensions?.['Methodology']?.value || '';
  if (methodology.toLowerCase().includes('machine learning') || methodology.toLowerCase().includes('ai')) {
    return 'Analysis';
  }
  if (methodology.toLowerCase().includes('tem') || methodology.toLowerCase().includes('observation')) {
    return 'Experimental';
  }
  if (methodology.toLowerCase().includes('hydrometallurgical') || methodology.toLowerCase().includes('process')) {
    return 'Process';
  }
  if (methodology.toLowerCase().includes('membrane') || methodology.toLowerCase().includes('system')) {
    return 'System';
  }
  return 'Review';
};

export const InlinePaperCard = ({ paper, index }: InlinePaperCardProps) => {
  const relevancePercent = Math.round(paper.score * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="my-4 border border-border rounded-lg overflow-hidden bg-card/50"
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left py-2 px-3 w-8 text-xs font-medium text-muted-foreground">#</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Study (Paper)</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground w-28">Methodology / Type</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Key Findings / Focus</th>
            <th className="text-right py-2 px-3 w-20 text-xs font-medium text-muted-foreground">Relevance</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-muted/20 transition-colors">
            <td className="py-3 px-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                {index}
              </div>
            </td>
            <td className="py-3 px-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground line-clamp-1">
                  {paper.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {paper.year} • {paper.authors?.slice(0, 2).join(', ')}
                </span>
              </div>
            </td>
            <td className="py-3 px-3">
              <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                {getMethodologyBadge(paper)}
              </span>
            </td>
            <td className="py-3 px-3">
              <span className="text-sm text-muted-foreground line-clamp-1">
                {paper.dimensions?.['Key Findings']?.value || '—'}
              </span>
            </td>
            <td className="py-3 px-3 text-right">
              <div className="flex flex-col items-end gap-1">
                <span className={cn(
                  "text-sm font-semibold",
                  relevancePercent >= 90 ? "text-green-500" :
                  relevancePercent >= 80 ? "text-yellow-500" :
                  "text-muted-foreground"
                )}>
                  {relevancePercent}%
                </span>
                <div className="w-10 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      relevancePercent >= 90 ? "bg-green-500" :
                      relevancePercent >= 80 ? "bg-yellow-500" :
                      "bg-muted-foreground"
                    )}
                    style={{ width: `${relevancePercent}%` }}
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
};
