import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'src', 'audio', 'samples');
const sampleRate = 32000;
const pianoRoots = [48, 55, 62, 69, 76];
const stringsRoots = [48, 55, 62, 69, 76];

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function smoothStep(edge0, edge1, value) {
  const amount = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return amount * amount * (3 - 2 * amount);
}

function normalizeStereo(left, right, peak = 0.92) {
  let max = 0;
  for (let index = 0; index < left.length; index += 1) {
    max = Math.max(max, Math.abs(left[index]), Math.abs(right[index]));
  }

  if (max < 1e-6) {
    return;
  }

  const gain = peak / max;
  for (let index = 0; index < left.length; index += 1) {
    left[index] *= gain;
    right[index] *= gain;
  }
}

function writeWavBuffer(left, right, outputSampleRate) {
  const frames = left.length;
  const channels = 2;
  const bitsPerSample = 16;
  const blockAlign = channels * (bitsPerSample / 8);
  const byteRate = outputSampleRate * blockAlign;
  const dataSize = frames * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(outputSampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let index = 0; index < frames; index += 1) {
    const leftSample = Math.max(-1, Math.min(1, left[index]));
    const rightSample = Math.max(-1, Math.min(1, right[index]));
    buffer.writeInt16LE(Math.round(leftSample * 32767), offset);
    buffer.writeInt16LE(Math.round(rightSample * 32767), offset + 2);
    offset += 4;
  }

  return buffer;
}

function createPianoSample(rootMidi) {
  const frequency = midiToFrequency(rootMidi);
  const durationSeconds = rootMidi <= 55 ? 4.2 : rootMidi <= 69 ? 3.5 : 2.9;
  const frames = Math.floor(durationSeconds * sampleRate);
  const left = new Float32Array(frames);
  const right = new Float32Array(frames);
  const random = createRandom(2000 + rootMidi * 17);
  const stringCount = rootMidi < 55 ? 2 : 3;
  const detunes = stringCount === 2 ? [-0.8, 0.65] : [-1.4, 0, 1.15];
  const partialCount = rootMidi < 60 ? 11 : 13;
  const inharmonicity = 0.00008 + ((rootMidi - 48) / 28) * 0.00008;
  const bodyFrequencies = [110, 220, 440, 880, 1760];
  let previousHammer = 0;

  const stringPhases = detunes.map(() => Array.from({ length: partialCount }, () => random() * Math.PI * 2));
  const stringPhaseOffsets = detunes.map(() => (random() - 0.5) * 0.16);

  for (let frame = 0; frame < frames; frame += 1) {
    const time = frame / sampleRate;
    const hammerEnvelope = Math.exp(-time * 72);
    const attack = 1 - Math.exp(-time * 2600);
    const bodyAttack = 1 - Math.exp(-time * 48);
    const noteBrightness = clamp(0.9 + (rootMidi - 60) * 0.012, 0.7, 1.15);
    let dryLeft = 0;
    let dryRight = 0;

    for (let stringIndex = 0; stringIndex < detunes.length; stringIndex += 1) {
      const pan = detunes.length === 2 ? (stringIndex === 0 ? -0.18 : 0.18) : (stringIndex - 1) * 0.18;
      const leftPan = 0.72 - pan * 0.4;
      const rightPan = 0.72 + pan * 0.4;
      const detuneRatio = 2 ** (detunes[stringIndex] / 1200);

      for (let partial = 1; partial <= partialCount; partial += 1) {
        const stretched = frequency * partial * Math.sqrt(1 + inharmonicity * partial * partial) * detuneRatio;
        const amplitude = Math.pow(partial, -1.22) * Math.exp(-(partial - 1) * 0.035) * noteBrightness;
        const partialDecay = (2.8 - partial * 0.14) * (rootMidi < 60 ? 1.15 : 1);
        const envelope = attack * Math.exp(-time / Math.max(partialDecay, 0.35));
        const phase = 2 * Math.PI * stretched * time + stringPhases[stringIndex][partial - 1] + stringPhaseOffsets[stringIndex] * partial;
        const sample = Math.sin(phase) * amplitude * envelope;
        dryLeft += sample * leftPan;
        dryRight += sample * rightPan;
      }
    }

    let hammerNoise = (random() * 2 - 1) * hammerEnvelope;
    hammerNoise = hammerNoise - previousHammer * 0.82;
    previousHammer = hammerNoise;

    let resonance = 0;
    for (let index = 0; index < bodyFrequencies.length; index += 1) {
      const bodyPhase = 2 * Math.PI * bodyFrequencies[index] * time + index * 0.61;
      resonance += Math.sin(bodyPhase) * Math.exp(-time / (2.8 - index * 0.32)) * 0.02;
    }

    const hammerAmount = hammerNoise * (0.16 + (rootMidi - 48) * 0.0025);
    left[frame] = dryLeft * 0.13 + hammerAmount * 0.65 + resonance * bodyAttack;
    right[frame] = dryRight * 0.13 + hammerAmount * 0.55 + resonance * bodyAttack * 0.92;
  }

  normalizeStereo(left, right, 0.9);
  return { left, right };
}

