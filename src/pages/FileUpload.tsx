import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Link as LinkIcon, CheckCircle, FileText, AlertCircle, Loader2 } from 'lucide-react';

const FileUpload = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [projectStatus, setProjectStatus] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [externalLink, setExternalLink] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!bookingId) return;
      const { data: br } = await supabase
        .from('booking_requests')
        .select('id, customers(name), status')
        .eq('id', bookingId)
        .single();

      if (!br) {
        setError('Bokning hittades inte.');
        setLoading(false);
        return;
      }
      setBooking(br);

      const { data: ps } = await supabase
        .from('project_status')
        .select('*')
        .eq('booking_request_id', bookingId)
        .single();

      if (ps) {
        setProjectStatus(ps);
        if (ps.file_status === 'received' || ps.file_status === 'reviewed') {
          setSubmitted(true);
        }
      }
      setLoading(false);
    };
    fetch();
  }, [bookingId]);

  const handleSubmit = async () => {
    if (!file && !externalLink) {
      setError('Ladda upp en fil eller ange en extern länk.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      let fileUrl = externalLink;

      if (file) {
        const filePath = `${bookingId}/${file.name}`;
        const { error: uploadErr } = await supabase.storage
          .from('project-files')
          .upload(filePath, file, { upsert: true });
        if (uploadErr) throw uploadErr;
        fileUrl = filePath;
      }

      // Update or create project_status
      if (projectStatus) {
        await supabase
          .from('project_status')
          .update({
            file_status: 'received',
            file_link: fileUrl,
            file_notes: notes || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', projectStatus.id);
      } else {
        await supabase.from('project_status').insert({
          booking_request_id: bookingId,
          file_status: 'received',
          file_link: fileUrl,
          file_notes: notes || null,
        });
      }

      // Notify studio
      try {
        await supabase.functions.invoke('send-studio-email', {
          body: {
            type: 'files_received',
            bookingId,
            customerName: (booking?.customers as any)?.name || 'Kund',
          },
        });
      } catch (e) {
        console.error('Email notification failed:', e);
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Något gick fel.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-sans">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-2xl font-serif font-semibold mb-3">Filer mottagna!</h1>
          <p className="text-muted-foreground font-sans">
            Tack! Dina filer har skickats till studion. Vi granskar materialet och återkommer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-primary font-serif text-lg font-semibold tracking-wider mb-2">TOPLINER</h1>
          <div className="w-12 h-[1px] bg-primary mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-semibold mb-2">Ladda upp dina filer</h2>
          <p className="text-muted-foreground font-sans text-sm">
            {(booking?.customers as any)?.name ? `Hej ${(booking?.customers as any)?.name}!` : ''} Skicka dina projektfiler nedan.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-card border border-border rounded p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-primary" />
            <h3 className="font-serif font-semibold">Förbered dina filer</h3>
          </div>
          <ul className="space-y-2 text-sm font-sans text-muted-foreground">
            <li>• Lägg alla spår/stems i en mapp</li>
            <li>• Namnge filerna tydligt</li>
            <li>• Komprimera som ZIP</li>
            <li>• Ta bort oanvända filer</li>
            <li>• Inkludera referensspår</li>
            <li>• Ange BPM och tonart om möjligt</li>
            <li>• Undvik clipping</li>
          </ul>
        </div>

        {/* Upload form */}
        <div className="bg-card border border-border rounded p-6 space-y-6">
          {/* File upload */}
          <div className="space-y-2">
            <Label className="font-sans text-sm">Ladda upp ZIP-fil</Label>
            <div className="relative">
              <input
                type="file"
                accept=".zip,.rar,.7z"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className={`flex items-center gap-3 border border-border rounded p-4 cursor-pointer hover:border-primary/30 transition-colors ${file ? 'border-primary/50' : ''}`}>
                <Upload size={20} className="text-muted-foreground" />
                <span className="text-sm font-sans text-muted-foreground">
                  {file ? file.name : 'Klicka för att välja fil (ZIP, RAR, 7Z)'}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-border" />
            <span className="text-xs text-muted-foreground font-sans">ELLER</span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>

          {/* External link */}
          <div className="space-y-2">
            <Label className="font-sans text-sm flex items-center gap-2">
              <LinkIcon size={14} />
              Extern länk (WeTransfer, Google Drive, Dropbox)
            </Label>
            <Input
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="font-sans text-sm">Projektanteckningar (valfritt)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="BPM, tonart, speciella önskemål..."
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-destructive font-sans">{error}</p>}

          <Button onClick={handleSubmit} disabled={uploading} className="w-full gold-glow">
            {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Laddar upp...</> : 'Skicka filer'}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground font-sans mt-6">
          För stora projekt? Använd extern länk istället.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
