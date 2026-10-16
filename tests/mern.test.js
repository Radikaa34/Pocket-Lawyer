import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { answerFromDocument } from '../server/services/documentService.js';

test('bcrypt hashes passwords instead of storing plaintext', async () => { const hash = await bcrypt.hash('correct horse battery staple', 4); assert.notEqual(hash, 'correct horse battery staple'); assert.equal(await bcrypt.compare('correct horse battery staple', hash), true); });
test('document Q&A refuses to invent information absent from the document', () => { const result = answerFromDocument('What is the notice period?', 'The agreement names the parties and starts on 1 January.'); assert.match(result.answer, /couldn't find enough information/i); assert.equal(result.sources.length, 0); });
test('document Q&A returns matched passages as sources', () => { const result = answerFromDocument('What is the notice period?', 'The notice period is thirty days. Payment is due monthly.'); assert.match(result.answer, /thirty days/i); assert.equal(result.sources.length, 1); });
