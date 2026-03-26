import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const defaultVpoRoot = '/Users/a58/Downloads/Virtual-Playing-Orchestra3/Virtual-Playing-Orchestra3';
const vpoRoot = process.env.VPO_ROOT || defaultVpoRoot;
const targetRoot = path.join(repoRoot, 'src', 'audio', 'samples', 'vpo');
const catalogFile = path.join(repoRoot, 'src', 'audio', 'vpoCatalog.ts');

const instrumentConfigs = [
  {
    exportName: 'vpoCelloSoloSustainSamples',
    instrumentId: 'vpo-cello-solo-sustain',
    sampleDir: 'cello-solo-sustain',
    sfzPath: 'Strings/cello-SOLO-sustain.sfz',
  },
  {
    exportName: 'vpoFluteSoloSustainSamples',
    instrumentId: 'vpo-flute-solo-sustain',
    sampleDir: 'flute-solo-sustain',
    sfzPath: 'Woodwinds/flute-SOLO-sustain.sfz',
  },
];

const NOTE_OFFSETS = {
  c: 0,
  'c#': 1,
  db: 1,
  d: 2,
  'd#': 3,
  eb: 3,
  e: 4,
  f: 5,
  'f#': 6,
  gb: 6,
  g: 7,
  'g#': 8,
  ab: 8,
  a: 9,
  'a#': 10,
  bb: 10,
  b: 11,
};

function parseMidiNote(value) {
  if (/^-?\d+$/.test(value)) {
    return Number.parseInt(value, 10);
  }

  const match = value.trim().toLowerCase().match(/^([a-g](?:#|b)?)(-?\d+)$/);
  if (!match) {
    throw new Error(`Unsupported pitch_keycenter value: ${value}`);
  }

  const [, noteName, octaveValue] = match;
  const noteOffset = NOTE_OFFSETS[noteName];
  if (noteOffset == null) {
    throw new Error(`Unsupported note name: ${noteName}`);
  }

  return (Number.parseInt(octaveValue, 10) + 1) * 12 + noteOffset;
}

function parseAssignments(line) {
  return [...line.matchAll(/([A-Za-z0-9_]+)=([^\s]+)/g)].map(([, key, value]) => [key, value]);
}

function parseSfzRegions(sourceText) {
  const lines = sourceText.replace(/\r/g, '').split('\n');
  const regions = [];
  let currentGroup = {};
  let currentRegion = null;

  const flushRegion = () => {
    if (!currentRegion?.sample || !currentRegion.pitch_keycenter) {
      currentRegion = null;
      return;
    }

    if ((currentRegion.trigger || 'attack') === 'release') {
      currentRegion = null;
      return;
    }

    regions.push({
      sample: currentRegion.sample,
      rootNote: parseMidiNote(currentRegion.pitch_keycenter),
    });
    currentRegion = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.split('//')[0].trim();
    if (!line) {
      continue;
    }

    if (line.startsWith('<group>')) {
      flushRegion();
      currentGroup = Object.fromEntries(parseAssignments(line.slice('<group>'.length)));
      continue;
    }

    if (line.startsWith('<region>')) {
      flushRegion();
      currentRegion = {
        ...currentGroup,
        ...Object.fromEntries(parseAssignments(line.slice('<region>'.length))),
      };
      continue;
    }

    const assignments = Object.fromEntries(parseAssignments(line));
    if (!Object.keys(assignments).length) {
      continue;
    }

    if (currentRegion) {
      Object.assign(currentRegion, assignments);
    } else {
      Object.assign(currentGroup, assignments);
    }
  }

  flushRegion();
  return regions;
}

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

async function importInstrument(config) {
  const sfzAbsolutePath = path.join(vpoRoot, config.sfzPath);
  const sfzContent = await readFile(sfzAbsolutePath, 'utf8');
  const regions = parseSfzRegions(sfzContent);
  const outputDir = path.join(targetRoot, config.sampleDir);
  await mkdir(outputDir, { recursive: true });

  const samples = [];
  for (const region of regions) {
    const sourceSamplePath = path.resolve(path.dirname(sfzAbsolutePath), region.sample.replaceAll('\\', path.sep));
    const targetFileName = path.basename(sourceSamplePath);
    const targetSamplePath = path.join(outputDir, targetFileName);
    await copyFile(sourceSamplePath, targetSamplePath);
    samples.push({
      rootNote: region.rootNote,
      relativePath: toPosixPath(path.join('samples', 'vpo', config.sampleDir, targetFileName)),
    });
  }

  return samples;
}

function renderCatalog(importedInstruments) {
  const sections = importedInstruments.map(({ exportName, samples }) => {
    const body = samples
      .map(
        (sample) => `  { rootNote: ${sample.rootNote}, url: new URL('./${sample.relativePath}', import.meta.url).href },`,
      )
      .join('\n');

    return `export const ${exportName} = [\n${body}\n];`;
  });

  return `${sections.join('\n\n')}\n`;
}

const importedInstruments = [];
for (const config of instrumentConfigs) {
  const samples = await importInstrument(config);
  importedInstruments.push({ exportName: config.exportName, samples });
  console.log(`Imported ${config.instrumentId} with ${samples.length} samples`);
}

await writeFile(catalogFile, renderCatalog(importedInstruments));
console.log(`Wrote ${path.relative(repoRoot, catalogFile)}`);
