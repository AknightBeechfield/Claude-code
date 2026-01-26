import {
  removeFiller,
  detectExplicitLabel,
  inferLabel,
  areDuplicates,
  mergeDuplicates,
  parseLines,
  formatNote,
  cleanNotes,
  CleanedNote,
} from '../src/services/notesCleaner';

describe('removeFiller', () => {
  it('removes common filler words', () => {
    expect(removeFiller('um, so basically the API is ready')).toBe('the API is ready');
    expect(removeFiller('like, you know, it works')).toBe('it works');
    expect(removeFiller('I mean, actually, this is fine')).toBe('this is fine');
  });

  it('removes multiple filler words', () => {
    expect(removeFiller('well, um, so basically I think that we should')).toBe('we should');
  });

  it('preserves meaningful content', () => {
    expect(removeFiller('The API endpoint returns JSON')).toBe('The API endpoint returns JSON');
  });

  it('handles empty string', () => {
    expect(removeFiller('')).toBe('');
  });

  it('cleans up extra whitespace', () => {
    expect(removeFiller('um   the   API')).toBe('the API');
  });
});

describe('detectExplicitLabel', () => {
  it('detects action item label', () => {
    const result = detectExplicitLabel('Action item: Update the docs');
    expect(result.label).toBe('Action Item');
    expect(result.content).toBe('Update the docs');
  });

  it('detects decision label', () => {
    const result = detectExplicitLabel('Decision: We will use TypeScript');
    expect(result.label).toBe('Decision');
    expect(result.content).toBe('We will use TypeScript');
  });

  it('detects question label', () => {
    const result = detectExplicitLabel('Question: When is the deadline?');
    expect(result.label).toBe('Question');
    expect(result.content).toBe('When is the deadline?');
  });

  it('detects blocker label', () => {
    const result = detectExplicitLabel('Blocker: Waiting on design approval');
    expect(result.label).toBe('Blocker');
    expect(result.content).toBe('Waiting on design approval');
  });

  it('returns null label when no explicit label found', () => {
    const result = detectExplicitLabel('We need to ship this soon');
    expect(result.label).toBeNull();
    expect(result.content).toBe('We need to ship this soon');
  });

  it('handles various label formats', () => {
    expect(detectExplicitLabel('TODO - fix the bug').label).toBe('Action Item');
    expect(detectExplicitLabel('task: write tests').label).toBe('Action Item');
    expect(detectExplicitLabel('follow-up: check status').label).toBe('Follow-up');
  });
});

describe('inferLabel', () => {
  it('infers Action Item from "will" keyword', () => {
    expect(inferLabel('John will update the documentation')).toBe('Action Item');
  });

  it('infers Action Item from "need to" keyword', () => {
    expect(inferLabel('We need to fix the bug')).toBe('Action Item');
  });

  it('infers Decision from "agreed" keyword', () => {
    expect(inferLabel('Team agreed to use React')).toBe('Decision');
  });

  it('infers Question from question mark', () => {
    expect(inferLabel('What is the timeline?')).toBe('Question');
  });

  it('infers Blocker from "blocked" keyword', () => {
    expect(inferLabel('Currently blocked on API access')).toBe('Blocker');
  });

  it('defaults to Note when no keywords match', () => {
    expect(inferLabel('The meeting went well')).toBe('Note');
  });
});

describe('areDuplicates', () => {
  it('identifies exact duplicates', () => {
    expect(areDuplicates('Update the docs', 'Update the docs')).toBe(true);
  });

  it('identifies duplicates with different casing', () => {
    expect(areDuplicates('Update the docs', 'update the docs')).toBe(true);
  });

  it('identifies duplicates with different punctuation', () => {
    expect(areDuplicates('Update the docs.', 'Update the docs')).toBe(true);
  });

  it('identifies subset duplicates', () => {
    expect(areDuplicates('Update docs', 'Update the documentation')).toBe(true);
  });

  it('rejects non-duplicates', () => {
    expect(areDuplicates('Update the docs', 'Fix the bug')).toBe(false);
  });
});

