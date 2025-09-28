import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Read input from Node.js
data = json.loads(sys.argv[1])
job_desc = data['job_description']
resumes = data['resumes']  # List of dicts: { "id": "...", "text": "..." }

# Combine job description with resumes for TF-IDF
documents = [job_desc] + [r['text'] for r in resumes]

vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(documents)

# Compute cosine similarity (job description vs resumes)
cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

# Attach similarity score to resumes
for i, r in enumerate(resumes):
    r['score'] = float(cosine_sim[i])

# Sort by score descending
resumes_sorted = sorted(resumes, key=lambda x: x['score'], reverse=True)

# Output as JSON
print(json.dumps(resumes_sorted))
