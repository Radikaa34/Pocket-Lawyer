import LegalTopic from '../models/LegalTopic.js';
export async function listTopics(req, res) { const filter = req.query.category && req.query.category !== 'All' ? { category: req.query.category } : {}; res.json(await LegalTopic.find(filter).sort({ title: 1 })); }
export async function getTopic(req, res) { const topic = await LegalTopic.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] }); if (!topic) return res.status(404).json({ message: 'Topic not found.' }); res.json(topic); }
export async function searchTopics(req, res) {
  const q = String(req.query.q || '').trim();

  if (q.length < 2) {
    return res.status(400).json({
      message: 'Search query must be at least two characters.'
    });
  }

  // Words that usually don't help identify a legal topic
  const stopWords = new Set([
    'i', 'me', 'my', 'mine', 'we', 'our', 'the', 'a', 'an',
    'is', 'am', 'are', 'was', 'were', 'has', 'have', 'had',
    'been', 'being', 'to', 'for', 'of', 'in', 'on', 'at',
    'with', 'and', 'or', 'but', 'this', 'that', 'it',
    'they', 'them', 'their', 'he', 'she', 'his', 'her',
    'can', 'could', 'would', 'should', 'do', 'does', 'did',
    'not', 'no', 'what', 'how', 'why', 'when', 'where',
    'who', 'want', 'need', 'please', 'about'
  ]);

  // Convert situation into useful keywords
  const words = q
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= 3 && !stopWords.has(word));

  if (!words.length) {
    return res.json([]);
  }

  // Related legal words
  const synonyms = {
    salary: ['salary', 'wage', 'wages', 'pay', 'payment', 'income'],
    unpaid: ['unpaid', 'nonpayment', 'withheld', 'withholding', 'pending'],
    employer: ['employer', 'company', 'boss', 'workplace'],
    employee: ['employee', 'worker', 'staff'],
    fired: ['fired', 'terminated', 'termination', 'dismissed'],
    landlord: ['landlord', 'owner', 'property owner'],
    tenant: ['tenant', 'renter'],
    deposit: ['deposit', 'security deposit', 'advance'],
    rent: ['rent', 'rental', 'lease'],
    fraud: ['fraud', 'scam', 'cheating', 'deception'],
    money: ['money', 'payment', 'amount', 'funds'],
    harassment: ['harassment', 'abuse', 'bullying'],
    contract: ['contract', 'agreement', 'terms'],
    refund: ['refund', 'return', 'reimbursement'],
    online: ['online', 'internet', 'digital', 'cyber']
  };

  // Expand words using synonyms
  const searchTerms = new Set(words);

  for (const word of words) {
    if (synonyms[word]) {
      synonyms[word].forEach(term => searchTerms.add(term));
    }
  }

  const terms = [...searchTerms];

  // Find topics containing at least one relevant term
  const regexConditions = terms.flatMap(term => {
    const regex = new RegExp(
      term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i'
    );

    return [
      { title: regex },
      { category: regex },
      { description: regex },
      { tags: regex },
      { content: regex }
    ];
  });

  const topics = await LegalTopic.find({
    $or: regexConditions
  });

  // Rank topics based on how many terms they match
  const rankedTopics = topics
    .map(topic => {
      const searchableText = [
        topic.title,
        topic.category,
        topic.description,
        ...(topic.tags || []),
        topic.content
      ]
        .join(' ')
        .toLowerCase();

      let score = 0;

      for (const word of words) {
        if (searchableText.includes(word)) {
          score += 2;
        }
      }

      // Give extra importance to title matches
      const title = topic.title.toLowerCase();

      for (const word of words) {
        if (title.includes(word)) {
          score += 5;
        }
      }

      // Give synonym matches a smaller score
      for (const term of terms) {
        if (!words.includes(term) && searchableText.includes(term)) {
          score += 1;
        }
      }

      return {
        topic,
        score
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.topic);

  res.json(rankedTopics);
}
export async function createTopic(req, res) { const data = req.body; if (!data.title || !data.category || !data.description || !data.content) return res.status(400).json({ message: 'Title, category, description, and content are required.' }); const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); res.status(201).json(await LegalTopic.create({ ...data, slug, tags: Array.isArray(data.tags) ? data.tags : String(data.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean) })); }
export async function updateTopic(req, res) { const topic = await LegalTopic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!topic) return res.status(404).json({ message: 'Topic not found.' }); res.json(topic); }
export async function deleteTopic(req, res) { const topic = await LegalTopic.findByIdAndDelete(req.params.id); if (!topic) return res.status(404).json({ message: 'Topic not found.' }); res.json({ success: true }); }
