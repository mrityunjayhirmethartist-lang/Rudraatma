import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Release, ReleaseTrack } from '../../types';
import {
  inspectAudioFile,
  inspectImageFile,
  formatFileSize,
  formatDuration,
  AudioInspectionResult,
  ArtworkInspectionResult
} from '../../utils/audioInspector';
import {
  Disc3,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileAudio,
  Image as ImageIcon,
  ShieldCheck,
  Calendar,
  Layers,
  Smartphone,
  Trash2,
  RefreshCw,
  Play,
  Pause,
  Eye,
  Check,
  AlertCircle,
  ExternalLink,
  Save,
  Music,
  Sliders,
  Sparkles
} from 'lucide-react';

export const ReleasesPage: React.FC = () => {
  const { path, navigate } = useRouter();
  const { token, user } = useAuth();

  const isNewRoute = path === '/dashboard/releases/new';
  const detailMatch = path.match(/^\/dashboard\/releases\/([^/]+)$/);
  const selectedReleaseId = detailMatch && detailMatch[1] !== 'new' ? detailMatch[1] : null;

  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Form State
  const [step, setStep] = useState(1);
  const [releaseType, setReleaseType] = useState<'Single' | 'EP' | 'Album'>('Single');

  // Audio Upload & Inspection State
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [audioFileUrl, setAudioFileUrl] = useState<string>('');
  const [audioAnalysis, setAudioAnalysis] = useState<AudioInspectionResult | null>(null);
  const [audioUploading, setAudioUploading] = useState(false);
  const [audioUploadProgress, setAudioUploadProgress] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Artwork Upload & Inspection State
  const artworkFileInputRef = useRef<HTMLInputElement>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkUrl, setArtworkUrl] = useState<string>('');
  const [artworkAnalysis, setArtworkAnalysis] = useState<ArtworkInspectionResult | null>(null);
  const [artworkUploading, setArtworkUploading] = useState(false);
  const [artworkUploadProgress, setArtworkUploadProgress] = useState(0);
  const [artworkError, setArtworkError] = useState<string | null>(null);

  // Metadata
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');
  const [primaryArtist, setPrimaryArtist] = useState(user?.fullName || '');
  const [featuredArtists, setFeaturedArtists] = useState('');
  const [language, setLanguage] = useState('Hindi');
  const [primaryGenre, setPrimaryGenre] = useState('Pop');
  const [secondaryGenre, setSecondaryGenre] = useState('Folk / Devotional');
  const [releaseDate, setReleaseDate] = useState(() => {
    const d = new Date(Date.now() + 14 * 86400000);
    return d.toISOString().split('T')[0];
  });
  const [isExplicit, setIsExplicit] = useState(false);
  const [composer, setComposer] = useState('');
  const [lyricist, setLyricist] = useState('');
  const [producer, setProducer] = useState('');

  // Rights & Label
  const [labelName, setLabelName] = useState('Independent / Self-Released');
  const [copyrightOwner, setCopyrightOwner] = useState(user?.fullName || '');
  const [copyrightYear, setCopyrightYear] = useState(new Date().getFullYear());
  const [recordingOwner, setRecordingOwner] = useState(user?.fullName || '');
  const [territories, setTerritories] = useState('Worldwide');
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Submission / Draft states
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ id: string; status: string } | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Audio preview player state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/dashboard/data', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setReleases(data.releases || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, [token]);

  const activeRelease = selectedReleaseId ? releases.find(r => r.id === selectedReleaseId) : null;

  const filteredReleases = releases.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.artist.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Real Audio File Selection from Phone/Device
  const handleAudioSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioError(null);

    // Validate extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'mp3' && ext !== 'wav') {
      setAudioError('Unsupported format. Please select only an uncompressed .wav or high-bitrate .mp3 audio file from your device.');
      return;
    }

    if (file.size > 150 * 1024 * 1024) {
      setAudioError(`File size (${formatFileSize(file.size)}) exceeds the maximum allowed upload limit of 150 MB.`);
      return;
    }

    setAudioFile(file);
    setAudioFileName(file.name);
    setAudioUploading(true);
    setAudioUploadProgress(20);

    try {
      // Step A: Inspect audio properties client-side (real sample rate, channels, bit depth, bitrate, duration)
      const analysis = await inspectAudioFile(file);
      setAudioAnalysis(analysis);
      setAudioUploadProgress(50);

      // Step B: Upload file via multipart FormData to backend
      const formData = new FormData();
      formData.append('audioFile', file);

      const res = await fetch('/api/dashboard/upload/audio', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      setAudioUploadProgress(85);
      const data = await res.json();

      if (res.ok && data.success) {
        setAudioFileUrl(data.fileUrl);
        setAudioUploadProgress(100);
      } else {
        setAudioError(data.error || 'Server rejected the audio file.');
      }
    } catch (err: any) {
      setAudioError(err.message || 'Failed to analyze and upload the audio file.');
    } finally {
      setAudioUploading(false);
    }
  };

  const handleRemoveAudio = () => {
    setAudioFile(null);
    setAudioFileName('');
    setAudioFileUrl('');
    setAudioAnalysis(null);
    setAudioError(null);
    setAudioUploadProgress(0);
    if (audioFileInputRef.current) audioFileInputRef.current.value = '';
    if (isPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle Real Cover Artwork Selection from Phone/Device
  const handleArtworkSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setArtworkError(null);

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
      setArtworkError('Unsupported image format. Please select a high-resolution JPG or PNG file.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setArtworkError(`File size (${formatFileSize(file.size)}) exceeds the maximum allowed artwork limit of 25 MB.`);
      return;
    }

    setArtworkFile(file);
    setArtworkUploading(true);
    setArtworkUploadProgress(25);

    try {
      // Step A: Inspect image dimensions and aspect ratio
      const analysis = await inspectImageFile(file);
      setArtworkAnalysis(analysis);
      setArtworkUploadProgress(60);

      // Step B: Upload to server
      const formData = new FormData();
      formData.append('artworkFile', file);

      const res = await fetch('/api/dashboard/upload/artwork', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      setArtworkUploadProgress(90);
      const data = await res.json();

      if (res.ok && data.success) {
        setArtworkUrl(data.fileUrl);
        setArtworkUploadProgress(100);
      } else {
        setArtworkError(data.error || 'Server rejected the cover artwork.');
      }
    } catch (err: any) {
      setArtworkError(err.message || 'Failed to inspect or upload cover artwork.');
    } finally {
      setArtworkUploading(false);
    }
  };

  const handleRemoveArtwork = () => {
    setArtworkFile(null);
    setArtworkUrl('');
    setArtworkAnalysis(null);
    setArtworkError(null);
    setArtworkUploadProgress(0);
    if (artworkFileInputRef.current) artworkFileInputRef.current.value = '';
  };

  const handleSaveDraft = async () => {
    if (!title && !audioFileName) {
      alert('Please enter at least a title or select an audio file to save a draft.');
      return;
    }

    setSavingDraft(true);
    try {
      const res = await fetch('/api/dashboard/releases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title || 'Untitled Project',
          version,
          artist: primaryArtist || user?.fullName || 'Artist',
          featuredArtists,
          label: labelName,
          type: releaseType,
          language,
          primaryGenre,
          secondaryGenre,
          releaseDate,
          artworkUrl: artworkUrl || '',
          copyrightOwner: copyrightOwner || primaryArtist,
          copyrightYear,
          recordingOwner: recordingOwner || primaryArtist,
          territories,
          status: 'Draft',
          rightsConfirmed: false,
          tracks: [
            {
              trackNumber: 1,
              title: title || 'Track 1',
              primaryArtist: primaryArtist || user?.fullName || 'Artist',
              composer: composer || primaryArtist,
              lyricist: lyricist || primaryArtist,
              producer,
              duration: audioAnalysis?.durationFormatted || '03:30',
              audioFileName: audioFileName,
              audioFileUrl: audioFileUrl,
              audioQuality: audioAnalysis
                ? {
                    format: audioAnalysis.format,
                    sampleRate: audioAnalysis.sampleRate,
                    bitDepth: audioAnalysis.bitDepth,
                    channels: audioAnalysis.channels,
                    duration: audioAnalysis.durationSeconds,
                    bitrate: audioAnalysis.bitrateKbps,
                    cbrVbr: audioAnalysis.encodingType,
                    isCompliant: audioAnalysis.isCompliant,
                    issues: audioAnalysis.warnings
                  }
                : undefined,
              explicit: isExplicit
            }
          ]
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionSuccess({ id: data.release.id, status: 'Draft' });
        setReleases(prev => [data.release, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingDraft(false);
    }
  };

  const handleCreateRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !primaryArtist || !rightsConfirmed || !termsAccepted) return;
    if (!audioFileUrl && !audioFileName) {
      setStep(2);
      setAudioError('Please select and upload your audio file before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/dashboard/releases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          version,
          artist: primaryArtist,
          featuredArtists,
          label: labelName,
          type: releaseType,
          language,
          primaryGenre,
          secondaryGenre,
          releaseDate,
          artworkUrl: artworkUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
          copyrightOwner,
          copyrightYear,
          recordingOwner,
          territories,
          status: 'Submitted',
          rightsConfirmed: true,
          tracks: [
            {
              trackNumber: 1,
              title,
              primaryArtist,
              featuredArtists,
              composer: composer || primaryArtist,
              lyricist: lyricist || primaryArtist,
              producer,
              duration: audioAnalysis?.durationFormatted || '03:30',
              audioFileName: audioFileName,
              audioFileUrl: audioFileUrl,
              audioQuality: audioAnalysis
                ? {
                    format: audioAnalysis.format,
                    sampleRate: audioAnalysis.sampleRate,
                    bitDepth: audioAnalysis.bitDepth,
                    channels: audioAnalysis.channels,
                    duration: audioAnalysis.durationSeconds,
                    bitrate: audioAnalysis.bitrateKbps,
                    cbrVbr: audioAnalysis.encodingType,
                    isCompliant: audioAnalysis.isCompliant,
                    issues: audioAnalysis.warnings
                  }
                : undefined,
              explicit: isExplicit
            }
          ]
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionSuccess({ id: data.release.id, status: 'Submitted' });
        setReleases(prev => [data.release, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAudioPlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  return (
    <DashboardLayout title="Releases">
      {/* Hidden Global Audio Element for Preview */}
      {audioFileUrl && (
        <audio
          ref={audioPlayerRef}
          src={audioFileUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* VIEW 1: RELEASE DETAILS VIEW */}
      {selectedReleaseId && activeRelease ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard/releases')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Releases Catalog</span>
            </button>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                activeRelease.status === 'Approved'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : activeRelease.status === 'Action Required'
                  ? 'bg-orange-950 text-orange-400 border border-orange-800'
                  : activeRelease.status === 'Draft'
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}
            >
              Status: {activeRelease.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-col items-center text-center">
              <div className="w-48 h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl mb-4 relative group">
                {activeRelease.artworkUrl ? (
                  <img src={activeRelease.artworkUrl} alt={activeRelease.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <Disc3 className="w-16 h-16" />
                  </div>
                )}
              </div>
              <h1 className="text-xl font-bold text-white font-display">{activeRelease.title}</h1>
              <p className="text-sm text-slate-400 mt-0.5">{activeRelease.artist}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] font-mono text-blue-400">
                  {activeRelease.type}
                </span>
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] font-mono text-slate-400">
                  {activeRelease.language}
                </span>
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] font-mono text-slate-400">
                  {activeRelease.primaryGenre}
                </span>
              </div>
            </div>

            <div className="md:col-span-2 p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-6">
              <div>
                <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3">Release Identifiers</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[11px]">UPC Barcode</div>
                    <div className="font-mono font-semibold text-white mt-1">{activeRelease.upc}</div>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Record Label</div>
                    <div className="font-semibold text-white mt-1 truncate">{activeRelease.label}</div>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Release Date</div>
                    <div className="font-semibold text-white mt-1">{activeRelease.releaseDate}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3">Tracklist & Audio Masters</h3>
                <div className="space-y-2">
                  {activeRelease.tracks.map((t, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-400 w-5">{t.trackNumber}.</span>
                        <div>
                          <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <span>{t.title}</span>
                            {t.explicit && (
                              <span className="px-1 py-0.2 bg-slate-800 text-[10px] text-amber-400 rounded font-mono font-bold">E</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {t.primaryArtist} · Composer: {t.composer}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-[11px] text-blue-400">{t.isrc}</div>
                        {t.audioQuality && (
                          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                            {t.audioQuality.format} · {t.audioQuality.cbrVbr || 'PCM'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isNewRoute ? (
        /* VIEW 2: FULL MULTI-STEP SUBMISSION & UPLOAD WORKFLOW */
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard/releases')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel & Back</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingDraft ? 'Saving Draft...' : 'Save as Draft'}</span>
              </button>
              <div className="text-xs font-mono text-amber-400">
                Step {step} of 7: {
                  step === 1 ? 'Release Format' :
                  step === 2 ? 'Audio File Upload' :
                  step === 3 ? 'Cover Artwork' :
                  step === 4 ? 'Song Metadata' :
                  step === 5 ? 'Label & Barcodes' :
                  step === 6 ? 'Rights & Clearances' : 'Review & Submit'
                }
              </div>
            </div>
          </div>

          <div className="p-7 sm:p-9 rounded-2xl bg-[#090e1a] border border-slate-800 shadow-xl">
            {submissionSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white font-display">
                  {submissionSuccess.status === 'Draft' ? 'Draft Saved Successfully!' : 'Release Submitted for Review!'}
                </h2>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg inline-block text-xs font-mono text-blue-400">
                  Release ID: {submissionSuccess.id}
                </div>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  {submissionSuccess.status === 'Draft'
                    ? 'Your release draft has been saved. You can resume editing and submit it at any time from your catalog.'
                    : 'Your release is now queued for internal technical quality inspection. You will receive an in-app dashboard popup notification within 48 hours.'}
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => navigate('/dashboard/releases')}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
                  >
                    View Releases Catalog
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateRelease}>
                {/* STEP 1: Choose Format */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white font-display">Step 1: Choose Release Format</h2>
                    <p className="text-xs text-slate-400">Select whether this project is a standalone single or a multi-track EP/Album.</p>

                    <div className="grid grid-cols-3 gap-3 pt-3">
                      {(['Single', 'EP', 'Album'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setReleaseType(t)}
                          className={`p-4 rounded-xl border text-center transition-all ${
                            releaseType === t
                              ? 'bg-amber-500/15 border-amber-500 text-white font-bold shadow-lg shadow-amber-500/10'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="text-sm">{t}</div>
                          <div className="text-[11px] text-slate-400 font-normal mt-1">
                            {t === 'Single' ? '1 Audio Track' : t === 'EP' ? '2 to 6 Tracks' : 'Up to 15 Tracks'}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                      >
                        Save Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
                      >
                        Continue to Audio Upload →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Mobile-Friendly Audio File Selection & Quality Detection */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg font-bold text-white font-display">Step 2: Upload Audio Master</h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Select an audio file directly from your smartphone, tablet, or computer. We support <strong>.wav</strong> and <strong>.mp3</strong> audio files up to 150 MB.
                      </p>
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                      ref={audioFileInputRef}
                      type="file"
                      accept=".mp3,.wav,audio/mpeg,audio/wav,audio/x-wav,audio/wave"
                      onChange={handleAudioSelect}
                      className="hidden"
                    />

                    {/* Primary Mobile-Friendly File Selector Card */}
                    {!audioFileName ? (
                      <div className="p-8 sm:p-10 border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-2xl text-center bg-slate-900/60 transition-all space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                          <FileAudio className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="text-base font-semibold text-white">Select Audio File for Distribution</div>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                            Browse your device storage to pick a master track. Works on iPhone, Android, tablets, and laptops.
                          </p>
                        </div>

                        {/* EXPLICIT PHONE UPLOAD BUTTON */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => audioFileInputRef.current?.click()}
                            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
                          >
                            <Smartphone className="w-4 h-4 text-slate-950 shrink-0" />
                            <span>Select Audio File from Your Phone</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                          <span>Supported: .WAV (16/24-bit)</span>
                          <span>•</span>
                          <span>.MP3 (up to 320kbps)</span>
                          <span>•</span>
                          <span>Max 150 MB</span>
                        </div>
                      </div>
                    ) : (
                      /* File Selected Card with Quality Breakdown & Options */
                      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                              <FileAudio className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">{audioFileName}</div>
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                Size: {audioFile ? formatFileSize(audioFile.size) : 'Uploaded'} · Format: {audioAnalysis?.format || 'Audio'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {audioFileUrl && (
                              <button
                                type="button"
                                onClick={toggleAudioPlay}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
                              >
                                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                <span>{isPlaying ? 'Pause' : 'Preview'}</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => audioFileInputRef.current?.click()}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                            >
                              Replace File
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveAudio}
                              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                              title="Remove File"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Upload Progress Bar if active */}
                        {audioUploading && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-slate-400">
                              <span>Analyzing audio waveform & uploading...</span>
                              <span className="font-mono text-amber-400">{audioUploadProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-blue-500 transition-all duration-300"
                                style={{ width: `${audioUploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Technical Audio Quality & Parameter Detection Report */}
                        {audioAnalysis && (
                          <div className="space-y-3 pt-1">
                            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <Sliders className="w-3.5 h-3.5 text-amber-400" />
                              <span>Audio Parameter Detection:</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                              <div className="p-3 bg-black/40 rounded-xl border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Sample Rate</span>
                                <span className="font-mono font-bold text-white text-xs mt-0.5 block">
                                  {(audioAnalysis.sampleRate / 1000).toFixed(1)} kHz
                                </span>
                              </div>
                              <div className="p-3 bg-black/40 rounded-xl border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Channels</span>
                                <span className="font-mono font-bold text-white text-xs mt-0.5 block">
                                  {audioAnalysis.channelMode} ({audioAnalysis.channels} ch)
                                </span>
                              </div>
                              <div className="p-3 bg-black/40 rounded-xl border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Bit Depth / Encoding</span>
                                <span className="font-mono font-bold text-white text-xs mt-0.5 block">
                                  {audioAnalysis.format === 'WAV'
                                    ? `${audioAnalysis.bitDepth || 24}-bit PCM`
                                    : `${audioAnalysis.bitrateKbps || 320} kbps ${audioAnalysis.encodingType}`}
                                </span>
                              </div>
                              <div className="p-3 bg-black/40 rounded-xl border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Track Duration</span>
                                <span className="font-mono font-bold text-white text-xs mt-0.5 block">
                                  {audioAnalysis.durationFormatted}
                                </span>
                              </div>
                            </div>

                            {/* Compliance Status Notice */}
                            {audioAnalysis.isCompliant ? (
                              <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                  <span>DSP Master Audio Compliant: {audioAnalysis.specsSummary}</span>
                                </div>
                                <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 bg-emerald-900/60 rounded text-emerald-200">
                                  Verified
                                </span>
                              </div>
                            ) : (
                              <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-xs text-amber-200 space-y-1">
                                <div className="flex items-center gap-2 font-semibold text-amber-300">
                                  <AlertTriangle className="w-4 h-4 shrink-0" />
                                  <span>Audio Quality Warnings:</span>
                                </div>
                                <ul className="list-disc pl-5 text-[11px] text-amber-200/90 space-y-0.5">
                                  {audioAnalysis.warnings.map((w, i) => (
                                    <li key={i}>{w}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {audioError && (
                      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{audioError}</span>
                      </div>
                    )}

                    <div className="flex justify-between pt-6">
                      <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-xs text-slate-400">Back</button>
                      <button
                        type="button"
                        disabled={!audioFileName || audioUploading}
                        onClick={() => setStep(3)}
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50"
                      >
                        Continue to Cover Art →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Mobile-Friendly Cover Artwork Selection & 3000x3000px Verification */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg font-bold text-white font-display">Step 3: Cover Artwork Verification</h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Select a square cover art directly from your phone gallery or computer. Apple Music and Spotify require an exact <strong>3000 × 3000 pixel</strong> square image (1:1 aspect ratio) in RGB color mode without social links or barcode graphics.
                      </p>
                    </div>

                    {/* Hidden Native Image File Input */}
                    <input
                      ref={artworkFileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                      onChange={handleArtworkSelect}
                      className="hidden"
                    />

                    {!artworkUrl ? (
                      <div className="p-8 sm:p-10 border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-2xl text-center bg-slate-900/60 transition-all space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                          <ImageIcon className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="text-base font-semibold text-white">Select Cover Artwork</div>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                            Browse your phone photos or file storage to pick your album cover.
                          </p>
                        </div>

                        {/* EXPLICIT PHONE ARTWORK BUTTON */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => artworkFileInputRef.current?.click()}
                            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
                          >
                            <Smartphone className="w-4 h-4 text-slate-950 shrink-0" />
                            <span>Select Cover Art from Your Phone</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                          <span>Target: 3000 × 3000 px</span>
                          <span>•</span>
                          <span>1:1 Square</span>
                          <span>•</span>
                          <span>JPG or PNG</span>
                        </div>
                      </div>
                    ) : (
                      /* Artwork Preview Card */
                      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-4">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                          <div className="w-36 h-36 rounded-xl overflow-hidden bg-black border border-slate-700 shadow-xl shrink-0 relative group">
                            <img src={artworkUrl} alt="Cover preview" className="w-full h-full object-cover" />
                            {artworkAnalysis && (
                              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-white">
                                {artworkAnalysis.width}×{artworkAnalysis.height}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-2 text-center sm:text-left">
                            <div className="text-sm font-bold text-white">Cover Artwork Selected</div>
                            <div className="text-xs text-slate-400 font-mono">
                              File: {artworkFile?.name || 'cover.jpg'} ({artworkAnalysis?.sizeFormatted || 'Ready'})
                            </div>

                            {artworkAnalysis && (
                              <div className="space-y-1.5 pt-1">
                                <div className="text-xs font-semibold text-slate-300">
                                  Dimensions: <span className="font-mono text-white">{artworkAnalysis.width} × {artworkAnalysis.height} px</span>
                                </div>

                                {artworkAnalysis.isCompliant ? (
                                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/80 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Verified 1:1 Square ({artworkAnalysis.width}×{artworkAnalysis.height} px). Compliant with global DSP distribution standards.</span>
                                  </div>
                                ) : (
                                  <div className="p-2.5 bg-amber-950/40 border border-amber-800/80 rounded-lg text-xs text-amber-200 space-y-1">
                                    <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                      <span>Artwork Warnings:</span>
                                    </div>
                                    <ul className="list-disc pl-4 text-[11px] space-y-0.5">
                                      {artworkAnalysis.warnings.map((w, idx) => (
                                        <li key={idx}>{w}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                              <button
                                type="button"
                                onClick={() => artworkFileInputRef.current?.click()}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                              >
                                Replace Artwork
                              </button>
                              <button
                                type="button"
                                onClick={handleRemoveArtwork}
                                className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                                title="Remove Artwork"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {artworkError && (
                      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{artworkError}</span>
                      </div>
                    )}

                    <div className="flex justify-between pt-6">
                      <button type="button" onClick={() => setStep(2)} className="px-4 py-2 text-xs text-slate-400">Back</button>
                      <button
                        type="button"
                        disabled={!artworkUrl || artworkUploading}
                        onClick={() => setStep(4)}
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50"
                      >
                        Continue to Metadata →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Comprehensive Metadata */}
                {step === 4 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white font-display">Step 4: Release & Track Metadata</h2>
                    <p className="text-xs text-slate-400">Enter public metadata that will be broadcast to Spotify, Apple Music, YouTube Music, and Amazon Music.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Release Title *</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          placeholder="e.g. Midnight Ragas"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Version / Subtitle</label>
                        <input
                          type="text"
                          value={version}
                          onChange={(e) => setVersion(e.target.value)}
                          placeholder="e.g. Radio Edit, Acoustic, Remix"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Primary Artist *</label>
                        <input
                          type="text"
                          value={primaryArtist}
                          onChange={(e) => setPrimaryArtist(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Featured Artists (Optional)</label>
                        <input
                          type="text"
                          value={featuredArtists}
                          onChange={(e) => setFeaturedArtists(e.target.value)}
                          placeholder="e.g. Arijit S., Zakir H."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Language *</label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                          <option>Hindi</option>
                          <option>Punjabi</option>
                          <option>English</option>
                          <option>Bengali</option>
                          <option>Tamil</option>
                          <option>Telugu</option>
                          <option>Bhojpuri</option>
                          <option>Instrumental</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Primary Genre *</label>
                        <select
                          value={primaryGenre}
                          onChange={(e) => setPrimaryGenre(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                          <option>Pop</option>
                          <option>Hip-Hop / Rap</option>
                          <option>Folk / Traditional</option>
                          <option>Devotional / Spiritual</option>
                          <option>Electronic / Dance</option>
                          <option>Classical / Raga</option>
                          <option>Indie / Alternative</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Release Date *</label>
                        <input
                          type="date"
                          value={releaseDate}
                          onChange={(e) => setReleaseDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Songwriter / Composer *</label>
                        <input
                          type="text"
                          value={composer}
                          onChange={(e) => setComposer(e.target.value)}
                          placeholder="Legal First & Last Name"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Lyricist *</label>
                        <input
                          type="text"
                          value={lyricist}
                          onChange={(e) => setLyricist(e.target.value)}
                          placeholder="Legal First & Last Name"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Producer (Optional)</label>
                        <input
                          type="text"
                          value={producer}
                          onChange={(e) => setProducer(e.target.value)}
                          placeholder="Beatmaker / Studio"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Explicit Content Toggle */}
                    <div className="pt-2">
                      <label className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isExplicit}
                          onChange={(e) => setIsExplicit(e.target.checked)}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-white">Explicit Lyrics / Content Warning</span>
                          <p className="text-[11px] text-slate-400">Check if this audio contains profanity, adult themes, or explicit language.</p>
                        </div>
                      </label>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button type="button" onClick={() => setStep(3)} className="px-4 py-2 text-xs text-slate-400">Back</button>
                      <button
                        type="button"
                        disabled={!title || !primaryArtist}
                        onClick={() => setStep(5)}
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50"
                      >
                        Continue to Label Details →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: Label & Barcodes */}
                {step === 5 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white font-display">Step 5: Label & Barcodes</h2>
                    <p className="text-xs text-slate-400">Configure record label branding and track identifiers.</p>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Record Label Name</label>
                      <input
                        type="text"
                        value={labelName}
                        onChange={(e) => setLabelName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Copyright Line (C)</label>
                        <input
                          type="text"
                          value={copyrightOwner}
                          onChange={(e) => setCopyrightOwner(e.target.value)}
                          placeholder="e.g. 2026 Rudraatma Music"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Phonographic Sound Recording (P)</label>
                        <input
                          type="text"
                          value={recordingOwner}
                          onChange={(e) => setRecordingOwner(e.target.value)}
                          placeholder="e.g. 2026 Rudraatma Music"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <span className="font-semibold text-amber-400 font-mono">Automated Global Barcode Provisioning:</span>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Official ISRC codes and an album UPC barcode will be automatically provisioned and assigned by Rudraatma Music at zero additional fee upon review approval.
                      </p>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button type="button" onClick={() => setStep(4)} className="px-4 py-2 text-xs text-slate-400">Back</button>
                      <button
                        type="button"
                        onClick={() => setStep(6)}
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
                      >
                        Continue to Rights Declarations →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: Rights & Clearances */}
                {step === 6 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white font-display">Step 6: Rights Ownership & Clearances</h2>
                    <p className="text-xs text-slate-400">To prevent automated takedowns and protect artist revenue, confirm copyright ownership.</p>

                    <div className="space-y-3 pt-2">
                      <label className="flex items-start gap-3 p-3.5 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={rightsConfirmed}
                          onChange={(e) => setRightsConfirmed(e.target.checked)}
                          className="mt-0.5 rounded text-amber-500 focus:ring-amber-500"
                        />
                        <span className="text-slate-200 leading-relaxed">
                          I certify that I hold 100% legal ownership of the master audio recording and musical composition, or have secured explicit written licensing for all vocal samples and instrumentals used in this release.
                        </span>
                      </label>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button type="button" onClick={() => setStep(5)} className="px-4 py-2 text-xs text-slate-400">Back</button>
                      <button
                        type="button"
                        disabled={!rightsConfirmed}
                        onClick={() => setStep(7)}
                        className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50"
                      >
                        Preview & Final Review →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 7: Review, Preview Modal, and Final Submission */}
                {step === 7 && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white font-display">Step 7: Review & Final Submission</h2>
                      <button
                        type="button"
                        onClick={() => setPreviewModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Interactive Platform Preview</span>
                      </button>
                    </div>

                    {/* Summary Overview */}
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          {artworkUrl && (
                            <img src={artworkUrl} alt="Cover" className="w-12 h-12 rounded-lg object-cover" />
                          )}
                          <div>
                            <div className="text-sm font-bold text-white">{title} {version && `(${version})`}</div>
                            <div className="text-slate-400">{primaryArtist} {featuredArtists && `feat. ${featuredArtists}`}</div>
                          </div>
                        </div>
                        <span className="font-mono text-amber-400 font-bold">{releaseType}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                        <div><span className="text-slate-500 block">Genre:</span> <span className="text-white font-medium">{primaryGenre}</span></div>
                        <div><span className="text-slate-500 block">Language:</span> <span className="text-white font-medium">{language}</span></div>
                        <div><span className="text-slate-500 block">Target Date:</span> <span className="text-white font-medium">{releaseDate}</span></div>
                        <div><span className="text-slate-500 block">Label:</span> <span className="text-white font-medium">{labelName}</span></div>
                        <div><span className="text-slate-500 block">Audio File:</span> <span className="text-white font-medium truncate">{audioFileName || 'Uploaded'}</span></div>
                        <div><span className="text-slate-500 block">Quality:</span> <span className="text-emerald-400 font-mono">{audioAnalysis?.specsSummary || 'Verified Master'}</span></div>
                      </div>
                    </div>

                    <label className="flex items-start gap-2.5 text-xs text-slate-300 pt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span>
                        I authorize Rudraatma Music to distribute this master recording to connected digital service providers (Spotify, Apple Music, YouTube Music, JioSaavn, Wynk, Gaana, Instagram Audio) in accordance with the Distribution Agreement.
                      </span>
                    </label>

                    <div className="flex justify-between pt-6">
                      <button type="button" onClick={() => setStep(6)} className="px-4 py-2 text-xs text-slate-400">Back</button>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleSaveDraft}
                          disabled={savingDraft}
                          className="px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
                        >
                          {savingDraft ? 'Saving...' : 'Save Draft'}
                        </button>
                        <button
                          type="submit"
                          disabled={submitting || !termsAccepted}
                          className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-lg disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-amber-500/20"
                        >
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                          <span>{submitting ? 'Submitting to Desk...' : 'Confirm & Submit Release'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Interactive DSP Preview Modal */}
          {previewModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-[#090e1a] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-sm font-display">Streaming Mockup Preview</span>
                  </div>
                  <button
                    onClick={() => setPreviewModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Spotify / Apple Music Style Player Card */}
                <div className="p-4 bg-gradient-to-b from-slate-900 to-black rounded-xl border border-slate-800 space-y-4">
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-800 shadow-xl">
                    {artworkUrl ? (
                      <img src={artworkUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Disc3 className="w-16 h-16 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">{title || 'Your Track Title'}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{primaryArtist || 'Artist Name'}</p>
                    </div>
                    {audioFileUrl && (
                      <button
                        type="button"
                        onClick={toggleAudioPlay}
                        className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                      </button>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{labelName}</span>
                    <span className="text-amber-400">{audioAnalysis?.specsSummary || 'Master Quality'}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setPreviewModalOpen(false)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VIEW 3: RELEASES CATALOG LIST */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white font-display">Releases Catalog</h1>
              <p className="text-xs text-slate-400">Search and manage submitted titles, metadata revisions, and platform delivery status</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/releases/new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Release</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or artist..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['All', 'Approved', 'Under Review', 'Action Required', 'Draft', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg border whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 overflow-x-auto">
            {filteredReleases.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No releases found matching your search.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Artist</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">UPC Barcode</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredReleases.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/30">
                      <td className="py-3 font-medium text-white flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-slate-800 flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
                          {r.artworkUrl ? (
                            <img src={r.artworkUrl} alt={r.title} className="w-full h-full object-cover" />
                          ) : (
                            <Disc3 className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <span>{r.title}</span>
                      </td>
                      <td className="py-3">{r.artist}</td>
                      <td className="py-3 font-mono text-[11px]">{r.type}</td>
                      <td className="py-3 font-mono text-[11px]">{r.upc}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                            r.status === 'Approved'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : r.status === 'Action Required'
                              ? 'bg-orange-950 text-orange-400 border border-orange-800'
                              : r.status === 'Draft'
                              ? 'bg-slate-800 text-slate-300 border border-slate-700'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => navigate(`/dashboard/releases/${r.id}`)}
                          className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
