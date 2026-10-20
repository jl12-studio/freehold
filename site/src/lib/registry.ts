import { STANDARD_POINTS } from './standard';

export type EntryStatus = 'planned' | 'building' | 'certified';
export type EntryStage = 'desktop' | 'cloud' | 'mobile';
export type PointResult = 'pass' | 'not-yet' | 'n/a';

/** The validated YAML record of one registry entry (see the `registry` collection schema). */
export interface RegistryData {
  name: string;
  oneLine: string;
  status: EntryStatus;
  stage: EntryStage;
  repo?: string;
  homepage?: string;
  maintainer: { name: string; url?: string };
  updated: Date;
  standard: Array<{ point: number; status: PointResult; evidence?: string; note?: string }>;
}

/** A registry collection entry: `id` is the slug (the YAML file name without its extension). */
export interface RegistryEntry {
  id: string;
  data: RegistryData;
}

export interface PassCount {
  pass: number;
  notYet: number;
  na: number;
}

/** Tally an entry's checklist. Accepts a collection entry or its data. */
export function passCount(entry: RegistryData | RegistryEntry): PassCount {
  const { standard } = 'data' in entry ? entry.data : entry;
  const count: PassCount = { pass: 0, notYet: 0, na: 0 };
  for (const row of standard) {
    if (row.status === 'pass') count.pass += 1;
    else if (row.status === 'not-yet') count.notYet += 1;
    else count.na += 1;
  }
  return count;
}

export interface RegistryJsonRow {
  point: number;
  title: string;
  status: PointResult;
  evidence?: string;
  note?: string;
}

export interface RegistryJsonEntry {
  slug: string;
  name: string;
  oneLine: string;
  status: EntryStatus;
  stage: EntryStage;
  repo?: string;
  homepage?: string;
  maintainer: { name: string; url?: string };
  updated: string;
  url: string;
  standard: RegistryJsonRow[];
}

export interface RegistryJson {
  schema: string;
  standard: string;
  generated: string;
  entries: RegistryJsonEntry[];
}

const titleFor = new Map(STANDARD_POINTS.map((p) => [p.point, p.title]));

/** The machine-readable registry: the same list the marketplace renders, for agents and other registries. */
export function toRegistryJson(entries: ReadonlyArray<RegistryEntry>, siteUrl: string, generated: Date): RegistryJson {
  const sorted = [...entries].sort((a, b) => a.data.name.localeCompare(b.data.name, 'en'));
  return {
    schema: 'https://freeholders.org/registry.json#v1',
    standard: `${siteUrl}/standard`,
    generated: generated.toISOString(),
    entries: sorted.map(({ id, data }) => ({
      slug: id,
      name: data.name,
      oneLine: data.oneLine,
      status: data.status,
      stage: data.stage,
      ...(data.repo ? { repo: data.repo } : {}),
      ...(data.homepage ? { homepage: data.homepage } : {}),
      maintainer: data.maintainer,
      updated: data.updated.toISOString().slice(0, 10),
      url: `${siteUrl}/marketplace/${id}/`,
      standard: data.standard.map((row) => ({
        point: row.point,
        title: titleFor.get(row.point) ?? '',
        status: row.status,
        ...(row.evidence ? { evidence: row.evidence } : {}),
        ...(row.note ? { note: row.note } : {}),
      })),
    })),
  };
}
