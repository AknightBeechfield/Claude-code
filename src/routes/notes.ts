import { Router, Request, Response } from 'express';
import { cleanNotes } from '../services/notesCleaner';

const router = Router();

// Input validation constants
const MAX_INPUT_LENGTH = 50000; // 50KB max
const MIN_INPUT_LENGTH = 1;

interface CleanNotesRequest {
  notes: string;
}

interface ValidationError {
  error: string;
  field: string;
}

/**
 * Validates the input notes
 */
function validateInput(body: unknown): ValidationError | null {
  if (!body || typeof body !== 'object') {
    return { error: 'Request body must be a JSON object', field: 'body' };
  }

  const { notes } = body as CleanNotesRequest;

  if (notes === undefined || notes === null) {
    return { error: 'Notes field is required', field: 'notes' };
  }

  if (typeof notes !== 'string') {
    return { error: 'Notes must be a string', field: 'notes' };
  }

  if (notes.trim().length < MIN_INPUT_LENGTH) {
    return { error: 'Notes cannot be empty', field: 'notes' };
  }

  if (notes.length > MAX_INPUT_LENGTH) {
    return {
      error: `Notes exceed maximum length of ${MAX_INPUT_LENGTH} characters`,
      field: 'notes',
    };
  }

  return null;
}

/**
 * POST /api/notes/clean
 * Cleans raw meeting notes and returns formatted output
 */
router.post('/clean', (req: Request, res: Response) => {
  const validationError = validateInput(req.body);

  if (validationError) {
    return res.status(400).json({
      success: false,
      error: validationError.error,
      field: validationError.field,
    });
  }

  const { notes } = req.body as CleanNotesRequest;

  try {
    const result = cleanNotes(notes);

    return res.json({
      success: true,
      data: {
        formatted: result.formatted,
        notes: result.notes,
        stats: {
          inputLength: notes.length,
          outputLength: result.formatted.length,
          itemCount: result.notes.length,
        },
      },
    });
  } catch (error) {
    console.error('Error cleaning notes:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while processing notes',
    });
  }
});

/**
 * GET /api/notes/health
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
