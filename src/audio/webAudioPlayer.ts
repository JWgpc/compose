import { getPlayableNotes, getProjectSection, getProjectSections, getSongScoreSummary, getTempoBpm } from '../songscore/adapters.ts';
import { vpoBassSoloSustainSamples, vpoCelloSoloSustainSamples, vpoFluteSoloSustainSamples, vpoViolinSoloSustainSamples } from './vpoCatalog.ts';

export const DEFAULT_INSTRUMENT_ID = 'realistic-piano';

const PRE_ROLL_SECONDS = 0.05;
const LOOP_SCHEDULE_EARLY_MS = 250;
const SAMPLE_LOAD_CONCURRENCY = 3;
const PLAYBACK_SCHEDULE_WINDOW_BEATS = 16;
const MIN_GAIN = 0.0001;
const END_TAIL_PADDING_MS = 3800;
const CHROMATIC_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const rangeProtectionWarnings = new Set();

function createMyPianoFileName(noteName, octaveMarker = '', { prefix = '', lowercase = false } = {}) {
  const [letter, accidental = ''] = noteName.split('');
  const accidentalSuffix = accidental === '#' ? '_sharp' : accidental;
  return `${prefix}${lowercase ? letter.toLowerCase() : letter}${octaveMarker}${accidentalSuffix}`;
}

function createMyPianoSamples(startMidi, { prefix = '', octaveMarker = '', lowercase = false, noteNames = CHROMATIC_NOTE_NAMES } = {}) {
  return noteNames.map((noteName, index) => ({
    rootNote: startMidi + index,
    url: new URL(`./samples/realistic-piano/${createMyPianoFileName(noteName, octaveMarker, { prefix, lowercase })}.wav`, import.meta.url)
      .href,
  }));
}

const realisticPianoSamples = [
  ...[
    { rootNote: 21, fileName: createMyPianoFileName('A', '2') },
    { rootNote: 22, fileName: createMyPianoFileName('A#', '2') },
    { rootNote: 23, fileName: createMyPianoFileName('B', '2') },
  ].map(({ rootNote, fileName }) => ({
    rootNote,
    url: new URL(`./samples/realistic-piano/${fileName}.wav`, import.meta.url).href,
  })),
  ...createMyPianoSamples(24, { prefix: '_', octaveMarker: '1' }),
  ...createMyPianoSamples(36, { prefix: '_' }),
  ...createMyPianoSamples(48, { lowercase: true }),
  ...createMyPianoSamples(60, { lowercase: true, octaveMarker: '1' }),
  ...createMyPianoSamples(72, { lowercase: true, octaveMarker: '2', noteNames: CHROMATIC_NOTE_NAMES.slice(0, 9) }),
  ...createMyPianoSamples(84, { lowercase: true, octaveMarker: '3' }),
  ...createMyPianoSamples(96, { lowercase: true, octaveMarker: '4' }),
  {
    rootNote: 108,
    url: new URL(`./samples/realistic-piano/${createMyPianoFileName('C', '5', { lowercase: true })}.wav`, import.meta.url).href,
  },
];

const sampleBankCatalog = {
  'realistic-piano': {
    samples: realisticPianoSamples,
  },
  'vpo-cello-solo-sustain': {
    samples: vpoCelloSoloSustainSamples,
  },
  'vpo-flute-solo-sustain': {
    samples: vpoFluteSoloSustainSamples,
  },
  'vpo-violin-solo-sustain': {
    samples: vpoViolinSoloSustainSamples,
  },
  'vpo-bass-solo-sustain': {
    samples: vpoBassSoloSustainSamples,
  },
};

