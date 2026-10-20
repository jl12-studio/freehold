import { describe, expect, it } from 'vitest';
import { formatLogDate, latestLogDate } from '../src/lib/log-date';

describe('latestLogDate', () => {
  it('returns the greatest bold-leading date, counting a parenthetical entry as its date', () => {
    const md = [
      '# Title',
      '',
      '## Log',
      '',
      '- **2026-07-30 (second capture)**: later in the day.',
      '- **2026-07-29**: Founding capture.',
      '- **2026-10-20**: **Named it.** Mentions 2026-12-31 in prose.',
      '- **2026-10-10**: First public articulation.',
      '',
    ].join('\n');
    expect(latestLogDate(md)).toBe('2026-10-20');
  });

  it('picks the parenthetical entry when it is the greatest', () => {
    const md = '## Log\n\n- **2026-07-29**: a\n- **2026-07-30 (second capture)**: b\n';
    expect(latestLogDate(md)).toBe('2026-07-30');
  });

  it('returns null when there is no Log section', () => {
    expect(latestLogDate('# Title\n\n## Other\n\n- **2026-10-20**: not a log.\n')).toBeNull();
  });

  it('ignores dated items that come before the Log heading', () => {
    const md = '## Notes\n\n- **2030-01-01**: x\n\n## Log\n\n- **2026-10-20**: y\n';
    expect(latestLogDate(md)).toBe('2026-10-20');
  });

  it('returns null when the Log has no dated items', () => {
    expect(latestLogDate('## Log\n\n- nothing yet\n')).toBeNull();
  });
});

describe('formatLogDate', () => {
  it('formats as day month year in English regardless of runtime locale', () => {
    expect(formatLogDate('2026-10-20')).toBe('20 October 2026');
    expect(formatLogDate('2026-07-05')).toBe('5 July 2026');
  });
});
