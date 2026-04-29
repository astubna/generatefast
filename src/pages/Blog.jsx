import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

const Blog = ({ lang = 'en' }) => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Update meta tags for SEO
    document.title = lang === 'en' 
      ? 'Blog - Domain Tips & Guides - GenerateFast'
      : lang === 'sk'
      ? 'Blog - Tipy a Návody - GenerateFast'
      : 'Blog - Tipy a Průvodci - GenerateFast';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = lang === 'en'
        ? 'Learn domain selection tips, naming strategies, and SEO best practices from our expert blog.'
        : lang === 'sk'
        ? 'Naučte sa tipy na výber domén, stratégiu pomenovania a SEO od nášho experta.'
        : 'Naučte se tipy výběru domén, strategii pojmenování a SEO od našeho experta.';
    }

    // Filter and sort posts
    const filtered = blogPosts.filter(post => {
      if (selectedCategory === 'all') return true;
      return post.category === selectedCategory;
    });
    setPosts(filtered.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)));
  }, [lang, selectedCategory]);

  const categories = ['all', ...new Set(blogPosts.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20 pb-16">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex justify-center items-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-violet-400 bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
          {lang === 'en' ? 'GenerateFast Blog' : lang === 'sk' ? 'GenerateFast Blog' : 'GenerateFast Blog'}
          </h1>
        </div>
        <div className="flex justify-center items-center">
        <p className="text-gray-300 text-lg max-w-2xl">
          {lang === 'en'
            ? 'Domain naming tips, SEO strategies, and insights for your business success.'
            : lang === 'sk'
            ? 'Tipy na pomenovanie domén, SEO stratégiu a poznatky pre váš úspech.'
            : 'Tipy na pojmenování domén, SEO strategii a poznatky pro váš úspěch.'}
        </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat === 'all'
                ? lang === 'en' ? 'All' : lang === 'sk' ? 'Všetko' : 'Všechno'
                : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {lang === 'en' ? 'No posts found.' : lang === 'sk' ? 'Žiadne príspevky.' : 'Žádné příspěvky.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-violet-500/50 transition"
              >
                {/* Image */}
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title[lang]}
                    className="w-full h-32 md:h-48 object-cover group-hover:opacity-80 transition"
                  />
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.publishedDate).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'sk' ? 'sk-SK' : 'cs-CZ')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime} {lang === 'en' ? 'min' : lang === 'sk' ? 'min' : 'min'}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold mb-2 group-hover:text-violet-400 transition">
                    {post.title[lang]}
                  </h2>

                  <p className="text-gray-400 text-sm mb-4">
                    {post.excerpt[lang]}
                  </p>

                  <div className="flex items-center gap-2 text-violet-400 font-medium">
                    {lang === 'en' ? 'Read More' : lang === 'sk' ? 'Čítať ďalej' : 'Číst dále'}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;