describe('mergeDuplicates', () => {
  it('merges duplicate notes', () => {
    const notes: CleanedNote[] = [
      { label: 'Action Item', content: 'Update docs' },
      { label: 'Action Item', content: 'Update the documentation' },
    ];
    const merged = mergeDuplicates(notes);
    expect(merged).toHaveLength(1);
    expect(merged[0].content).toBe('Update the documentation');
  });

  it('keeps notes with different labels', () => {
    const notes: CleanedNote[] = [
      { label: 'Action Item', content: 'Update docs' },
      { label: 'Note', content: 'Update docs' },
    ];
    const merged = mergeDuplicates(notes);
    expect(merged).toHaveLength(2);
  });

  it('does not merge different notes', () => {
    const notes: CleanedNote[] = [
      { label: 'Action Item', content: 'Update docs' },
      { label: 'Action Item', content: 'Fix the bug' },
    ];
    const merged = mergeDuplicates(notes);
    expect(merged).toHaveLength(2);
  });
});

describe('parseLines', () => {
  it('splits text by newlines', () => {
    expect(parseLines('line 1\nline 2\nline 3')).toEqual(['line 1', 'line 2', 'line 3']);
  });

  it('removes bullet points and dashes', () => {
    expect(parseLines('- item 1\n* item 2\n• item 3')).toEqual(['item 1', 'item 2', 'item 3']);
  });

  it('removes numbered lists', () => {
    expect(parseLines('1. item 1\n2. item 2')).toEqual(['item 1', 'item 2']);
  });

  it('filters empty lines', () => {
    expect(parseLines('line 1\n\nline 2')).toEqual(['line 1', 'line 2']);
  });

  it('trims whitespace', () => {
    expect(parseLines('  line 1  \n  line 2  ')).toEqual(['line 1', 'line 2']);
  });
});

describe('formatNote', () => {
  it('formats note with bold label', () => {
    const note: CleanedNote = { label: 'Action Item', content: 'update the docs' };
    expect(formatNote(note)).toBe('**Action Item:** Update the docs.');
  });

  it('capitalizes first letter of content', () => {
    const note: CleanedNote = { label: 'Note', content: 'the meeting was good' };
    expect(formatNote(note)).toBe('**Note:** The meeting was good.');
  });

  it('does not add extra period if content already ends with punctuation', () => {
    const note: CleanedNote = { label: 'Question', content: 'when is the deadline?' };
    expect(formatNote(note)).toBe('**Question:** When is the deadline?');
  });
});

describe('cleanNotes', () => {
  it('cleans and formats raw notes', () => {
    const rawNotes = `
      - um, action item: John will update the docs
      - Decision: We agreed to use TypeScript
      - basically the API is working
    `;
    const result = cleanNotes(rawNotes);

    expect(result.notes).toHaveLength(3);
    expect(result.formatted).toContain('**Action Item:**');
    expect(result.formatted).toContain('**Decision:**');
    expect(result.formatted).not.toContain('um');
    expect(result.formatted).not.toContain('basically');
  });

  it('handles empty input', () => {
    const result = cleanNotes('');
    expect(result.notes).toHaveLength(0);
    expect(result.formatted).toBe('');
  });

  it('handles null/undefined input', () => {
    expect(cleanNotes(null as any).notes).toHaveLength(0);
    expect(cleanNotes(undefined as any).notes).toHaveLength(0);
  });

  it('merges duplicate items', () => {
    const rawNotes = `
      - John will update the docs
      - John will update documentation
    `;
    const result = cleanNotes(rawNotes);
    expect(result.notes).toHaveLength(1);
  });

  it('infers labels when not explicit', () => {
    const rawNotes = 'We need to ship this by Friday';
    const result = cleanNotes(rawNotes);
    expect(result.notes[0].label).toBe('Action Item');
  });

  it('preserves explicit labels', () => {
    const rawNotes = 'Blocker: waiting on design approval';
    const result = cleanNotes(rawNotes);
    expect(result.notes[0].label).toBe('Blocker');
  });

  it('skips very short lines', () => {
    const rawNotes = 'ok\nThis is a real note';
    const result = cleanNotes(rawNotes);
    expect(result.notes).toHaveLength(1);
  });
});
