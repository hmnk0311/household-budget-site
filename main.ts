// Kakeibo Ledger — hand-in program (Node 22, standard library only).
//
// The site itself lives in app/ as plain static files (HTML, CSS and ES
// modules, no build step, nothing fetched over the network). This program
// copies app/ and screenshots/ into the output directory and writes
// dossier.json there with buildDossier from vendor/makefun-frontend.ts,
// exactly the summary the judge reads: the screenshots, the first load's
// files and bytes, and an outline of the source.
//
// Run it the way the grader does, or locally with an output override:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });

mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The caps below mirror the sealed scorer's own limits, so a hand-in this
// program writes is one the scorer can accept: at most 4 screenshots of
// 256 KiB each, at most 993 files and 16 MiB under app/, and the dossier
// text capped at 160 KiB. buildDossier refuses anything past them.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
