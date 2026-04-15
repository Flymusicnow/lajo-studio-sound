import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { cn } from '@/lib/utils';
import { Clock, GripVertical } from 'lucide-react';

interface ProjectCard {
  id: string;
  projectStatusId: string;
  customerName: string;
  sessionType: string;
  workMode: string;
  deadline: string | null;
  estimatedHours: number;
  status: string;
}

const COLUMNS = [
  { key: 'awaiting_files', label: 'Inväntar filer' },
  { key: 'files_received', label: 'Filer mottagna' },
  { key: 'prep', label: 'Förberedelse' },
  { key: 'mixing', label: 'Mixing' },
  { key: 'mastering', label: 'Mastering' },
  { key: 'ready_for_delivery', label: 'Leverans redo' },
  { key: 'delivered', label: 'Levererad' },
];

const Workload = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('project_status')
      .select('id, status, booking_request_id, booking_requests(id, session_type, work_mode, deadline, estimated_workload_hours, customer_id, customers(name))');

    if (data) {
      const cards: ProjectCard[] = data.map(p => {
        const br = p.booking_requests as any;
        return {
          id: p.booking_request_id,
          projectStatusId: p.id,
          customerName: br?.customers?.name || 'Okänd',
          sessionType: br?.session_type || '',
          workMode: br?.work_mode || 'studio',
          deadline: br?.deadline || null,
          estimatedHours: br?.estimated_workload_hours || 0,
          status: p.status,
        };
      });
      setProjects(cards);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDrop = async (targetStatus: string) => {
    if (!draggedId) return;
    const card = projects.find(p => p.projectStatusId === draggedId);
    if (!card || card.status === targetStatus) { setDraggedId(null); return; }

    // Optimistic update
    setProjects(prev => prev.map(p => p.projectStatusId === draggedId ? { ...p, status: targetStatus } : p));
    setDraggedId(null);

    await supabase
      .from('project_status')
      .update({ status: targetStatus as any, updated_at: new Date().toISOString() })
      .eq('id', card.projectStatusId);
  };

  const totalHours = projects
    .filter(p => !['delivered', 'completed'].includes(p.status))
    .reduce((sum, p) => sum + p.estimatedHours, 0);

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold">Workload</h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">Hantera projektflödet</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded">
          <Clock size={16} className="text-primary" />
          <span className="text-sm font-sans font-medium">{totalHours}h totalt</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {COLUMNS.map(col => {
            const colProjects = projects.filter(p => p.status === col.key);
            return (
              <div
                key={col.key}
                className="w-64 flex-shrink-0"
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(col.key)}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-sans font-medium text-muted-foreground">{col.label}</h3>
                  <span className="text-xs font-sans text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
                    {colProjects.length}
                  </span>
                </div>

                <div className="space-y-2 min-h-[100px] bg-muted/10 rounded p-2">
                  {colProjects.map(card => {
                    const deadlineDays = card.deadline
                      ? Math.ceil((new Date(card.deadline).getTime() - Date.now()) / 86400000)
                      : null;

                    return (
                      <div
                        key={card.projectStatusId}
                        draggable
                        onDragStart={() => setDraggedId(card.projectStatusId)}
                        onClick={() => navigate(`/admin/requests/${card.id}`)}
                        className={cn(
                          'bg-card border border-border rounded p-3 cursor-pointer hover:border-primary/30 transition-colors',
                          draggedId === card.projectStatusId && 'opacity-50'
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-sans font-medium">{card.customerName}</p>
                          <GripVertical size={14} className="text-muted-foreground flex-shrink-0 cursor-grab" />
                        </div>
                        <p className="text-xs text-muted-foreground font-sans mb-2">
                          {card.workMode === 'remote' ? '🏠 ' : ''}{card.sessionType}
                        </p>
                        <div className="flex items-center justify-between">
                          {card.estimatedHours > 0 && (
                            <span className="text-xs text-muted-foreground font-sans">{card.estimatedHours}h</span>
                          )}
                          {deadlineDays !== null && (
                            <span className={cn(
                              'text-xs font-sans font-medium',
                              deadlineDays > 3 ? 'text-emerald-400' : deadlineDays > 0 ? 'text-amber-400' : 'text-red-400'
                            )}>
                              {deadlineDays > 0 ? `${deadlineDays}d kvar` : deadlineDays === 0 ? 'Idag' : `${Math.abs(deadlineDays)}d sen`}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Workload;
