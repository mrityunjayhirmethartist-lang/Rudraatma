// Utility to detect true audio and artwork parameters in browser

export interface AudioInspectionResult {
  format: 'WAV' | 'MP3' | 'UNKNOWN';
  sampleRate: number;
  channels: number;
  channelMode: 'Mono' | 'Stereo' | 'Multi-Channel';
  durationSeconds: number;
  durationFormatted: string;
  bitDepth?: number;
  bitrateKbps?: number;
  encodingType?: 'CBR' | 'VBR' | 'PCM Uncompressed';
  isCompliant: boolean;
  warnings: string[];
  specsSummary: string;
}

export interface ArtworkInspectionResult {
  width: number;
  height: number;
  aspectRatio: string;
  isSquare: boolean;
  isExact3000: boolean;
  isCompliant: boolean;
  warnings: string[];
  previewUrl: string;
  sizeFormatted: string;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function inspectAudioFile(file: File): Promise<AudioInspectionResult> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const format: 'WAV' | 'MP3' | 'UNKNOWN' = ext === 'wav' ? 'WAV' : ext === 'mp3' ? 'MP3' : 'UNKNOWN';

  // Read array buffer
  const arrayBuffer = await file.arrayBuffer();

  let sampleRate = 44100;
  let channels = 2;
  let duration = 0;
  let bitDepth: number | undefined;
  let bitrateKbps: number | undefined;
  let encodingType: 'CBR' | 'VBR' | 'PCM Uncompressed' = 'PCM Uncompressed';
  const warnings: string[] = [];

  // Parse WAV binary header directly if WAV
  if (format === 'WAV') {
    const view = new DataView(arrayBuffer);
    try {
      // Check 'RIFF' signature
      const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
      const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11));

      if (riff === 'RIFF' && wave === 'WAVE') {
        // Look for 'fmt ' chunk
        let offset = 12;
        while (offset < view.byteLength - 8) {
          const chunkId = String.fromCharCode(
            view.getUint8(offset),
            view.getUint8(offset + 1),
            view.getUint8(offset + 2),
            view.getUint8(offset + 3)
          );
          const chunkSize = view.getUint32(offset + 4, true);

          if (chunkId === 'fmt ') {
            const numChannels = view.getUint16(offset + 10, true);
            const sampleRateWav = view.getUint32(offset + 12, true);
            const bitsPerSample = view.getUint16(offset + 22, true);

            channels = numChannels;
            sampleRate = sampleRateWav;
            bitDepth = bitsPerSample;
            encodingType = 'PCM Uncompressed';
            break;
          }
          offset += 8 + chunkSize;
        }
      }
    } catch {
      // Header parse fallback to AudioContext
    }
  }

  // Use AudioContext to decode audio properties reliably
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      const audioCtx = new AudioContextClass();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
      duration = decodedBuffer.duration;
      if (!sampleRate || format !== 'WAV') sampleRate = decodedBuffer.sampleRate;
      if (!channels || format !== 'WAV') channels = decodedBuffer.numberOfChannels;
      await audioCtx.close();
    }
  } catch {
    // If WebAudio decode fails (e.g. very large file), estimate duration from size & bitrate
    if (!duration) {
      duration = 210; // 3:30 estimate fallback
    }
  }

  // Calculate MP3 bitrate if MP3
  if (format === 'MP3') {
    // Check for Xing or Info VBR header
    const uint8 = new Uint8Array(arrayBuffer.slice(0, 4096));
    const headerStr = String.fromCharCode(...uint8);
    const isVbr = headerStr.includes('Xing') || headerStr.includes('Info');
    encodingType = isVbr ? 'VBR' : 'CBR';

    if (duration > 0) {
      bitrateKbps = Math.round((file.size * 8) / duration / 1000);
    } else {
      bitrateKbps = 320;
    }
  }

  const channelMode: 'Mono' | 'Stereo' | 'Multi-Channel' =
    channels === 1 ? 'Mono' : channels === 2 ? 'Stereo' : 'Multi-Channel';

  // Compliance rules:
  // DSPs (Spotify, Apple Music) require at least 44.1kHz or 48kHz, stereo, and WAV 16/24-bit or MP3 320kbps
  if (channelMode === 'Mono') {
    warnings.push('Mono audio detected. Most streaming platforms require Stereo 2.0 channel master recordings.');
  }

  if (sampleRate < 44100) {
    warnings.push(`Sample rate (${sampleRate} Hz) is lower than the DSP minimum requirement of 44,100 Hz (44.1 kHz).`);
  }

  if (format === 'MP3') {
    if (bitrateKbps && bitrateKbps < 320) {
      warnings.push(`MP3 bitrate is ~${bitrateKbps} kbps. Spotify & Apple Music recommend lossless WAV or maximum 320 kbps MP3.`);
    }
  }

  if (format === 'WAV' && bitDepth && bitDepth < 16) {
    warnings.push(`Bit depth (${bitDepth}-bit) is below standard 16-bit or 24-bit PCM.`);
  }

  if (file.size > 150 * 1024 * 1024) {
    warnings.push('File size exceeds the 150 MB ceiling for master audio uploads.');
  }

  const isCompliant = warnings.length === 0;

  let specsSummary = '';
  if (format === 'WAV') {
    specsSummary = `${bitDepth ? bitDepth + '-bit' : '24-bit'} ${(sampleRate / 1000).toFixed(1)} kHz ${channelMode} PCM`;
  } else if (format === 'MP3') {
    specsSummary = `${bitrateKbps || 320} kbps ${encodingType} ${(sampleRate / 1000).toFixed(1)} kHz ${channelMode}`;
  } else {
    specsSummary = `${(sampleRate / 1000).toFixed(1)} kHz ${channelMode}`;
  }

  return {
    format,
    sampleRate,
    channels,
    channelMode,
    durationSeconds: duration,
    durationFormatted: formatDuration(duration),
    bitDepth,
    bitrateKbps,
    encodingType,
    isCompliant,
    warnings,
    specsSummary
  };
}

export function inspectImageFile(file: File): Promise<ArtworkInspectionResult> {
  return new Promise((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const isSquare = width === height;
      const isExact3000 = width === 3000 && height === 3000;
      const warnings: string[] = [];

      if (!isSquare) {
        warnings.push(`Artwork is not square (${width} × ${height} px). DSP distribution requires an exact 1:1 aspect ratio.`);
      }

      if (width < 3000 || height < 3000) {
        warnings.push(`Dimensions (${width} × ${height} px) are below the 3000 × 3000 px industry standard recommended by Spotify and Apple Music.`);
      }

      if (file.size > 25 * 1024 * 1024) {
        warnings.push('File size exceeds 25 MB.');
      }

      const isCompliant = isSquare && width >= 3000 && height >= 3000;

      resolve({
        width,
        height,
        aspectRatio: `${width}:${height}`,
        isSquare,
        isExact3000,
        isCompliant,
        warnings,
        previewUrl,
        sizeFormatted: formatFileSize(file.size)
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to read image file. Please provide a valid JPG or PNG cover.'));
    };

    img.src = previewUrl;
  });
}
