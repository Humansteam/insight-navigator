import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings2, Edit2, Check, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SchemaArtifact, Dimension } from './types';

interface SchemaCardProps {
  data: SchemaArtifact;
  onEdit?: (dimensions: Dimension[]) => void;
}

function DimensionChip({ 
  dimension, 
  isEditing, 
  onRemove 
}: { 
  dimension: Dimension; 
  isEditing: boolean;
  onRemove?: () => void;
}) {
  const typeColors: Record<string, string> = {
    text: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    number: 'bg-green-500/20 text-green-400 border-green-500/30',
    enum: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    boolean: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  return (
    <div className={cn(
      "group relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all",
      typeColors[dimension.dataType] || 'bg-muted border-border',
      isEditing && "pr-7"
    )}>
      <span className="text-xs font-medium">{dimension.name}</span>
      <Badge variant="outline" className="text-[9px] h-4 px-1 bg-background/50">
        {dimension.dataType}
      </Badge>
      
      {isEditing && (
        <button 
          onClick={onRemove}
          className="absolute right-1.5 p-0.5 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      
      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block z-10">
        <div className="bg-popover border border-border rounded-md p-2 shadow-lg max-w-xs">
          <p className="text-xs text-foreground font-medium">{dimension.name}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{dimension.description}</p>
          {dimension.examples && dimension.examples.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {dimension.examples.map((ex, i) => (
                <Badge key={i} variant="secondary" className="text-[9px]">
                  {ex}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SchemaCard({ data, onEdit }: SchemaCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [dimensions, setDimensions] = useState(data.dimensions);

  const handleRemove = (id: string) => {
    setDimensions(prev => prev.filter(d => d.id !== id));
  };

  const handleSave = () => {
    onEdit?.(dimensions);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDimensions(data.dimensions);
    setIsEditing(false);
  };

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm">{data.title || 'Analysis Schema'}</CardTitle>
          <Badge variant="outline" className="text-[10px]">
            {data.queryType}
          </Badge>
        </div>
        
        {data.isEditable && (
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <Button size="sm" variant="ghost" className="h-6 px-2" onClick={handleCancel}>
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" className="h-6 px-2" onClick={handleSave}>
                  <Check className="w-3 h-3 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-3 pt-0 space-y-3">
        {/* Rationale */}
        <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-md">
          <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {data.rationale}
          </p>
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">
            Extraction Dimensions ({dimensions.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {dimensions.map(dim => (
              <DimensionChip 
                key={dim.id} 
                dimension={dim} 
                isEditing={isEditing}
                onRemove={() => handleRemove(dim.id)}
              />
            ))}
          </div>
        </div>

        {/* Add dimension button when editing */}
        {isEditing && (
          <Button variant="outline" size="sm" className="w-full h-8 border-dashed">
            + Add Dimension
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
