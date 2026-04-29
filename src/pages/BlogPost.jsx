import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { getBlogPostBySlug, getRelatedPosts } from '../data/blogPosts';
import ReactMarkdown from 'react-markdown';

const BlogPost = ({ lang = 'en' }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // 1. PRIDANIE STAVU PRE TEXT ČLÁNKU
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    const foundPost = getBlogPostBySlug(slug);
    
    if (!foundPost) {
      navigate('/blog');
      return;
    }

    setPost(foundPost);
    setRelatedPosts(getRelatedPosts(foundPost.id));

    // 2. NAČÍTANIE TEXTU Z URL ADRESY
    fetch(foundPost.content[lang])
      .then(res => res.text())
      .then(text => setMarkdownContent(text))
      .catch(err => console.error(lang === 'en' ? 'Error when loading MD:' : lang === 'sk' ? 'Chyba pri načítaní MD:' : 'Chyba při načítání MD:', err));

    // Update meta tags for SEO
    document.title = `${foundPost.title[lang]} - GenerateFast Blog`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = foundPost.description[lang];
    }

    // Update OG tags for social sharing
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = foundPost.title[lang];

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = foundPost.description[lang];

    // Scroll to top
    window.scrollTo(0, 0);

  }, [slug, lang, navigate]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-8 transition"
        >
          <ArrowLeft size={16} />
          {lang === 'en' ? 'Back to Blog' : lang === 'sk' ? 'Späť na Blog' : 'Zpět na Blog'}
        </button>

        {/* Hero Image */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title[lang]}
            className="w-full h-48 md: h-96 object-contain rounded-2xl mb-8"
          />
        )}

        {/* Article Header */}
        <article>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
            {post.title[lang]}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-gray-400 mb-8 text-sm">
            <div className="flex items-center gap-2">
              <User size={14} />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(post.publishedDate).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'sk' ? 'sk-SK' : 'cs-CZ')}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              {post.readTime} {lang === 'en' ? 'min read' : lang === 'sk' ? 'min čítania' : 'min čtení'}
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-invert max-w-none mb-12">
            <ReactMarkdown
              components={{
                h2: ({ children }) => <h2 className="text-3xl font-bold mt-8 mb-4 text-violet-300">{children}</h2>,
                h3: ({ children }) => <h3 className="text-2xl font-bold mt-6 mb-3 text-violet-400">{children}</h3>,
                p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-300">{children}</ol>,
                li: ({ children }) => <li className="ml-4">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} className="text-violet-400 hover:text-violet-300 underline transition">
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-violet-500 pl-4 py-2 my-4 italic text-gray-400">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>

          {/* Keywords/Tags */}
          <div className="mb-12 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-400 mb-3">
              {lang === 'en' ? 'Keywords:' : lang === 'sk' ? 'Kľúčové slová:' : 'Klíčová slova:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.keywords[lang].split(', ').map((keyword, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-xs text-gray-300 hover:border-violet-500 transition cursor-pointer"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-violet-900/40 to-blue-900/40 border border-violet-500/20 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold mb-4">
            {lang === 'en'
              ? 'Ready to Find Your Perfect Domain?'
              : lang === 'sk'
              ? 'Ste pripravení nájsť Vašu ideálnu doménu?'
              : 'Jste připraveni najít svou ideální doménu?'}
          </h3>
          <p className="text-gray-300 mb-6">
            {lang === 'en'
              ? 'Use GenerateFast to get AI-powered domain suggestions instantly.'
              : lang === 'sk'
              ? 'Použite GenerateFast na získanie AI generovaných návrhov domén okamžite.'
              : 'Použijte GenerateFast pro získání návrhů domén poháněných AI okamžitě.'}
          </p>
          <Link
            to='/'
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-xl transition font-medium"
          >
            {lang === 'en' ? 'Generate Domains' : lang === 'sk' ? 'Generujte Domény' : 'Generujte Domény'} →
          </Link>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6">
              {lang === 'en'
                ? 'Related Articles'
                : lang === 'sk'
                ? 'Súvisiace články'
                : 'Související články'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map(relatedPost => (
                <a
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-violet-500/50 transition"
                >
                  <h4 className="font-bold mb-2 group-hover:text-violet-400 transition line-clamp-2">
                    {relatedPost.title[lang]}
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {relatedPost.excerpt[lang]}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPost;