import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Upload, Link as LinkIcon, CheckCircle, FileText,
  AlertCircle, Loader2, CheckSquare
} from 'lucide-react';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const CHECKLIST = [
  'Name all files clearly (e.g. vocals_main.wav)',
  'Remove unused or duplicate files',
  'Include a reference track if possible',
  'Note the BPM and key',
  'Avoid clipping — leave headroom',
  'Compress everything into a single ZIP file',
];

const FileUpload = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [projectStatus, setProjectStatus] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [externalLink, setExternalLink] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!bookingId) return;
      const { data: br } = await supabase
        .from('booking_requests')
        .select('id, customers(name, email), status')
        .eq('id', bookingId)
        .single();

      if (!br) {
        setError('Booking not found.');
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
    fetchData();
  }, [bookingId]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileSizeError(true);
      setFile(null);
      return;
    }
    setFileSizeError(false);
    setFile(selectedFile);
    setExternalLink('');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  }, [handleFileSelect]);

  const handleSubmit = async () => {
    if (!file && !externalLink) {
      setError('Please upload a file or provide an external link.');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(10);

    try {
      let fileUrl = externalLink;
      const method = file ? 'direct' : 'external';

      if (file) {
        setUploadProgress(20);
        const filePath = `${bookingId}/${file.name}`;
        const { error: uploadErr } = await supabase.storage
          .from('project-files')
          .upload(filePath, file, { upsert: true });
        if (uploadErr) throw uploadErr;
        fileUrl = filePath;
        setUploadProgress(70);
      }

      const now = new Date().toISOString();

      if (projectStatus) {
        await supabase
          .from('project_status')
          .update({
            file_status: 'received' as const,
            file_link: fileUrl,
            file_notes: notes || null,
            file_received_at: now,
            file_method: method,
            updated_at: now,
          })
          .eq('id', projectStatus.id);
      } else {
        await supabase.from('project_status').insert({
          booking_request_id: bookingId!,
          file_status: 'received' as const,
          file_link: fileUrl,
          file_notes: notes || null,
          file_received_at: now,
          file_method: method,
        });
      }

      setUploadProgress(90);

      try {
        await supabase.functions.invoke('send-studio-email', {
          body: {
            type: 'files_received',
            bookingId,
            customerName: (booking?.customers as any)?.name || 'Customer',
          },
        });
      } catch (e) {
        console.error('Email notification failed:', e);
      }

      setUploadProgress(100);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
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
          <h1 className="text-2xl font-serif font-semibold mb-3">Files received!</h1>
          <p className="text-muted-foreground font-sans">
            Thank you! Your files have been sent to the studio. We'll review the material and get back to you.
          </p>
        </div>
      </div>
    );
  }

  const customerName = (booking?.customers as any)?.name;

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-primary font-serif text-lg font-semibold tracking-wider mb-2">TOPLINER</h1>
          <div className="w-12 h-[1px] bg-primary mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-semibold mb-2">Upload your project files</h2>
          <p className="text-muted-foreground font-sans text-sm">
            {customerName ? `Hi ${customerName}! ` : ''}
            For the best workflow, place all stems/files in one folder and compress it as a ZIP file before uploading.
          </p>
        </div>

        {/* Checklist */}
        <div className="bg-card border border-border rounded p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare size={18} className="text-primary" />
            <h3 className="font-serif font-semibold">Prepare your files</h3>
          </div>
          <ul className="space-y-2 text-sm font-sans text-muted-foreground">
            {CHECKLIST.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upload form */}
        <div className="bg-card border border-border rounded p-6 space-y-6">
          {/* Drag & drop zone */}
          <div className="space-y-2">
            <Label className="font-sans text-sm font-semibold">Upload ZIP file</Label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
                ${dragOver ? 'border-primary bg-primary/5' : file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30'}`}
            >
              <input
                type="file"
                accept=".zip,.rar,.7z"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload size={28} className="mx-auto mb-3 text-muted-foreground" />
              {file ? (
                <div>
                  <p className="text-sm font-sans font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-sans text-muted-foreground">
                    Drag & drop your ZIP file here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 50 MB · ZIP, RAR, 7Z
                  </p>
                </div>
              )}
            </div>
            {fileSizeError && (
              <p className="text-sm text-destructive font-sans flex items-center gap-1">
                <AlertCircle size={14} />
                File is too large (max 50 MB). Please use an external link instead.
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-border" />
            <span className="text-xs text-muted-foreground font-sans">OR</span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>

          {/* External link */}
          <div className="space-y-2">
            <Label className="font-sans text-sm flex items-center gap-2">
              <LinkIcon size={14} />
              External link (WeTransfer, Google Drive, Dropbox)
            </Label>
            <Input
              value={externalLink}
              onChange={(e) => { setExternalLink(e.target.value); if (e.target.value) setFile(null); }}
              placeholder="https://..."
              type="url"
            />
            <p className="text-xs text-muted-foreground font-sans">
              For projects larger than 50 MB, use an external file sharing service.
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="font-sans text-sm">Project notes (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="BPM, key, special requests..."
              rows={3}
            />
          </div>

          {/* Upload progress */}
          {uploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground font-sans text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {error && <p className="text-sm text-destructive font-sans">{error}</p>}

          <Button onClick={handleSubmit} disabled={uploading} className="w-full gold-glow">
            {uploading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              'Send files'
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground font-sans mt-6">
          Large project? Use an external link instead of direct upload.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
