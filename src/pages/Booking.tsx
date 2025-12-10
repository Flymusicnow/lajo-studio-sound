import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const Booking = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    package: '',
    songs: '',
    tracks: '',
    delivery: '',
    recordingDate: '',
    name: '',
    artistName: '',
    email: '',
    phone: '',
    location: '',
    musicLink: '',
    description: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send to backend
    console.log('Booking submitted:', formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="pt-32 pb-24 min-h-screen flex items-center">
          <div className="container px-6">
            <div className="max-w-md mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 text-primary">
                <CheckCircle size={48} strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-serif font-semibold mb-4">
                {t('booking.success.title')}
              </h1>
              <p className="text-muted-foreground font-sans mb-8">
                {t('booking.success.text')}
              </p>
              <Button 
                asChild
                variant="outline"
                className="border-border hover:bg-secondary"
              >
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('booking.success.back')}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-24">
        <div className="container px-6">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
              {t('booking.title')}
            </h1>
            <p className="text-muted-foreground font-sans">
              {t('booking.intro')}
            </p>
            <div className="w-16 h-[1px] bg-primary mx-auto mt-8" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="bg-card border border-border p-8 space-y-6">
              {/* Service Selection Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-sans text-muted-foreground mb-2">
                    {t('pricing.service')} *
                  </label>
                  <Select 
                    value={formData.service} 
                    onValueChange={(v) => handleInputChange('service', v)}
                    required
                  >
                    <SelectTrigger className="w-full bg-input border-border">
                      <SelectValue placeholder="..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="recording">{t('pricing.service.recording')}</SelectItem>
                      <SelectItem value="mixing">{t('pricing.service.mixing')}</SelectItem>
                      <SelectItem value="mastering">{t('pricing.service.mastering')}</SelectItem>
                      <SelectItem value="production">{t('pricing.service.production')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-sans text-muted-foreground mb-2">
                    {t('pricing.package')} *
                  </label>
                  <Select 
                    value={formData.package} 
                    onValueChange={(v) => handleInputChange('package', v)}
                    required
                  >
                    <SelectTrigger className="w-full bg-input border-border">
                      <SelectValue placeholder="..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="basic">{t('pricing.package.basic')}</SelectItem>
                      <SelectItem value="premium">{t('pricing.package.premium')}</SelectItem>
                      <SelectItem value="highend">{t('pricing.package.highend')}</SelectItem>
                      <SelectItem value="recommend">{t('pricing.package.recommend')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Songs and Tracks */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-sans text-muted-foreground mb-2">
                    {t('booking.songs')}
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.songs}
                    onChange={(e) => handleInputChange('songs', e.target.value)}
                    className="bg-input border-border"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans text-muted-foreground mb-2">
                    {t('pricing.tracks')}
                  </label>
                  <Select 
                    value={formData.tracks} 
                    onValueChange={(v) => handleInputChange('tracks', v)}
                  >
                    <SelectTrigger className="w-full bg-input border-border">
                      <SelectValue placeholder="..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="0-30">{t('pricing.tracks.0-30')}</SelectItem>
                      <SelectItem value="31-60">{t('pricing.tracks.31-60')}</SelectItem>
                      <SelectItem value="61-100">{t('pricing.tracks.61-100')}</SelectItem>
                      <SelectItem value="100+">{t('pricing.tracks.100+')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Delivery and Recording Date */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-sans text-muted-foreground mb-2">
                    {t('pricing.delivery')}
                  </label>
                  <Select 
                    value={formData.delivery} 
                    onValueChange={(v) => handleInputChange('delivery', v)}
                  >
                    <SelectTrigger className="w-full bg-input border-border">
                      <SelectValue placeholder="..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="standard">{t('pricing.delivery.standard')}</SelectItem>
                      <SelectItem value="priority">{t('pricing.delivery.priority')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-sans text-muted-foreground mb-2">
                    {t('booking.date')}
                  </label>
                  <Input
                    type="date"
                    value={formData.recordingDate}
                    onChange={(e) => handleInputChange('recordingDate', e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border my-2" />

              {/* Personal Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-sans text-muted-foreground mb-2">
                    {t('booking.name')} *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-input border-border"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans text-muted-foreground mb-2">
                    {t('booking.artist')}
                  </label>
                  <Input
                    type="text"
                    value={formData.artistName}
                    onChange={(e) => handleInputChange('artistName', e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-sans text-muted-foreground mb-2">
                    {t('booking.email')} *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-input border-border"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans text-muted-foreground mb-2">
                    {t('booking.phone')}
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2">
                  {t('booking.location')}
                </label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="bg-input border-border"
                  placeholder="Stockholm, Sweden"
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2">
                  {t('booking.link')}
                </label>
                <Input
                  type="url"
                  value={formData.musicLink}
                  onChange={(e) => handleInputChange('musicLink', e.target.value)}
                  className="bg-input border-border"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-sans text-muted-foreground mb-2">
                  {t('booking.description')}
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-input border-border min-h-[120px]"
                  placeholder="..."
                />
              </div>

              {/* Submit */}
              <Button 
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gold-glow py-6 font-sans tracking-wide"
              >
                {t('booking.submit')}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
