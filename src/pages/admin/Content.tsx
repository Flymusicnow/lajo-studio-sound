import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Eye, EyeOff, GripVertical, Music, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  title: string;
  media_type: string;
  embed_url: string;
  description: string | null;
  display_order: number;
  is_visible: boolean;
}

interface Testimonial {
  id: string;
  customer_name: string;
  customer_role: string | null;
  quote: string;
  is_approved: boolean;
  display_order: number;
}

const Content = () => {
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [tab, setTab] = useState<'media' | 'testimonials'>('media');

  // New media form
  const [newMedia, setNewMedia] = useState({ title: '', media_type: 'audio', embed_url: '', description: '' });
  const [newTestimonial, setNewTestimonial] = useState({ customer_name: '', customer_role: '', quote: '' });

  const fetchData = async () => {
    const [{ data: m }, { data: t }] = await Promise.all([
      supabase.from('site_media').select('*').order('display_order'),
      supabase.from('testimonials').select('*').order('display_order'),
    ]);
    if (m) setMedia(m as MediaItem[]);
    if (t) setTestimonials(t as Testimonial[]);
  };

  useEffect(() => { fetchData(); }, []);

  const addMedia = async () => {
    if (!newMedia.title || !newMedia.embed_url) return;
    await supabase.from('site_media').insert({
      title: newMedia.title,
      media_type: newMedia.media_type,
      embed_url: newMedia.embed_url,
      description: newMedia.description || null,
      display_order: media.length,
    });
    setNewMedia({ title: '', media_type: 'audio', embed_url: '', description: '' });
    toast({ title: 'Media tillagd' });
    fetchData();
  };

  const toggleMediaVisibility = async (id: string, visible: boolean) => {
    await supabase.from('site_media').update({ is_visible: !visible, updated_at: new Date().toISOString() }).eq('id', id);
    fetchData();
  };

  const deleteMedia = async (id: string) => {
    await supabase.from('site_media').delete().eq('id', id);
    fetchData();
  };

  const addTestimonial = async () => {
    if (!newTestimonial.customer_name || !newTestimonial.quote) return;
    await supabase.from('testimonials').insert({
      customer_name: newTestimonial.customer_name,
      customer_role: newTestimonial.customer_role || null,
      quote: newTestimonial.quote,
      display_order: testimonials.length,
    });
    setNewTestimonial({ customer_name: '', customer_role: '', quote: '' });
    toast({ title: 'Testimonial tillagd (ej godkänd)' });
    fetchData();
  };

  const toggleApproval = async (id: string, approved: boolean) => {
    await supabase.from('testimonials').update({ is_approved: !approved, updated_at: new Date().toISOString() }).eq('id', id);
    fetchData();
  };

  const deleteTestimonial = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id);
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-semibold">Innehåll</h1>
        <p className="text-muted-foreground font-sans text-sm mt-1">Hantera media och testimonials på startsidan</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        <Button variant={tab === 'media' ? 'default' : 'outline'} size="sm" onClick={() => setTab('media')}>
          <Music className="mr-2 h-4 w-4" /> Ljud & Video
        </Button>
        <Button variant={tab === 'testimonials' ? 'default' : 'outline'} size="sm" onClick={() => setTab('testimonials')}>
          Testimonials
        </Button>
      </div>

      {tab === 'media' && (
        <div className="space-y-6">
          {/* Add new media */}
          <div className="bg-card border border-border rounded p-6">
            <h2 className="text-lg font-serif font-semibold mb-4">Lägg till media</h2>
            <div className="space-y-3">
              <Input placeholder="Titel" value={newMedia.title} onChange={e => setNewMedia(p => ({ ...p, title: e.target.value }))} className="bg-input border-border" />
              <div className="flex gap-2">
                <Button variant={newMedia.media_type === 'audio' ? 'default' : 'outline'} size="sm" onClick={() => setNewMedia(p => ({ ...p, media_type: 'audio' }))}>
                  <Music className="mr-1 h-3 w-3" /> Ljud
                </Button>
                <Button variant={newMedia.media_type === 'video' ? 'default' : 'outline'} size="sm" onClick={() => setNewMedia(p => ({ ...p, media_type: 'video' }))}>
                  <Video className="mr-1 h-3 w-3" /> Video
                </Button>
              </div>
              <Input placeholder="Embed-URL (Spotify, YouTube, SoundCloud...)" value={newMedia.embed_url} onChange={e => setNewMedia(p => ({ ...p, embed_url: e.target.value }))} className="bg-input border-border" />
              <Input placeholder="Beskrivning (valfritt)" value={newMedia.description} onChange={e => setNewMedia(p => ({ ...p, description: e.target.value }))} className="bg-input border-border" />
              <Button onClick={addMedia} disabled={!newMedia.title || !newMedia.embed_url}>
                <Plus className="mr-2 h-4 w-4" /> Lägg till
              </Button>
            </div>
          </div>

          {/* Media list */}
          <div className="space-y-2">
            {media.map(item => (
              <div key={item.id} className={cn('bg-card border border-border rounded p-4 flex items-center gap-4', !item.is_visible && 'opacity-50')}>
                {item.media_type === 'audio' ? <Music className="h-5 w-5 text-primary shrink-0" /> : <Video className="h-5 w-5 text-primary shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.embed_url}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => toggleMediaVisibility(item.id, item.is_visible)}>
                  {item.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMedia(item.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            {media.length === 0 && <p className="text-sm text-muted-foreground font-sans text-center py-8">Ingen media ännu. Lägg till ljud eller video ovan.</p>}
          </div>
        </div>
      )}

      {tab === 'testimonials' && (
        <div className="space-y-6">
          {/* Add new testimonial */}
          <div className="bg-card border border-border rounded p-6">
            <h2 className="text-lg font-serif font-semibold mb-4">Lägg till testimonial</h2>
            <div className="space-y-3">
              <Input placeholder="Kundnamn" value={newTestimonial.customer_name} onChange={e => setNewTestimonial(p => ({ ...p, customer_name: e.target.value }))} className="bg-input border-border" />
              <Input placeholder="Roll / Artist (valfritt)" value={newTestimonial.customer_role} onChange={e => setNewTestimonial(p => ({ ...p, customer_role: e.target.value }))} className="bg-input border-border" />
              <Textarea placeholder="Citat" value={newTestimonial.quote} onChange={e => setNewTestimonial(p => ({ ...p, quote: e.target.value }))} className="bg-input border-border" />
              <Button onClick={addTestimonial} disabled={!newTestimonial.customer_name || !newTestimonial.quote}>
                <Plus className="mr-2 h-4 w-4" /> Lägg till (ej godkänd)
              </Button>
            </div>
          </div>

          {/* Testimonials list */}
          <div className="space-y-2">
            {testimonials.map(t => (
              <div key={t.id} className={cn('bg-card border border-border rounded p-4', !t.is_approved && 'border-dashed opacity-70')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-sans text-sm italic">"{t.quote}"</p>
                    <p className="text-xs text-muted-foreground mt-2 font-sans">— {t.customer_name}{t.customer_role ? `, ${t.customer_role}` : ''}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant={t.is_approved ? 'default' : 'outline'} size="sm" onClick={() => toggleApproval(t.id, t.is_approved)}>
                      {t.is_approved ? 'Godkänd ✓' : 'Godkänn'}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteTestimonial(t.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && <p className="text-sm text-muted-foreground font-sans text-center py-8">Inga testimonials ännu.</p>}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Content;
