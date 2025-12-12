import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Users, Calendar, Quote, ExternalLink, MessageSquare, X, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataNode } from '@/types/morphik';
import { cn } from '@/lib/utils';

interface PaperDetailsProps {
  node: DataNode | null;
  onClose: () => void;
}

const countryLabels: Record<string, string> = {
  china: 'Китай',
  usa: 'США',
  europe: 'Европа',
  other: 'Другие',
};

export const PaperDetails = ({ node, onClose }: PaperDetailsProps) => {
  if (!node) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="card-elevated rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-3 border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Детали статьи</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
        {/* Title */}
        <div>
          <h3 className="font-semibold text-foreground leading-tight mb-2 text-sm">{node.title}</h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {node.year}
            </div>
            <div className="flex items-center gap-1">
              <Quote className="w-3 h-3" />
              {node.citations} цитирований
            </div>
            <div className={cn(
              "px-1.5 py-0.5 rounded text-xs font-medium",
              node.country === 'china' && "bg-data-china/20 text-data-china",
              node.country === 'usa' && "bg-data-usa/20 text-data-usa",
              node.country === 'europe' && "bg-data-europe/20 text-data-europe",
              node.country === 'other' && "bg-data-other/20 text-data-other",
            )}>
              {countryLabels[node.country]}
            </div>
          </div>
        </div>

        {/* Authors */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Авторы</span>
          </div>
          <p className="text-sm text-foreground">{node.authors.join(', ')}</p>
        </div>

        {/* Abstract */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <FileText className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Аннотация</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{node.abstract}</p>
        </div>

        {/* Extracted Data */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Layers className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Извлечённые данные</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(node.dimensions).slice(0, 4).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-1 px-2 bg-muted/30 rounded text-xs">
                <span className="text-muted-foreground">{key}</span>
                <span className="font-mono text-foreground">{val.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-card-border flex gap-2">
        <Button variant="glow" className="flex-1" size="sm">
          <MessageSquare className="w-3 h-3 mr-1" />
          Обсудить
        </Button>
        <Button variant="outline" size="sm">
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    </motion.div>
  );
};
