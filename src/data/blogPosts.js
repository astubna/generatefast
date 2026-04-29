export const blogPosts = [
  {
    id: 1,
    slug: 'how-to-choose-domain',
    title: {
      en: 'How to Choose the Perfect Domain Name for Your Business',
      sk: 'Ako vybrať perfektnú doménu: Komplexný sprievodca',
      cs: 'Jak vybrat perfektní doménu: Kompletní průvodce',
    },
    excerpt: {
      en: 'Learn how to choose the perfect domain name for your business. Discover key criteria, avoid common mistakes, and use AI tools to find your ideal domain.',
      sk: 'Zistite ako vybrať ideálnu doménu. Objavte kľúčové kritériá, vyhnite sa chybám a používajte AI na nájdenie perfektnej domény.',
      cs: 'Zjistěte jak vybrat ideální doménu. Objevte klíčová kritéria, vyhněte se chybám a používejte AI na nalezení perfektní domény.',
    },
    author: 'GenerateFast Team',
    publishedDate: '2026-04-15',
    readTime: 8,
    category: 'Domain Tips',
    keywords: {
      en: 'domain name, choose domain, perfect domain, domain generator, domain selection',
      sk: 'doména, generátor domén, výber domény, ako vybrať doménu, názov domény',
      cs: 'doména, generátor domén, výběr domény, jak vybrat doménu, název domény',
    },
    description: {
      en: 'Complete guide on how to choose the perfect domain name. Learn criteria, avoid mistakes, and find your ideal domain with AI assistance.',
      sk: 'Komplexný sprievodca výberom ideálnej domény. Naučte sa kritériá, vyhnite sa chybám a nájdite svoju doménu s AI.',
      cs: 'Kompletní průvodce výběrem ideální domény. Naučte se kritéria, vyhněte se chybám a najděte svou doménu s AI.',
    },
    // Content is stored as markdown files and located as following
    content: {
      en: '/content/blog/en/how-to-choose-domain.md',
      sk: '/content/blog/sk/ako-vybrat-domenu.md',
      cs: '/content/blog/cs/jak-vybrat-domenu.md',
    },
    image: '/domain-choosing-guide.png', // Optional: hero image
    relatedPosts: [2, 3], // IDs of related posts (optional)
  },
  // I can add more blog posts here following the same structure
];

export const getBlogPostBySlug = (slug) => {
  return blogPosts.find(post => post.slug === slug);
};

export const getBlogPostById = (id) => {
  return blogPosts.find(post => post.id === id);
};

export const getRelatedPosts = (postId) => {
  const post = getBlogPostById(postId);
  if (!post.relatedPosts) return [];
  return post.relatedPosts.map(id => getBlogPostById(id)).filter(Boolean);
};