const instrumentCatalog = [
  {
    id: 'realistic-piano',
    labelKey: 'instrumentRealisticPiano',
    bankId: 'realistic-piano',
    gain: 0.15,
    attack: 0.008,
    release: 1.25,
    filterFrequency: 6600,
    filterQ: 0.54,
    reverbSend: 0.19,
  },
  {
    id: 'vpo-cello-solo-sustain',
    labelKey: 'instrumentVpoCelloSoloSustain',
    bankId: 'vpo-cello-solo-sustain',
    gain: 0.3,
    attack: 0.008,
    release: 1.55,
    filterFrequency: 6400,
    filterQ: 0.58,
    reverbSend: 0.1,
    playableRange: { min: 36, max: 72, mode: 'octave-fold' },
  },
  {
    id: 'vpo-flute-solo-sustain',
    labelKey: 'instrumentVpoFluteSoloSustain',
    bankId: 'vpo-flute-solo-sustain',
    gain: 0.24,
    attack: 0.006,
    release: 1.05,
    filterFrequency: 9200,
    filterQ: 0.26,
    reverbSend: 0.1,
    playableRange: { min: 60, max: 96, mode: 'octave-fold' },
  },
  {
    id: 'vpo-violin-solo-sustain',
    labelKey: 'instrumentVpoViolinSoloSustain',
    bankId: 'vpo-violin-solo-sustain',
    gain: 0.16,
    attack: 0.007,
    release: 1.2,
    filterFrequency: 7200,
    filterQ: 0.34,
    reverbSend: 0.1,
    playableRange: { min: 55, max: 103, mode: 'octave-fold' },
  },
  {
    id: 'vpo-bass-solo-sustain',
    labelKey: 'instrumentVpoBassSoloSustain',
    bankId: 'vpo-bass-solo-sustain',
    gain: 0.5,
    attack: 0.009,
    release: 1.05,
    filterFrequency: 5200,
    filterQ: 0.72,
    reverbSend: 0.04,
    playableRange: { min: 28, max: 67, mode: 'octave-fold' },
  },
];

const bankCache = new Map();

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getAudioContextConstructor() {
  return window.AudioContext || window.webkitAudioContext || null;
}

function getOfflineAudioContextConstructor() {
  return window.OfflineAudioContext || window.webkitOfflineAudioContext || null;
}

function getInstrumentById(id) {
  return instrumentCatalog.find((instrument) => instrument.id === id) || instrumentCatalog[0];
}

function getPitchCompensation(pitch) {
  if (pitch < 55) {
    return 1.06;
  }

  if (pitch > 72) {
    return 0.92;
  }

  return 1;
}

function createImpulseResponse(audioContext, durationSeconds = 1.8) {
  const frameCount = Math.floor(audioContext.sampleRate * durationSeconds);
  const impulse = audioContext.createBuffer(2, frameCount, audioContext.sampleRate);

  for (let channelIndex = 0; channelIndex < impulse.numberOfChannels; channelIndex += 1) {
    const channel = impulse.getChannelData(channelIndex);
    for (let index = 0; index < frameCount; index += 1) {
      const decay = (1 - index / frameCount) ** 2.8;
      channel[index] = (Math.random() * 2 - 1) * decay * (channelIndex === 0 ? 1 : 0.92);
    }
  }

  return impulse;
}

function decodeAudioBuffer(audioContext, arrayBuffer) {
  return new Promise((resolve, reject) => {
    const result = audioContext.decodeAudioData(arrayBuffer.slice(0), resolve, reject);
    if (result && result.then) {
      result.then(resolve).catch(reject);
    }
  });
}

