import { BlogArticle } from '../types';

export const BLOGS_DATA: BlogArticle[] = [
  {
    id: 'art-1',
    slug: 'preparing-lossless-audio-dsp-ingestion',
    title: 'The Independent Producer’s Guide to Lossless Audio & DSP Standards',
    excerpt: 'Avoid digital distortion, clipping penalties, and sample-rate mismatches by mastering specifically for global streaming ingestion pipelines.',
    category: 'Audio Engineering & QC',
    readTime: '6 min read',
    publishedDate: 'March 28, 2026',
    author: 'Rudraatma Technical Editorial Desk',
    content: [
      'Digital streaming platforms do not play raw uncompressed files directly to mobile listeners; they encode your master into variable codecs like AAC, Ogg Vorbis, and ALAC. If your source audio is already heavily compressed or clipped, lossy re-encoding generates severe inter-sample peaks.',
      'We require 16-bit or 24-bit stereo WAV or FLAC files exported at 44.1kHz or 48kHz. Never submit MP3 files upsampled to WAV, as frequency cutoffs at 16kHz will immediately flag technical failure during ingestion QC.',
      'Leave at least -1.0 dB True Peak ceiling to ensure that loud mastering limiters do not cause clipping distortion when converted to AAC formats across platforms like Spotify and Apple Music.'
    ]
  },
  {
    id: 'art-2',
    slug: 'cover-art-guidelines-avoid-rejections',
    title: 'Cover Art Guidelines: 7 Critical Mistakes That Cause Release Delays',
    excerpt: 'From pixel dimensions to banned retailer icons and blurry text, learn what automated ingestion scanners inspect before approving cover graphics.',
    category: 'Artwork & Visuals',
    readTime: '5 min read',
    publishedDate: 'March 15, 2026',
    author: 'Visual Standards Desk',
    content: [
      'Every major digital streaming platform enforces strict artwork criteria. Cover artwork must be an exact 1:1 square, minimum 3000 x 3000 pixels, in RGB color space at 300 DPI.',
      'The single most common cause of rejection is including third-party brand logos (e.g. Spotify icons, Apple logos), social media handles (@artist), pricing text, or barcode graphics on the artwork.',
      'Furthermore, the title and primary artist text on your artwork must match your metadata letter-for-letter. Any spelling or casing discrepancy causes automatic platform hold.'
    ]
  },
  {
    id: 'art-3',
    slug: 'understanding-isrc-upc-barcodes',
    title: 'Demystifying ISRCs and UPCs: How Song Identification Actually Works',
    excerpt: 'What is the difference between an ISRC for track-level tracking and a UPC for album packaging? How metadata links your digital earnings.',
    category: 'Metadata & Royalties',
    readTime: '7 min read',
    publishedDate: 'February 24, 2026',
    author: 'Catalog Operations',
    content: [
      'An ISRC (International Standard Recording Code) is a unique 12-character alphanumeric code that permanently identifies a specific sound recording. It remains tied to the track even if released across multiple albums or compilations.',
      'A UPC (Universal Product Code) identifies the release package as a whole — whether that is a 1-track single or a 12-track album. When you upload through Rudraatma Music, both are generated and assigned free of charge.',
      'If you are migrating catalog from a previous distributor, retaining your existing ISRC codes ensures you preserve play counts, algorithmic playlist associations, and save history.'
    ]
  },
  {
    id: 'art-4',
    slug: 'music-rights-publishing-vs-master',
    title: 'Master vs. Publishing Rights: What Independent Artists Must Know',
    excerpt: 'Understand how composition copyrights differ from sound recordings, how cover mechanical licenses work, and how to protect your catalog.',
    category: 'Music Rights & Legal',
    readTime: '8 min read',
    publishedDate: 'February 10, 2026',
    author: 'Legal & Rights Advisory',
    content: [
      'Every piece of recorded music embodies two distinct copyrights: the Master (the physical or digital sound recording) and the Publishing (the underlying musical composition and lyrics).',
      'When you distribute music via Rudraatma Music, you retain 100% ownership of your Master recording. You license Rudraatma Music non-exclusively to transmit your recordings to DSPs.',
      'If you write original songs, ensure your songwriter credits, lyricist credits, and publisher declarations are recorded accurately during the metadata submission stage.'
    ]
  }
];
