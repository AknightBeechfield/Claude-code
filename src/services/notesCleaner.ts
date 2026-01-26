/**
 * Notes Cleaner Service
 * Cleans raw meeting notes into a scan-friendly format with bold labels.
 */

// Common filler words and phrases to remove
const FILLER_PATTERNS: RegExp[] = [
  /\b(um|uh|like|you know|basically|actually|literally|just|so+|well|i mean|kind of|sort of|right)\b/gi,
  /\b(i think|i guess|i believe|maybe|perhaps|probably)\s+that\b/gi,
  /\b(very|really|extremely|totally|absolutely|definitely|certainly)\b/gi,
  /^\s*(okay|ok|alright|so|well|anyway|anyways)[,.]?\s*/gim,
];

// Common label patterns to detect
const LABEL_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\b(action items?|actions?|tasks?|todos?|to-?dos?)\b[:\s-]*/i, label: 'Action Item' },
  { pattern: /\b(decisions?|decided|we decided|agreed)\b[:\s-]*/i, label: 'Decision' },
  { pattern: /\b(next steps?)\b[:\s-]*/i, label: 'Next Step' },
  { pattern: /\b(follow[- ]?ups?)\b[:\s-]*/i, label: 'Follow-up' },
  { pattern: /\b(questions?|ask|asked)\b[:\s-]*/i, label: 'Question' },
  { pattern: /\b(notes?|discussed|discussion)\b[:\s-]*/i, label: 'Note' },
  { pattern: /\b(blockers?|blocked|blocking)\b[:\s-]*/i, label: 'Blocker' },
  { pattern: /\b(deadlines?|due dates?|due by)\b[:\s-]*/i, label: 'Deadline' },
  { pattern: /\b(attendees?|participants?|present)\b[:\s-]*/i, label: 'Attendee' },
  { pattern: /\b(agenda|topics?)\b[:\s-]*/i, label: 'Agenda' },
  { pattern: /\b(updates?|status)\b[:\s-]*/i, label: 'Update' },
  { pattern: /\b(ideas?|suggestions?|proposals?)\b[:\s-]*/i, label: 'Idea' },
  { pattern: /\b(risks?|concerns?|issues?)\b[:\s-]*/i, label: 'Risk' },
  { pattern: /\b(owners?|assigned to|responsible)\b[:\s-]*/i, label: 'Owner' },
];

// Keywords that help infer labels when no explicit label is found
const INFERENCE_KEYWORDS: { keywords: string[]; label: string }[] = [
  { keywords: ['will', 'need to', 'should', 'must', 'has to', 'going to'], label: 'Action Item' },
  { keywords: ['agreed', 'decided', 'confirmed', 'approved'], label: 'Decision' },
  { keywords: ['?', 'how', 'what', 'why', 'when', 'where', 'who'], label: 'Question' },
  { keywords: ['blocked', 'stuck', 'waiting', 'delayed'], label: 'Blocker' },
  { keywords: ['by', 'deadline', 'due'], label: 'Deadline' },
];

export interface CleanedNote {
  label: string;
  content: string;
}

export interface CleanNotesResult {
  notes: CleanedNote[];
  formatted: string;
}

/**
 * Removes filler words and phrases from text
 */
export function removeFiller(text: string): string {
  let cleaned = text;
  for (const pattern of FILLER_PATTERNS) {
    cleaned = cleaned.replace(pattern, ' ');
  }
  // Clean up orphaned punctuation (commas, periods left after removing words)
  cleaned = cleaned.replace(/\s*,\s*,\s*/g, ', '); // multiple commas
  cleaned = cleaned.replace(/^\s*[,.:;]\s*/g, ''); // leading punctuation
  cleaned = cleaned.replace(/\s+[,]\s+/g, ' '); // orphaned commas
  cleaned = cleaned.replace(/,\s*$/g, ''); // trailing comma
  // Clean up extra whitespace
  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Detects and extracts an explicit label from the beginning of a line
 */
export function detectExplicitLabel(text: string): { label: string | null; content: string } {
  for (const { pattern, label } of LABEL_PATTERNS) {
    const match = text.match(pattern);
    if (match && match.index !== undefined && match.index < 20) {
      // Label should be near the start
      const content = text.replace(pattern, '').trim();
      return { label, content };
    }
  }
  return { label: null, content: text };
}

/**
 * Infers a label based on content keywords when no explicit label is found
 */
export function inferLabel(text: string): string {
  const lowerText = text.toLowerCase();

  for (const { keywords, label } of INFERENCE_KEYWORDS) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return label;
      }
    }
  }

  return 'Note'; // Default label
}

