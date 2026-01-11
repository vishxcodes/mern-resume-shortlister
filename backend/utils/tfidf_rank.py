#!/usr/bin/env python3
import sys
import json
import traceback

def read_input():
    # Try argv[1] first, else try stdin
    if len(sys.argv) > 1:
        raw = sys.argv[1]
    else:
        raw = sys.stdin.read()
    if not raw or raw.strip() == "":
        raise ValueError("No input provided. Provide JSON as argv[1] or via stdin.")
    return json.loads(raw)

def safe_text(s):
    if s is None:
        return ""
    return str(s).strip()

def main():
    try:
        data = read_input()

        # validate keys
        if not isinstance(data, dict):
            raise ValueError("Input JSON must be an object with keys 'job_description' and 'resumes'.")

        job_desc = safe_text(data.get('job_description', ""))
        resumes = data.get('resumes', [])

        if not isinstance(resumes, list):
            raise ValueError("'resumes' must be a list of objects with 'id' and 'text' fields.")

        # Normalize resumes: ensure id and text exist
        normalized = []
        for r in resumes:
            _id = r.get('id') if isinstance(r, dict) else None
            _text = safe_text(r.get('text') if isinstance(r, dict) else "")
            normalized.append({'id': _id, 'text': _text})

        # If all resume texts are empty, return 0 scores and include a warning
        if all(r['text'] == "" for r in normalized):
            out = []
            for r in normalized:
                out.append({'id': r['id'], 'text': r['text'], 'score': 0.0})
            print(json.dumps({'warning': 'no_resume_text', 'results': out}))
            return 0

        # If job description empty, similarity will be zero; still compute gracefully.
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity
        except Exception as e:
            # sklearn not installed or import error -> propagate to stderr
            print(json.dumps({'error': 'sklearn_import_failed', 'message': str(e)}))
            return 1

        documents = [job_desc] + [r['text'] for r in normalized]
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(documents)

        # compute cosine similarity between job (index 0) and each resume (index 1..)
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

        results = []
        # if lengths mismatch, handle gracefully
        for i, r in enumerate(normalized):
            score = float(cosine_sim[i]) if i < len(cosine_sim) else 0.0
            results.append({'id': r['id'], 'text': r['text'], 'score': score})

        # Print JSON array (or object if you prefer). Node expects a JSON string on stdout.
        print(json.dumps(results))
        return 0

    except Exception as e:
        # Print full traceback to stderr (Node's PythonShell.run will capture stderr)
        print("PYTHON ERROR:", str(e), file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        # Also print a minimal JSON error to stdout? No — better to keep stdout clean.
        return 1

if __name__ == "__main__":
    sys.exit(main())