async function loadSampleIntoEntry(audioContext, sample) {
  if (sample.buffer) {
    return sample;
  }

  if (sample.promise) {
    await sample.promise;
    return sample;
  }

  sample.promise = (async () => {
    const response = await fetch(sample.url);
    if (!response.ok) {
      throw new Error(`Unable to load sample: ${sample.url}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    sample.buffer = await decodeAudioBuffer(audioContext, arrayBuffer);
    return sample.buffer;
  })();

  try {
    await sample.promise;
    return sample;
  } finally {
    sample.promise = null;
  }
}

async function runWithConcurrencyLimit(items, limit, worker) {
  if (!items.length) {
    return;
  }

  let cursor = 0;
  const runnerCount = Math.min(limit, items.length);
  await Promise.all(
    Array.from({ length: runnerCount }, async () => {
      while (cursor < items.length) {
        const currentIndex = cursor;
        cursor += 1;
        await worker(items[currentIndex], currentIndex);
      }
    }),
  );
}

async function loadSampleBank(audioContext, bankId) {
  const bankDefinition = sampleBankCatalog[bankId];
  if (!bankDefinition) {
    throw new Error(`Unknown sample bank: ${bankId}`);
  }

  const cached = bankCache.get(bankId);
  if (cached?.samples) {
    return cached;
  }

  if (cached?.promise) {
    return cached.promise;
  }

  const promise = (async () => {
    if (bankDefinition.samples) {
      return {
        ...bankDefinition,
        samples: bankDefinition.samples.map((sample) => ({ ...sample, buffer: null, promise: null })),
        warmupPromise: null,
      };
    }

    const [leftBuffer, rightBuffer] = await Promise.all([bankDefinition.leftUrl, bankDefinition.rightUrl].map(loadBuffer(audioContext)));
    const frameCount = Math.max(leftBuffer.length, rightBuffer.length);
    const stereoBuffer = audioContext.createBuffer(2, frameCount, audioContext.sampleRate);
    stereoBuffer.copyToChannel(leftBuffer.getChannelData(0), 0, 0);
    stereoBuffer.copyToChannel(rightBuffer.getChannelData(0), 1, 0);
    return {
      samples: [
        {
          rootNote: bankDefinition.rootNote,
          buffer: stereoBuffer,
          promise: null,
        },
      ],
      warmupPromise: null,
    };
  })().then((loaded) => {
    bankCache.set(bankId, loaded);
    return loaded;
  });

  bankCache.set(bankId, { promise });
  return promise;
}

function loadBuffer(audioContext) {
  return async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Unable to load sample: ${url}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return decodeAudioBuffer(audioContext, arrayBuffer);
  };
}

async function preloadSampleBankEntries(audioContext, bank, requiredRootNotes = []) {
  const requiredRootNoteSet = new Set(requiredRootNotes);
  const requiredSamples = bank.samples.filter((sample) => requiredRootNoteSet.has(sample.rootNote) && !sample.buffer);

  await runWithConcurrencyLimit(requiredSamples, SAMPLE_LOAD_CONCURRENCY, (sample) => loadSampleIntoEntry(audioContext, sample));

  if (bank.warmupPromise) {
    return;
  }

  const remainingSamples = bank.samples.filter((sample) => !requiredRootNoteSet.has(sample.rootNote) && !sample.buffer);
  if (!remainingSamples.length) {
    return;
  }

  bank.warmupPromise = runWithConcurrencyLimit(remainingSamples, SAMPLE_LOAD_CONCURRENCY, (sample) => loadSampleIntoEntry(audioContext, sample))
    .catch((_error) => undefined)
    .finally(() => {
      bank.warmupPromise = null;
    });
}

function pickNearestSample(samples, pitch) {
  const exactSample = samples.find((sample) => sample.rootNote === pitch);
  if (exactSample) {
    return exactSample;
  }

  return samples.reduce((closest, sample) => {
    if (!closest) {
      return sample;
    }

    return Math.abs(sample.rootNote - pitch) < Math.abs(closest.rootNote - pitch) ? sample : closest;
  }, null);
}

function midiToPitchName(midi) {
  const octave = Math.floor(midi / 12) - 1;
  return `${CHROMATIC_NOTE_NAMES[midi % 12]}${octave}`;
}

function protectInstrumentPitch(instrument, pitch) {
  const playableRange = instrument?.playableRange;
  if (!playableRange) {
    return pitch;
  }

  const { min, max, mode = 'clamp' } = playableRange;
  if (pitch >= min && pitch <= max) {
    return pitch;
  }

  let protectedPitch = pitch;
  if (mode === 'octave-fold') {
    while (protectedPitch < min) {
      protectedPitch += 12;
    }
    while (protectedPitch > max) {
      protectedPitch -= 12;
    }
  }

  protectedPitch = clamp(protectedPitch, min, max);

  const warningKey = `${instrument.id}:${pitch}:${protectedPitch}`;
  if (!rangeProtectionWarnings.has(warningKey) && typeof console !== 'undefined') {
    rangeProtectionWarnings.add(warningKey);
    console.warn(
      `[audio] Range-protected ${instrument.id} note ${midiToPitchName(pitch)} (${pitch}) -> ${midiToPitchName(protectedPitch)} (${protectedPitch})`,
    );
  }

  return protectedPitch;
}

function stopVoice(voice, time) {
  voice.sources.forEach((source) => {
    try {
      source.stop(time);
    } catch (_error) {
      return undefined;
    }
    return undefined;
  });
}

function disconnectVoice(voice) {
  if (voice.disconnected) {
    return;
  }

  voice.disconnected = true;
  voice.sources.forEach((source) => {
    try {
      source.disconnect();
    } catch (_error) {
      return undefined;
    }
    return undefined;
  });

  [voice.sendGain, voice.output, voice.filter].forEach((node) => {
    if (!node) {
      return;
    }

    try {
      node.disconnect();
    } catch (_error) {
      return undefined;
    }

    return undefined;
  });
}

function isOfflineContext(audioContext) {
  return typeof audioContext.startRendering === 'function';
}

function scheduleSampleVoice(audioContext, buses, instrument, bank, note, startTime, durationSeconds) {
  const protectedPitch = protectInstrumentPitch(instrument, note.pitch);
  const sample = pickNearestSample(bank.samples, protectedPitch);
  if (!sample?.buffer) {
    return null;
  }

  const velocityBoost = note.emphasis === 'hook' ? 1.15 : note.emphasis === 'contrast' ? 0.92 : 1;
  const pitchCompensation = getPitchCompensation(protectedPitch);
  const sampleCompensation = sample.gainCompensation || 1;
  const peakGain = instrument.gain * velocityBoost * pitchCompensation * sampleCompensation;
  const playbackRate = 2 ** ((protectedPitch - sample.rootNote) / 12);
  const naturalDuration = sample.buffer.duration / playbackRate;
  const naturalEndTime = startTime + naturalDuration;
  const output = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const source = audioContext.createBufferSource();
  const sendGain = instrument.reverbSend > 0 ? audioContext.createGain() : null;

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(
    clamp(instrument.filterFrequency * 2 ** ((protectedPitch - 60) / 30), 1600, 12000),
    startTime,
  );
  filter.Q.setValueAtTime(instrument.filterQ, startTime);

  output.gain.setValueAtTime(MIN_GAIN, startTime);
  const attackEnd = startTime + Math.max(instrument.attack, 0.003);
  const releaseStart = Math.min(Math.max(startTime + durationSeconds, attackEnd + 0.06), naturalEndTime - 0.04);
  const endTime = Math.min(releaseStart + instrument.release, naturalEndTime);

  output.gain.linearRampToValueAtTime(peakGain, attackEnd);
  output.gain.setValueAtTime(peakGain, releaseStart);
  output.gain.exponentialRampToValueAtTime(MIN_GAIN, endTime);

  source.buffer = sample.buffer;
  source.playbackRate.setValueAtTime(playbackRate, startTime);
  source.connect(output);
  output.connect(filter);
  filter.connect(buses.masterGain);

  if (sendGain && buses.reverbInput) {
    sendGain.gain.setValueAtTime(instrument.reverbSend, startTime);
    filter.connect(sendGain);
    sendGain.connect(buses.reverbInput);
  }

  source.start(startTime, 0);
  source.stop(Math.max(endTime + 0.02, attackEnd + 0.04));

  const voice = { sources: [source], output, filter, sendGain, endTime };
  if (!isOfflineContext(audioContext)) {
    const disconnectDelay = Math.max((endTime - audioContext.currentTime + 0.12) * 1000, 80);
    window.setTimeout(() => disconnectVoice(voice), disconnectDelay);
  }
  return voice;
}

export function getAvailableInstruments() {
  return instrumentCatalog.map(({ id, labelKey }) => ({ id, labelKey }));
}

function normalizeInstrumentCandidate(candidateId) {
  if (typeof candidateId !== 'string') {
    return null;
  }

  const normalizedId = candidateId.trim();
  if (!normalizedId) {
    return null;
  }

  const exactMatch = instrumentCatalog.find((instrument) => instrument.id === normalizedId);
  if (exactMatch) {
    return exactMatch.id;
  }

  return instrumentCatalog.find((instrument) => instrument.bankId === normalizedId)?.id || null;
}

export function resolveInstrumentId(candidateId, fallbackInstrumentId = DEFAULT_INSTRUMENT_ID) {
  return normalizeInstrumentCandidate(candidateId) || normalizeInstrumentCandidate(fallbackInstrumentId) || DEFAULT_INSTRUMENT_ID;
}

export function resolveTrackInstrumentId(project, trackId, fallbackInstrumentId = DEFAULT_INSTRUMENT_ID) {
  const renderHints = project?.songScore?.renderHints || {};
  const trackDefaults = renderHints.defaultInstruments || {};
  const declaredTrack = project?.songScore?.tracks?.find((track) => track.id === trackId) || null;

  return resolveInstrumentId(
    trackDefaults[trackId] || declaredTrack?.instrumentHint || renderHints.preferredPreviewInstrument || fallbackInstrumentId,
    fallbackInstrumentId,
  );
}

export function getProjectTrackInstrumentIds(project, fallbackInstrumentId = DEFAULT_INSTRUMENT_ID) {
  const trackIds = new Set((project?.songScore?.tracks || []).map((track) => track.id));

  (project?.songScore?.notes || []).forEach((note) => {
    if (typeof note?.trackId === 'string' && note.trackId) {
      trackIds.add(note.trackId);
    }
  });

  return Object.fromEntries(
    [...trackIds].map((trackId) => [trackId, resolveTrackInstrumentId(project, trackId, fallbackInstrumentId)]),
  );
}

function getTrackInstrumentDefinitions(project, notes, fallbackInstrumentId = DEFAULT_INSTRUMENT_ID) {
  const instrumentByTrackId = new Map();

  notes.forEach((note) => {
    const trackKey = note.trackId || '';
    if (instrumentByTrackId.has(trackKey)) {
      return;
    }

    instrumentByTrackId.set(trackKey, getInstrumentById(resolveTrackInstrumentId(project, note.trackId, fallbackInstrumentId)));
  });

  if (!instrumentByTrackId.size) {
    instrumentByTrackId.set('', getInstrumentById(resolveInstrumentId(project?.songScore?.renderHints?.preferredPreviewInstrument, fallbackInstrumentId)));
  }

  return instrumentByTrackId;
}

function collectRequiredSampleRootNotes(notes, instrumentByTrackId) {
  const rootNotesByBankId = new Map();

  notes.forEach((note) => {
    const instrument = instrumentByTrackId.get(note.trackId || '');
    if (!instrument) {
      return;
    }

    const protectedPitch = protectInstrumentPitch(instrument, note.pitch);
    const rootNotes = rootNotesByBankId.get(instrument.bankId) || new Set();
    rootNotes.add(protectedPitch);
    rootNotesByBankId.set(instrument.bankId, rootNotes);
  });

  return rootNotesByBankId;
}

async function loadBanksForTrackInstruments(audioContext, instrumentByTrackId, notes = []) {
  const bankByBankId = new Map();
  const requiredRootNotesByBankId = collectRequiredSampleRootNotes(notes, instrumentByTrackId);

  await Promise.all(
    [...new Set([...instrumentByTrackId.values()].map((instrument) => instrument.bankId))].map(async (bankId) => {
      const bank = await loadSampleBank(audioContext, bankId);
      const requiredRootNotes = [...(requiredRootNotesByBankId.get(bankId) || new Set())].map((pitch) => pickNearestSample(bank.samples, pitch)?.rootNote)
        .filter((rootNote) => typeof rootNote === 'number');
      await preloadSampleBankEntries(audioContext, bank, requiredRootNotes);
      bankByBankId.set(bankId, bank);
    }),
  );

  return bankByBankId;
}

function floatTo16BitPCM(output, offset, input) {
  for (let index = 0; index < input.length; index += 1, offset += 2) {
    const sample = Math.max(-1, Math.min(1, input[index]));
    output.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
}

function writeAscii(view, offset, text) {
  for (let index = 0; index < text.length; index += 1) {
    view.setUint8(offset + index, text.charCodeAt(index));
  }
}

function encodeWav(audioBuffer) {
  const channels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const frameCount = audioBuffer.length;
  const bytesPerSample = 2;
  const blockAlign = channels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + frameCount * blockAlign);
  const view = new DataView(buffer);

  writeAscii(view, 0, 'RIFF');
  view.setUint32(4, 36 + frameCount * blockAlign, true);
  writeAscii(view, 8, 'WAVE');
  writeAscii(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, 'data');
  view.setUint32(40, frameCount * blockAlign, true);

  let offset = 44;
  const channelData = Array.from({ length: channels }, (_, channel) => audioBuffer.getChannelData(channel));
  for (let frame = 0; frame < frameCount; frame += 1) {
    for (let channel = 0; channel < channels; channel += 1) {
      const sample = Math.max(-1, Math.min(1, channelData[channel][frame]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return buffer;
}

async function renderProjectBuffer(project, fallbackInstrumentId, { loopEnabled = false, selectedSectionId = null, lyricsOnly = false } = {}) {
  const OfflineAudioContextConstructor = getOfflineAudioContextConstructor();
  if (!OfflineAudioContextConstructor) {
    throw new Error('Offline audio rendering is not supported in this browser.');
  }

  const tempo = getTempoBpm(project);
  const beatsPerSecond = tempo / 60;
  const sections = getProjectSections(project);
  const summary = getSongScoreSummary(project);
  const selectedSection = getProjectSection(project, selectedSectionId) || sections[0];
  const shouldLoopSection = Boolean(loopEnabled && selectedSection);
  const renderStartBeat = shouldLoopSection ? selectedSection.startBar * 4 : 0;
  const renderEndBeat = shouldLoopSection ? (selectedSection.startBar + selectedSection.bars) * 4 : summary.totalBeats;
  const renderBeats = Math.max(renderEndBeat - renderStartBeat, 1);
  const renderDurationSeconds = renderBeats / beatsPerSecond + 4.2;
  const sampleRate = 44100;
  const frameCount = Math.ceil(renderDurationSeconds * sampleRate);
  const offlineContext = new OfflineAudioContextConstructor(2, frameCount, sampleRate);

  const masterGain = offlineContext.createGain();
  const reverbInput = offlineContext.createGain();
  const convolver = offlineContext.createConvolver();
  const wetGain = offlineContext.createGain();

  masterGain.gain.value = 0.82;
  wetGain.gain.value = 0.28;
  convolver.buffer = createImpulseResponse(offlineContext);
  reverbInput.connect(convolver);
  convolver.connect(wetGain);
  wetGain.connect(masterGain);
  masterGain.connect(offlineContext.destination);

  const buses = { masterGain, reverbInput, convolver, wetGain };
  const notes = getPlayableNotes(project, { lyricsOnly }).filter(
    (note) => note.startBeat < renderEndBeat && note.startBeat + note.duration > renderStartBeat,
  );
  const instrumentByTrackId = getTrackInstrumentDefinitions(project, notes, fallbackInstrumentId);
  const bankByBankId = await loadBanksForTrackInstruments(offlineContext, instrumentByTrackId, notes);

  notes.forEach((note) => {
    const clippedStartBeat = Math.max(note.startBeat, renderStartBeat);
    const clippedEndBeat = Math.min(note.startBeat + note.duration, renderEndBeat);
    const relativeStartSeconds = (clippedStartBeat - renderStartBeat) / beatsPerSecond + PRE_ROLL_SECONDS;
    const durationSeconds = Math.max((clippedEndBeat - clippedStartBeat) / beatsPerSecond, 0.06);
    const instrument = instrumentByTrackId.get(note.trackId || '') || getInstrumentById(resolveTrackInstrumentId(project, note.trackId, fallbackInstrumentId));
    const bank = bankByBankId.get(instrument.bankId);

    scheduleSampleVoice(offlineContext, buses, instrument, bank, note, relativeStartSeconds, durationSeconds);
  });

  return new Promise((resolve, reject) => {
    offlineContext.oncomplete = (event) => resolve(event.renderedBuffer);
    offlineContext.onerror = (error) => reject(error);
    const result = offlineContext.startRendering();
    if (result && result.then) {
      result.then(resolve).catch(reject);
    }
  });
}

export async function exportProjectToWav(project, fallbackInstrumentId, options = {}) {
  const rendered = await renderProjectBuffer(project, fallbackInstrumentId, options);
  const wav = encodeWav(rendered);
  return new Blob([wav], { type: 'audio/wav' });
}

export function createAudioPlayer({ onPosition, onEnded } = {}) {
  let audioContext = null;
  let buses = null;
  let playback = null;
  let previewInstrumentId = DEFAULT_INSTRUMENT_ID;
  let animationFrameId = 0;
  let finishTimerId = 0;
  const loopTimerIds = new Set();
  let scheduledVoices = [];

  function ensureAudioContext() {
    if (audioContext) {
      return audioContext;
    }

    const AudioContextConstructor = getAudioContextConstructor();
    if (!AudioContextConstructor) {
      return null;
    }

    audioContext = new AudioContextConstructor();
    const masterGain = audioContext.createGain();
    const reverbInput = audioContext.createGain();
    const convolver = audioContext.createConvolver();
    const wetGain = audioContext.createGain();

    masterGain.gain.value = 0.82;
    wetGain.gain.value = 0.28;
    convolver.buffer = createImpulseResponse(audioContext);

    reverbInput.connect(convolver);
    convolver.connect(wetGain);
    wetGain.connect(masterGain);
    masterGain.connect(audioContext.destination);

    buses = { masterGain, reverbInput, convolver, wetGain };
    return audioContext;
  }

  function clearLoopTimers() {
    loopTimerIds.forEach((timerId) => window.clearTimeout(timerId));
    loopTimerIds.clear();
  }

  function clearScheduledVoices() {
    if (!audioContext) {
      scheduledVoices = [];
      return;
    }

    const stopTime = audioContext.currentTime;
    scheduledVoices.forEach((voice) => {
      stopVoice(voice, stopTime);
      window.setTimeout(() => disconnectVoice(voice), 50);
    });
    scheduledVoices = [];
  }

  function cancelProgressUpdates() {
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    }
  }

  function computeCurrentBeat() {
    if (!playback || !audioContext) {
      return 0;
    }

    const elapsedBeats = Math.max(0, audioContext.currentTime - playback.playStartTime) * playback.beatsPerSecond;
    if (!playback.loopEnabled) {
      return clamp(playback.startBeat + elapsedBeats, 0, playback.totalBeats);
    }

    const firstSpan = playback.loopEndBeat - playback.startBeat;
    if (elapsedBeats <= firstSpan) {
      return clamp(playback.startBeat + elapsedBeats, playback.startBeat, playback.loopEndBeat);
    }

    const loopLength = playback.loopEndBeat - playback.loopStartBeat;
    if (loopLength <= 0) {
      return playback.loopStartBeat;
    }

    const loopBeats = elapsedBeats - firstSpan;
    return playback.loopStartBeat + (loopBeats % loopLength);
  }

  function pumpPosition() {
    if (!playback) {
      return;
    }

    onPosition?.(computeCurrentBeat());
    animationFrameId = window.requestAnimationFrame(pumpPosition);
  }

  async function scheduleRange(project, startBeat, endBeat, startTime) {
    if (!audioContext || !buses || endBeat <= startBeat) {
      return;
    }

    const notes = getPlayableNotes(project, { lyricsOnly: playback.lyricsOnly }).filter(
      (note) => note.startBeat < endBeat && note.startBeat + note.duration > startBeat,
    );
    const instrumentByTrackId = getTrackInstrumentDefinitions(project, notes, previewInstrumentId);
    const bankByBankId = await loadBanksForTrackInstruments(audioContext, instrumentByTrackId, notes);

    notes.forEach((note) => {
      const instrument = instrumentByTrackId.get(note.trackId || '') || getInstrumentById(resolveTrackInstrumentId(project, note.trackId, previewInstrumentId));
      const bank = bankByBankId.get(instrument.bankId);
      const clippedStartBeat = Math.max(note.startBeat, startBeat);
      const clippedEndBeat = Math.min(note.startBeat + note.duration, endBeat);
      const relativeStartSeconds = (clippedStartBeat - startBeat) / playback.beatsPerSecond;
      const durationSeconds = Math.max((clippedEndBeat - clippedStartBeat) / playback.beatsPerSecond, 0.06);
      const voice = scheduleSampleVoice(audioContext, buses, instrument, bank, note, startTime + relativeStartSeconds, durationSeconds);
      if (voice) {
        scheduledVoices.push(voice);
      }
    });
  }

  async function schedulePlaybackWindow(project, startBeat, finalEndBeat, startTime, token) {
    if (!playback || playback.token !== token || finalEndBeat <= startBeat) {
      return;
    }

    const windowEndBeat = Math.min(startBeat + PLAYBACK_SCHEDULE_WINDOW_BEATS, finalEndBeat);
    await scheduleRange(project, startBeat, windowEndBeat, startTime);

    if (!playback || playback.token !== token) {
      return;
    }

    const windowDurationMs = ((windowEndBeat - startBeat) / playback.beatsPerSecond) * 1000;
    const nextStartTime = startTime + (windowEndBeat - startBeat) / playback.beatsPerSecond;
    const nextStartBeat = windowEndBeat >= finalEndBeat && playback.loopEnabled ? playback.loopStartBeat : windowEndBeat;
    const nextFinalEndBeat = windowEndBeat >= finalEndBeat && playback.loopEnabled ? playback.loopEndBeat : finalEndBeat;

    if (nextFinalEndBeat <= nextStartBeat) {
      return;
    }

    const timerId = window.setTimeout(() => {
      loopTimerIds.delete(timerId);
      void schedulePlaybackWindow(project, nextStartBeat, nextFinalEndBeat, nextStartTime, token);
    }, Math.max(windowDurationMs - LOOP_SCHEDULE_EARLY_MS, 0));
    loopTimerIds.add(timerId);
  }

  function finalize(reason) {
    cancelProgressUpdates();
    clearLoopTimers();
    if (finishTimerId) {
      window.clearTimeout(finishTimerId);
      finishTimerId = 0;
    }
    clearScheduledVoices();
    playback = null;
    onEnded?.(reason);
  }

  async function play(project, options = {}) {
    const context = ensureAudioContext();
    if (!context) {
      return false;
    }

    await context.resume();

    const totalBeats = project.totalBars * 4;
    const sections = getProjectSections(project);
    const selectedSection = getProjectSection(project, options.selectedSectionId) || sections[0];
    const loopEnabled = Boolean(options.loopEnabled && selectedSection);
    const loopStartBeat = loopEnabled ? selectedSection.startBar * 4 : 0;
    const loopEndBeat = loopEnabled ? (selectedSection.startBar + selectedSection.bars) * 4 : totalBeats;
    let startBeat = clamp(Number(options.startBeat ?? 0), 0, totalBeats);

    if (loopEnabled && (startBeat < loopStartBeat || startBeat >= loopEndBeat)) {
      startBeat = loopStartBeat;
    }

    if (playback) {
      finalize('replaced');
    }

    const token = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    playback = {
      token,
      beatsPerSecond: getTempoBpm(project) / 60,
      playStartTime: context.currentTime + PRE_ROLL_SECONDS,
      startBeat,
      totalBeats,
      loopEnabled,
      loopStartBeat,
      loopEndBeat,
      lyricsOnly: Boolean(options.lyricsOnly),
    };

    const firstSegmentEndBeat = loopEnabled ? loopEndBeat : totalBeats;
    const firstWindowEndBeat = Math.min(startBeat + PLAYBACK_SCHEDULE_WINDOW_BEATS, firstSegmentEndBeat);
    await scheduleRange(project, startBeat, firstWindowEndBeat, playback.playStartTime);
    void schedulePlaybackWindow(project, firstWindowEndBeat, firstSegmentEndBeat, playback.playStartTime + (firstWindowEndBeat - startBeat) / playback.beatsPerSecond, token);

    if (!loopEnabled) {
      const durationMs = ((firstSegmentEndBeat - startBeat) / playback.beatsPerSecond) * 1000;
      finishTimerId = window.setTimeout(() => finalize('ended'), durationMs + END_TAIL_PADDING_MS);
    }

    cancelProgressUpdates();
    pumpPosition();
    return true;
  }

  function pause() {
    const beat = computeCurrentBeat();
    if (playback) {
      finalize('paused');
    }
    return beat;
  }

  function stop() {
    if (playback) {
      finalize('stopped');
      return;
    }

    cancelProgressUpdates();
    clearLoopTimers();
    if (finishTimerId) {
      window.clearTimeout(finishTimerId);
      finishTimerId = 0;
    }
    clearScheduledVoices();
  }

  function setInstrument(nextInstrumentId) {
    previewInstrumentId = resolveInstrumentId(nextInstrumentId);
  }

  function dispose() {
    stop();

    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
    }

    if (buses) {
      [buses.reverbInput, buses.convolver, buses.wetGain, buses.masterGain].forEach((node) => {
        try {
          node.disconnect();
        } catch (_error) {
          return undefined;
        }
        return undefined;
      });
    }
  }

  return {
    dispose,
    getCurrentBeat: computeCurrentBeat,
    pause,
    play,
    setInstrument,
    stop,
  };
}
