import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import { FileText, Clock, CreditCard, CheckCircle, Inbox, Activity, Truck, Calendar } from 'lucide-react';

interface Stats {
  newRequests: number;
  underReview: number;
  awaitingPayment: number;
  paid: number;
  activeProjects: number;
  deliveriesDue: number;
  slotsUsed: number;
  slotCap: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    newRequests: 0, underReview: 0, awaitingPayment: 0, paid: 0,
    activeProjects: 0, deliveriesDue: 0, slotsUsed: 0, slotCap: 7,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [{ data: requests }, { data: projects }, { data: settings }] = await Promise.all([
        supabase.from('booking_requests').select('status, payment_status, created_at'),
        supabase.from('project_status').select('status'),
        supabase.from('studio_settings').select('monthly_slot_cap').eq('id', 1).single(),
      ]);

      if (requests) {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const cap = settings?.monthly_slot_cap || 7;
        
        setStats({
          newRequests: requests.filter(r => r.status === 'new').length,
          underReview: requests.filter(r => r.status === 'under_review').length,
          awaitingPayment: requests.filter(r => r.status === 'awaiting_payment').length,
          paid: requests.filter(r => r.payment_status === 'deposit_paid' || r.payment_status === 'fully_paid').length,
          activeProjects: projects?.filter(p => !['delivered', 'completed'].includes(p.status)).length || 0,
          deliveriesDue: projects?.filter(p => p.status === 'ready_for_delivery').length || 0,
          slotsUsed: requests.filter(r => 
            ['confirmed', 'paid'].includes(r.status) && 
            new Date(r.created_at) >= monthStart
          ).length,
          slotCap: cap,
        });
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-semibold">Dashboard</h1>
        <p className="text-muted-foreground font-sans text-sm mt-1">Översikt av din studio</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Nya förfrågningar" value={stats.newRequests} icon={Inbox} accent />
        <StatsCard title="Under granskning" value={stats.underReview} icon={Clock} />
        <StatsCard title="Inväntar betalning" value={stats.awaitingPayment} icon={CreditCard} />
        <StatsCard title="Betalda" value={stats.paid} icon={CheckCircle} />
        <StatsCard title="Aktiva projekt" value={stats.activeProjects} icon={Activity} />
        <StatsCard title="Leverans redo" value={stats.deliveriesDue} icon={Truck} />
        <StatsCard title="Sessioner denna månad" value={`${stats.slotsUsed} / ${stats.slotCap}`} icon={Calendar} accent />
        <StatsCard title="Platser kvar" value={stats.slotCap - stats.slotsUsed} icon={FileText} />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
