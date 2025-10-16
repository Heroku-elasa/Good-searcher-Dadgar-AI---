import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { useLanguage } from '../types';

const pythonContent = `
Python has become a dominant language for AI-driven web search projects due to its rich ecosystem of libraries for machine learning, natural language processing (NLP), and web scraping. Exploring GitHub projects is one of the best ways to learn, use, and contribute to these tools.

## Key Areas to Explore

### 1. **Search Engine Development**
- **Whoosh**: A pure Python library for building full-text search engines. Lightweight and easy to integrate.
- **Elasticsearch Python Clients**: Python libraries to interact with Elasticsearch for scalable search implementations.

\`\`\`python
from elasticsearch import Elasticsearch
es = Elasticsearch()
es.index(index="test-index", document={"title": "AI Web Search", "content": "Python and AI"})
res = es.search(index="test-index", query={"match": {"content": "AI"}})
print(res)
\`\`\`

### 2. **Web Scraping & Data Collection**
Before indexing, data must be collected. Python projects here include:
- **Scrapy**: Powerful and flexible framework for large-scale scraping.
- **BeautifulSoup & Requests**: Quick solutions for smaller projects.

\`\`\`python
from bs4 import BeautifulSoup
import requests
url = "https://example.com"
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')
print(soup.title.text)
\`\`\`

### 3. **NLP for Search Enhancement**
Understanding queries and ranking results often requires NLP:
- **Transformers by Hugging Face**: Pretrained language models like BERT, GPT, or RoBERTa for semantic search.
- **Sentence Transformers**: Generate embeddings for vector search.

\`\`\`python
from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer('all-MiniLM-L6-v2')
query_embedding = model.encode("Python AI web search")
corpus_embedding = model.encode(["GitHub project search", "AI-based web scraping"])
similarities = util.cos_sim(query_embedding, corpus_embedding)
print(similarities)
\`\`\`

### 4. **Vector Search Repositories**
Recent AI web search projects often use vector similarity:
- **FAISS (Facebook AI Similarity Search)**: Efficient similarity search and clustering of dense vectors.
- **Weaviate**: Open-source semantic search engine with Python client.

### 5. **Finding GitHub Projects**
To explore relevant repositories:
- Use GitHub search with keywords:
  \`\`\`
  python "web search AI"
  python "semantic search"
  python "vector search"
  \`\`\`
- Filter by stars, forks, or recent updates to find actively maintained projects.

### 6. **Best Practices for Exploration**
1. Clone repositories and run example notebooks.
2. Read documentation and CONTRIBUTING.md files to understand setup.
3. Start with small experiments like crawling a few pages and building a mini semantic search engine.
4. Join community discussions to stay updated and troubleshoot issues.

## Summary
Unlocking Python-based AI web search projects requires combining web scraping, NLP, vector embeddings, and search frameworks. GitHub offers a huge repository of open-source projects, tutorials, and experimentation code. By studying these tools, you can quickly build your own AI-driven search prototypes and contribute to the community.

`;

const PythonProjectsPage: React.FC = () => {
    const { t } = useLanguage();
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        const parseContent = () => {
            const html = marked.parse(pythonContent) as string;
            setHtmlContent(html);
        };
        parseContent();
    }, []);

    return (
        <div className="animate-fade-in bg-gray-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-400 tracking-tight">
                       AI Web Search with Python
                    </h1>
                    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                        An overview of key technologies and projects for building intelligent search solutions.
                    </p>
                </div>

                <div className="mt-16 max-w-4xl mx-auto bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700">
                     <div
                        className="prose prose-invert prose-lg max-w-none prose-pre:bg-gray-900 prose-pre:text-white prose-pre:border prose-pre:border-gray-600 prose-headings:text-teal-300"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PythonProjectsPage;