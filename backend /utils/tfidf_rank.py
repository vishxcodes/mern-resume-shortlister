import sys, json, traceback

try:
    data = json.loads(sys.argv[1])
    job_desc = data['job_description']
    resumes = data['resumes']

    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    documents = [job_desc] + [r['text'] for r in resumes]
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(documents)
    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    for i, r in enumerate(resumes):
        r['score'] = float(cosine_sim[i])

    resumes_sorted = sorted(resumes, key=lambda x: x['score'], reverse=True)
    print(json.dumps(resumes_sorted))

except Exception as e:
    print("PYTHON ERROR:", e, file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)
