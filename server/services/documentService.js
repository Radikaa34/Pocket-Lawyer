import fs from 'node:fs/promises';
import path from 'node:path';

import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY
});

// -----------------------------------------
// DOCUMENT TEXT EXTRACTION
// -----------------------------------------

export async function extractText(
  filePath,
  mimeType,
  originalName
) {
  const buffer = await fs.readFile(filePath);

  const extension =
    path.extname(originalName).toLowerCase();

  if (
    mimeType === 'text/plain' ||
    extension === '.txt'
  ) {
    return buffer.toString('utf8');
  }

  if (
    mimeType === 'application/pdf' ||
    extension === '.pdf'
  ) {
    return (await pdfParse(buffer)).text;
  }

  if (
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    extension === '.docx'
  ) {
    return (
      await mammoth.extractRawText({ buffer })
    ).value;
  }

  if (
    mimeType === 'application/msword' ||
    extension === '.doc'
  ) {
    return buffer
      .toString('utf8')
      .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, ' ');
  }

  throw new Error('Unsupported document type.');
}

// -----------------------------------------
// FIND RELEVANT PASSAGES
// -----------------------------------------

function findRelevantPassages(question, text) {
  const clean = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return [];

  const stopwords = new Set([
    'what', 'when', 'where', 'which',
    'who', 'whom', 'whose', 'how',
    'does', 'did', 'can', 'could',
    'would', 'should', 'the', 'and',
    'for', 'with', 'from', 'this',
    'that', 'are', 'was', 'were',
    'your', 'about', 'is', 'a',
    'an', 'of', 'to', 'in',
    'on', 'be', 'it'
  ]);

  const words = question
    .toLowerCase()
    .split(/\W+/)
    .filter(
      word =>
        word.length > 2 &&
        !stopwords.has(word)
    );

  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);

  return sentences
    .map((sentence, index) => {
      const lower =
        sentence.toLowerCase();

      const score = words.reduce(
        (total, word) =>
          total +
          (lower.includes(word) ? 1 : 0),
        0
      );

      return {
        sentence,
        index,
        score
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// -----------------------------------------
// AI EXPLANATION
// -----------------------------------------

async function explainPassages(
  question,
  passages
) {
  const sourceText = passages
    .map(
      (item, index) =>
        `[Passage ${index + 1}]\n${item.sentence}`
    )
    .join('\n\n');

  const response =
    await openai.responses.create({
      model: 'gpt-5.6-luna',

      instructions: `
You are Pocket Lawyer, a legal document
question-answering assistant.

Answer the user's question using ONLY
the supplied document passages.

Rules:
- Do not summarize the entire document.
- Do not add information that is not present.
- Explain the relevant passage in simple language.
- Keep the answer concise.
- Preserve dates, amounts, names and conditions.
- Do not give legal advice.
- If the passages are insufficient, say so.
      `.trim(),

      input: `
Question:
${question}

Relevant document passages:
${sourceText}
      `.trim()
    });

  return response.output_text.trim();
}

// -----------------------------------------
// MAIN Q&A FUNCTION
// -----------------------------------------

export async function answerFromDocument(
  question,
  text
) {
  const clean = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) {
    return {
      answer:
        "I couldn't find enough information about that in this document.",
      sources: []
    };
  }

  const ranked =
    findRelevantPassages(
      question,
      clean
    );

  if (!ranked.length) {
    return {
      answer:
        "I couldn't find enough information about that in this document.",
      sources: []
    };
  }

  let answer;

  try {
    answer =
      await explainPassages(
        question,
        ranked
      );
  } catch (error) {
    console.error(
      'AI explanation failed:',
      error
    );

    answer = ranked
      .map(item => item.sentence)
      .join(' ');
  }

  return {
    answer,
    sources: ranked.map(item => ({
      section:
        `Document text · passage ${
          item.index + 1
        }`,
      text: item.sentence
    }))
  };
}