import request from 'supertest';
import app from '../src/server';

// Add supertest to dev dependencies
// Note: This test file requires supertest to be installed

describe('API Routes', () => {
  describe('POST /api/notes/clean', () => {
    it('returns cleaned notes for valid input', async () => {
      const response = await request(app)
        .post('/api/notes/clean')
        .send({ notes: 'Action item: Update the documentation' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.formatted).toContain('**Action Item:**');
      expect(response.body.data.notes).toHaveLength(1);
      expect(response.body.data.stats).toBeDefined();
    });

    it('returns 400 for missing notes field', async () => {
      const response = await request(app)
        .post('/api/notes/clean')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('returns 400 for empty notes', async () => {
      const response = await request(app)
        .post('/api/notes/clean')
        .send({ notes: '   ' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('empty');
    });

    it('returns 400 for non-string notes', async () => {
      const response = await request(app)
        .post('/api/notes/clean')
        .send({ notes: 12345 })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('string');
    });

    it('returns 400 for notes exceeding max length', async () => {
      const longNotes = 'a'.repeat(60000);
      const response = await request(app)
        .post('/api/notes/clean')
        .send({ notes: longNotes })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('maximum length');
    });

    it('returns stats with the response', async () => {
      const response = await request(app)
        .post('/api/notes/clean')
        .send({ notes: 'Action item: do something\nDecision: use TypeScript' })
        .expect(200);

      expect(response.body.data.stats.inputLength).toBeGreaterThan(0);
      expect(response.body.data.stats.outputLength).toBeGreaterThan(0);
      expect(response.body.data.stats.itemCount).toBe(2);
    });
  });

  describe('GET /api/notes/health', () => {
    it('returns health status', async () => {
      const response = await request(app)
        .get('/api/notes/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('ok');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('404 handling', () => {
    it('returns 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('Not found');
    });
  });
});