/**
 * Normalizes text for comparison (lowercase, remove punctuation, trim)
 */
function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Gets unique meaningful words from text (filters out common stop words)
 */
function getWords(text: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'to', 'of', 'in', 'on', 'at', 'for', 'is', 'are', 'was', 'were']);
  return normalizeForComparison(text)
    .split(/\s+/)
    .filter((w) => w.length > 0 && !stopWords.has(w));
}

/**
 * Checks if two words are similar (same or share common root)
 */
function wordsAreSimilar(word1: string, word2: string): boolean {
  if (word1 === word2) return true;
  if (word1.startsWith(word2) || word2.startsWith(word1)) return true;
  // Check for common prefix of at least 3 characters (e.g., docs/documentation)
  const minLen = Math.min(word1.length, word2.length);
  if (minLen >= 3) {
    const prefix1 = word1.substring(0, 3);
    const prefix2 = word2.substring(0, 3);
    if (prefix1 === prefix2) return true;
  }
  return false;
}

/**
 * Checks if two notes are duplicates (similar enough to merge)
 */
export function areDuplicates(note1: string, note2: string): boolean {
  const norm1 = normalizeForComparison(note1);
  const norm2 = normalizeForComparison(note2);

  if (norm1 === norm2) return true;

  // Check if one contains the other (subset)
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    const shorter = norm1.length < norm2.length ? norm1 : norm2;
    const longer = norm1.length >= norm2.length ? norm1 : norm2;
    return shorter.length / longer.length > 0.5;
  }

  // Check word-based similarity (for cases like "update docs" vs "update documentation")
  const words1 = getWords(note1);
  const words2 = getWords(note2);

  if (words1.length === 0 || words2.length === 0) return false;

  const smaller = words1.length <= words2.length ? words1 : words2;
  const larger = words1.length > words2.length ? words1 : words2;

  // Count how many words from the smaller set have a similar word in the larger set
  let matchCount = 0;
  for (const word of smaller) {
    for (const w of larger) {
      if (wordsAreSimilar(word, w)) {
        matchCount++;
        break;
      }
    }
  }

  // If most words from smaller set match, consider duplicates
  return matchCount >= smaller.length * 0.8;
}

/**
 * Merges duplicate notes, keeping the more complete version
 */
export function mergeDuplicates(notes: CleanedNote[]): CleanedNote[] {
  const merged: CleanedNote[] = [];

  for (const note of notes) {
    let isDuplicate = false;

    for (let i = 0; i < merged.length; i++) {
      if (merged[i].label === note.label && areDuplicates(merged[i].content, note.content)) {
        // Keep the longer/more complete version
        if (note.content.length > merged[i].content.length) {
          merged[i] = note;
        }
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      merged.push(note);
    }
  }

  return merged;
}

/**
 * Parses raw text into individual lines/items
 */
export function parseLines(rawText: string): string[] {
  return rawText
    .split(/[\n\r]+/)
    .map((line) => line.replace(/^[\s\-\*\•\d.]+/, '').trim())
    .filter((line) => line.length > 0);
}

/**
 * Formats a cleaned note with bold label
 */
export function formatNote(note: CleanedNote): string {
  // Capitalize first letter of content
  const content =
    note.content.charAt(0).toUpperCase() + note.content.slice(1);
  // Ensure content ends with punctuation
  const ending = /[.!?]$/.test(content) ? '' : '.';
  return `**${note.label}:** ${content}${ending}`;
}

/**
 * Main function to clean meeting notes
 */
export function cleanNotes(rawNotes: string): CleanNotesResult {
  if (!rawNotes || typeof rawNotes !== 'string') {
    return { notes: [], formatted: '' };
  }

  const lines = parseLines(rawNotes);
  const processedNotes: CleanedNote[] = [];

  for (const line of lines) {
    // Remove filler words
    const cleanedText = removeFiller(line);

    if (cleanedText.length < 3) continue; // Skip very short lines

    // Try to detect explicit label
    const { label: explicitLabel, content } = detectExplicitLabel(cleanedText);

    // Use explicit label or infer one
    const label = explicitLabel || inferLabel(content);
    const finalContent = content || cleanedText;

    processedNotes.push({ label, content: finalContent });
  }

  // Merge duplicates
  const mergedNotes = mergeDuplicates(processedNotes);

  // Format output
  const formatted = mergedNotes.map(formatNote).join('\n');

  return {
    notes: mergedNotes,
    formatted,
  };
}