function createStringsSample(rootMidi) {
  const frequency = midiToFrequency(rootMidi);
  const durationSeconds = 4.6;
  const frames = Math.floor(durationSeconds * sampleRate);
  const left = new Float32Array(frames);
  const right = new Float32Array(frames);
  const random = createRandom(9000 + rootMidi * 23);
  const detunes = [-14, -7, -2, 4, 9, 15];
  const partialCount = 9;
  let previousNoise = 0;

  const phases = detunes.map(() => Array.from({ length: partialCount }, () => random() * Math.PI * 2));
  const vibratoOffsets = detunes.map(() => random() * Math.PI * 2);

  for (let frame = 0; frame < frames; frame += 1) {
    const time = frame / sampleRate;
    const attack = smoothStep(0, 0.22, time);
    const bloom = smoothStep(0.1, 0.65, time);
    const sustain = time < 3.55 ? 1 : Math.exp(-(time - 3.55) / 0.45);
    const envelope = attack * sustain;
    let sampleLeft = 0;
    let sampleRight = 0;

    for (let voiceIndex = 0; voiceIndex < detunes.length; voiceIndex += 1) {
      const detuneRatio = 2 ** (detunes[voiceIndex] / 1200);
      const pan = (voiceIndex - (detunes.length - 1) / 2) * 0.17;
      const leftPan = 0.7 - pan * 0.45;
      const rightPan = 0.7 + pan * 0.45;
      const vibratoDepth = 0.012 + voiceIndex * 0.0008;
      const vibrato = 1 + Math.sin(2 * Math.PI * (4.3 + voiceIndex * 0.09) * time + vibratoOffsets[voiceIndex]) * vibratoDepth * bloom;

      for (let partial = 1; partial <= partialCount; partial += 1) {
        const amplitude = Math.pow(partial, -1.06) * Math.exp(-(partial - 1) * 0.12);
        const phase = 2 * Math.PI * frequency * detuneRatio * vibrato * partial * time + phases[voiceIndex][partial - 1];
        const partialSample = Math.sin(phase) * amplitude * envelope;
        sampleLeft += partialSample * leftPan;
        sampleRight += partialSample * rightPan;
      }
    }

    let bowNoise = random() * 2 - 1;
    bowNoise = bowNoise * 0.12 + previousNoise * 0.88;
    previousNoise = bowNoise;
    const bowLayer = bowNoise * envelope * 0.12;

    const air = Math.sin(2 * Math.PI * frequency * 2 * time + 0.31) * envelope * 0.018;
    left[frame] = sampleLeft * 0.07 + bowLayer * 0.8 + air;
    right[frame] = sampleRight * 0.07 + bowLayer * 0.72 + air * 0.92;
  }

  normalizeStereo(left, right, 0.9);
  return { left, right };
}

async function writeSampleBank(name, roots, factory) {
  const dir = path.join(outDir, name);
  await mkdir(dir, { recursive: true });

  for (const rootMidi of roots) {
    const { left, right } = factory(rootMidi);
    const wav = writeWavBuffer(left, right, sampleRate);
    await writeFile(path.join(dir, `${rootMidi}.wav`), wav);
    console.log(`wrote ${name}/${rootMidi}.wav`);
  }
}

await writeSampleBank('piano', pianoRoots, createPianoSample);
await writeSampleBank('strings', stringsRoots, createStringsSample);
