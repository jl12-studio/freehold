import { describe, expect, it } from 'vitest';
import { publishedPosts, slugFromId } from '../src/lib/feed';

describe('slugFromId', () => {
  it('strips a leading YYYY-MM-DD- prefix', () => {
    expect(slugFromId('2026-10-20-named-it-freehold')).toBe('named-it-freehold');
  });

  it('leaves an id without a date prefix alone', () => {
    expect(slugFromId('named-it-freehold')).toBe('named-it-freehold');
  });
});

function post(id: string, date: string, draft = false) {
  return { id, data: { date: new Date(date), draft } };
}

describe('publishedPosts', () => {
  const older = post('2026-10-10-a-standard-not-apps', '2026-10-10');
  const newer = post('2026-10-20-named-it-freehold', '2026-10-20');
  const draft = post('2026-10-25-unfinished', '2026-10-25', true);

  it('leaves drafts out when drafts are not included', () => {
    expect(publishedPosts([older, draft, newer], false)).toEqual([newer, older]);
  });

  it('keeps drafts when they are included', () => {
    expect(publishedPosts([older, draft, newer], true).map((p) => p.id)).toEqual([draft.id, newer.id, older.id]);
  });

  it('lists the newest post first', () => {
    expect(publishedPosts([older, newer], false).map((p) => p.id)).toEqual([newer.id, older.id]);
  });

  it('breaks a date tie by id, descending', () => {
    const a = post('2026-10-20-a-first', '2026-10-20');
    const b = post('2026-10-20-b-second', '2026-10-20');
    expect(publishedPosts([a, b], false).map((p) => p.id)).toEqual([b.id, a.id]);
    expect(publishedPosts([b, a], false).map((p) => p.id)).toEqual([b.id, a.id]);
  });

  it('does not reorder or mutate the array it was given', () => {
    const input = [older, newer];
    publishedPosts(input, false);
    expect(input).toEqual([older, newer]);
  });
});
