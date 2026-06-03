import { supabase } from './supabaseClient';

// Types for blog data
export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: Author;
  readingTime: number;
}

// Sample authors for fallback data
const fallbackAuthors: Record<string, Author> = {
  john: {
    id: '1',
    name: 'John Smith',
    role: 'Lead Developer',
    avatar: '/images/blog/authors/john.jpg',
    bio: 'John is a full-stack developer with over 10 years of experience in web development. He specializes in React, Node.js, and cloud architecture.',
  },
  sarah: {
    id: '2',
    name: 'Sarah Johnson',
    role: 'UX/UI Designer',
    avatar: '/images/blog/authors/sarah.jpg',
    bio: 'Sarah is a UX/UI designer with a passion for creating intuitive and beautiful user experiences. She has worked with startups and enterprise clients across various industries.',
  },
  michael: {
    id: '3',
    name: 'Michael Chen',
    role: 'Digital Marketing Specialist',
    avatar: '/images/blog/authors/michael.jpg',
    bio: 'Michael is a digital marketing expert with a focus on SEO, content strategy, and analytics. He helps businesses grow their online presence and drive meaningful results.',
  },
};

// Fallback data for static generation and error cases
const fallbackPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Build a High-Performance React Application',
    slug: 'how-to-build-high-performance-react-application',
    excerpt: 'Learn the best practices for building fast and efficient React applications that provide an excellent user experience.',
    content: `
      <p>React has become one of the most popular JavaScript libraries for building user interfaces, but with great power comes great responsibility. Building high-performance React applications requires careful consideration of various factors.</p>

      <h2>Use React.memo for Component Memoization</h2>
      <p>React.memo is a higher-order component that memoizes the rendered output of the wrapped component and skips unnecessary re-renders. This can significantly improve performance for components that render often with the same props.</p>

      <pre><code>
const MyComponent = React.memo(function MyComponent(props) {
  /* render using props */
});
      </code></pre>

      <h2>Implement Code Splitting</h2>
      <p>Code splitting is a technique that allows you to split your code into smaller chunks which can then be loaded on demand or in parallel. This can dramatically improve the initial loading time of your application.</p>

      <pre><code>
// Using dynamic imports with React.lazy
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function MyComponent() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </React.Suspense>
  );
}
      </code></pre>

      <h2>Virtualize Long Lists</h2>
      <p>When rendering long lists of data, consider using virtualization libraries like react-window or react-virtualized. These libraries render only the items currently visible to the user, which can greatly improve performance.</p>

      <h2>Optimize Context API Usage</h2>
      <p>While the Context API is powerful, it can cause unnecessary re-renders if not used correctly. Split your contexts into smaller, more focused pieces to prevent components from re-rendering when unrelated context values change.</p>

      <h2>Use the Production Build</h2>
      <p>Always use the production build of React for deployment. The development build includes extra warnings and is significantly slower.</p>

      <h2>Conclusion</h2>
      <p>Building high-performance React applications requires a combination of good architecture, proper use of React's features, and attention to performance metrics. By following these best practices, you can create React applications that are both feature-rich and performant.</p>
    `,
    date: '2025-03-15',
    coverImage: '/images/blog/react-performance.jpg',
    category: 'Web Development',
    tags: ['React', 'JavaScript', 'Performance', 'Frontend'],
    author: fallbackAuthors.john,
    readingTime: 8,
  },
  {
    id: '2',
    title: 'The Psychology of Color in UI Design',
    slug: 'psychology-of-color-in-ui-design',
    excerpt: 'Discover how color choices in your UI can influence user behavior and perception of your brand.',
    content: `
      <p>Color is one of the most powerful tools in a designer's arsenal. It can influence mood, evoke emotions, and even drive specific actions. Understanding the psychology of color is essential for creating effective UI designs.</p>

      <h2>The Emotional Impact of Colors</h2>
      <p>Different colors evoke different emotional responses:</p>
      <ul>
        <li><strong>Blue</strong>: Conveys trust, security, and reliability. It's no coincidence that many financial institutions and tech companies use blue in their branding.</li>
        <li><strong>Red</strong>: Stimulates excitement, urgency, and passion. It's often used for call-to-action buttons or sale announcements.</li>
        <li><strong>Green</strong>: Associated with growth, health, and tranquility. Perfect for environmental brands or wellness applications.</li>
        <li><strong>Yellow</strong>: Represents optimism, clarity, and warmth. It can be used to draw attention to important elements.</li>
        <li><strong>Purple</strong>: Conveys luxury, creativity, and wisdom. Often used in beauty or premium product interfaces.</li>
      </ul>

      <h2>Cultural Considerations</h2>
      <p>It's important to remember that color associations can vary significantly across different cultures. For example, while white represents purity and innocence in Western cultures, it's associated with mourning in some Eastern cultures.</p>

      <h2>Accessibility and Color</h2>
      <p>When designing with color, always consider accessibility. Ensure sufficient contrast between text and background colors, and don't rely solely on color to convey important information, as this can exclude users with color vision deficiencies.</p>

      <h2>Creating a Cohesive Color Palette</h2>
      <p>A well-designed color palette should:</p>
      <ul>
        <li>Reflect your brand identity</li>
        <li>Create visual hierarchy</li>
        <li>Maintain consistency across the interface</li>
        <li>Include primary, secondary, and accent colors</li>
        <li>Consider light and dark mode variations</li>
      </ul>

      <h2>Testing Color Effectiveness</h2>
      <p>A/B testing can be a valuable tool for determining which colors drive the desired user behavior. Small changes in button colors or highlight colors can sometimes lead to significant improvements in conversion rates.</p>

      <h2>Conclusion</h2>
      <p>Color is more than just an aesthetic choice in UI design—it's a powerful communication tool that can significantly impact user experience and behavior. By understanding color psychology and applying it thoughtfully, designers can create more effective and engaging interfaces.</p>
    `,
    date: '2025-03-10',
    coverImage: '/images/blog/color-psychology.jpg',
    category: 'Design',
    tags: ['UI Design', 'Color Theory', 'UX', 'Psychology'],
    author: fallbackAuthors.sarah,
    readingTime: 6,
  },
  {
    id: '3',
    title: 'SEO Strategies That Actually Work in 2025',
    slug: 'seo-strategies-that-actually-work-in-2025',
    excerpt: 'Stay ahead of the competition with these proven SEO techniques that align with the latest search engine algorithms.',
    content: `
      <p>Search Engine Optimization (SEO) continues to evolve rapidly as search engines become more sophisticated. What worked a few years ago might not be effective today. Here are the strategies that are proving successful in 2025.</p>

      <h2>Focus on User Experience Signals</h2>
      <p>Google's Core Web Vitals and other user experience metrics have become increasingly important ranking factors. Ensuring your website loads quickly, is stable, and provides a good interactive experience is no longer optional—it's essential for good SEO.</p>

      <h2>Create Comprehensive, Authoritative Content</h2>
      <p>Search engines are getting better at understanding content quality and depth. Rather than creating many short articles, focus on comprehensive, authoritative content that thoroughly covers a topic. This approach often results in better rankings for multiple related keywords.</p>

      <h2>Optimize for Voice and Visual Search</h2>
      <p>With the rise of voice assistants and visual search tools, optimizing for these search methods is increasingly important. This includes using natural language in your content and providing detailed image alt text and structured data.</p>

      <h2>Build Topical Authority</h2>
      <p>Search engines now evaluate your expertise on a topic across your entire site, not just individual pages. Building a cluster of related content that demonstrates depth of knowledge on specific topics can significantly improve your rankings.</p>

      <h2>Leverage AI for Content Optimization</h2>
      <p>AI tools can help analyze top-ranking content and identify patterns and gaps in your own content. While AI shouldn't replace human creativity, it can provide valuable insights for optimization.</p>

      <h2>Focus on E-E-A-T</h2>
      <p>Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T) continue to be crucial, especially for YMYL (Your Money or Your Life) topics. Clearly displaying author credentials, citing reputable sources, and maintaining accurate, up-to-date information are all important.</p>

      <h2>Implement Structured Data</h2>
      <p>Structured data helps search engines understand your content better and can result in rich snippets in search results, which typically have higher click-through rates. Keep up with the latest schema.org vocabulary to maximize these opportunities.</p>

      <h2>Conclusion</h2>
      <p>SEO in 2025 is less about technical tricks and more about creating genuinely valuable content and excellent user experiences. By focusing on these areas, you can build sustainable search visibility that withstands algorithm updates.</p>
    `,
    date: '2025-03-05',
    coverImage: '/images/blog/seo-strategies.jpg',
    category: 'Digital Marketing',
    tags: ['SEO', 'Digital Marketing', 'Content Strategy', 'Search Engines'],
    author: fallbackAuthors.michael,
    readingTime: 7,
  },
  {
    id: '4',
    title: 'The Rise of Headless CMS Architecture',
    slug: 'rise-of-headless-cms-architecture',
    excerpt: 'Explore how headless CMS systems are changing the way we build and manage digital experiences.',
    content: `
      <p>Traditional content management systems (CMS) have long been the backbone of website development, but they're increasingly being replaced by headless CMS architecture. This shift represents a fundamental change in how we approach content management and delivery.</p>

      <h2>What is a Headless CMS?</h2>
      <p>A headless CMS is a back-end only content management system that acts as a content repository, making content accessible via an API for display on any device. Unlike traditional systems, a headless CMS doesn't care about how and where your content gets displayed—it simply delivers the content.</p>

      <h2>The Benefits of Going Headless</h2>

      <h3>1. Flexibility in Front-end Development</h3>
      <p>With a headless CMS, front-end developers have complete freedom to build the presentation layer using their preferred tools and frameworks, whether that's React, Vue, Angular, or something else entirely.</p>

      <h3>2. Omnichannel Content Delivery</h3>
      <p>Content can be published once and delivered anywhere—websites, mobile apps, IoT devices, digital signage, or even future platforms that don't exist yet.</p>

      <h3>3. Improved Performance</h3>
      <p>Headless architecture often leads to faster websites, especially when combined with static site generation or incremental static regeneration techniques.</p>

      <h3>4. Enhanced Security</h3>
      <p>The decoupling of the content management backend from the presentation layer can reduce the attack surface for potential security vulnerabilities.</p>

      <h2>Popular Headless CMS Platforms</h2>
      <p>Several platforms have emerged as leaders in the headless CMS space:</p>
      <ul>
        <li>Contentful</li>
        <li>Sanity</li>
        <li>Strapi</li>
        <li>Prismic</li>
        <li>Headless versions of traditional CMS like WordPress and Drupal</li>
      </ul>

      <h2>Is Headless Right for Every Project?</h2>
      <p>While headless architecture offers many advantages, it's not necessarily the best choice for every project. Smaller websites with simple content needs might find a traditional CMS more straightforward. Additionally, headless CMSs often require more technical expertise to set up and maintain.</p>

      <h2>The Future of Headless</h2>
      <p>As digital experiences continue to expand beyond traditional websites, the flexibility of headless architecture becomes increasingly valuable. We're likely to see continued innovation in this space, with more sophisticated APIs, better editorial experiences, and tighter integration with front-end frameworks.</p>

      <h2>Conclusion</h2>
      <p>Headless CMS architecture represents a significant evolution in content management, offering unprecedented flexibility and future-proofing for digital experiences. For organizations looking to deliver content across multiple channels while maintaining development flexibility, it's an approach worth serious consideration.</p>
    `,
    date: '2025-02-28',
    coverImage: '/images/blog/headless-cms.jpg',
    category: 'Web Development',
    tags: ['CMS', 'Architecture', 'API', 'JAMstack'],
    author: fallbackAuthors.john,
    readingTime: 9,
  },
  {
    id: '5',
    title: 'Designing for Accessibility: A Comprehensive Guide',
    slug: 'designing-for-accessibility-comprehensive-guide',
    excerpt: 'Learn how to create inclusive digital experiences that work for everyone, including people with disabilities.',
    content: `
      <p>Accessibility in design isn't just a nice-to-have—it's a necessity. Creating inclusive digital experiences ensures that your products can be used by everyone, including the estimated 15% of the global population living with some form of disability.</p>

      <h2>Understanding Web Accessibility</h2>
      <p>Web accessibility means designing websites, tools, and technologies so that people with disabilities can use them. More specifically, it means that people can perceive, understand, navigate, interact with, and contribute to the web.</p>

      <h2>Key Accessibility Principles</h2>

      <h3>1. Perceivable</h3>
      <p>Information and user interface components must be presentable to users in ways they can perceive.</p>
      <ul>
        <li>Provide text alternatives for non-text content</li>
        <li>Create content that can be presented in different ways without losing information</li>
        <li>Make it easier for users to see and hear content</li>
      </ul>

      <h3>2. Operable</h3>
      <p>User interface components and navigation must be operable.</p>
      <ul>
        <li>Make all functionality available from a keyboard</li>
        <li>Give users enough time to read and use content</li>
        <li>Do not use content that could cause seizures or physical reactions</li>
        <li>Provide ways to help users navigate and find content</li>
      </ul>

      <h3>3. Understandable</h3>
      <p>Information and the operation of the user interface must be understandable.</p>
      <ul>
        <li>Make text readable and understandable</li>
        <li>Make content appear and operate in predictable ways</li>
        <li>Help users avoid and correct mistakes</li>
      </ul>

      <h3>4. Robust</h3>
      <p>Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.</p>
      <ul>
        <li>Maximize compatibility with current and future tools</li>
      </ul>

      <h2>Practical Implementation Tips</h2>

      <h3>Color and Contrast</h3>
      <p>Ensure sufficient contrast between text and its background. The WCAG 2.1 guidelines recommend a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.</p>

      <h3>Keyboard Navigation</h3>
      <p>Make sure all interactive elements are keyboard accessible and that the tab order is logical. Visible focus indicators are essential for keyboard users.</p>

      <h3>Alternative Text</h3>
      <p>Provide descriptive alt text for images that convey information. Decorative images should have empty alt attributes (alt="") so screen readers will skip them.</p>

      <h3>Semantic HTML</h3>
      <p>Use appropriate HTML elements for their intended purpose. For example, use &lt;button&gt; for buttons, &lt;a&gt; for links, and heading tags (&lt;h1&gt; through &lt;h6&gt;) to create a logical document structure.</p>

      <h3>ARIA When Necessary</h3>
      <p>Accessible Rich Internet Applications (ARIA) attributes can enhance accessibility when HTML alone isn't sufficient, but use them judiciously and only when needed.</p>

      <h2>Testing for Accessibility</h2>
      <p>Regular testing is crucial for ensuring accessibility. Combine automated testing tools (like Axe, WAVE, or Lighthouse) with manual testing and, ideally, usability testing with people who have disabilities.</p>

      <h2>Conclusion</h2>
      <p>Designing for accessibility benefits everyone, not just users with disabilities. Many accessibility features, like good contrast and keyboard navigation, improve the user experience for all users in various situations. By embracing accessible design practices, you create more robust, flexible, and user-friendly digital experiences.</p>
    `,
    date: '2025-02-20',
    coverImage: '/images/blog/accessibility.jpg',
    category: 'Design',
    tags: ['Accessibility', 'Inclusive Design', 'UX', 'WCAG'],
    author: fallbackAuthors.sarah,
    readingTime: 10,
  },
  {
    id: '6',
    title: 'The Impact of AI on Digital Marketing in 2025',
    slug: 'impact-of-ai-on-digital-marketing-2025',
    excerpt: 'Discover how artificial intelligence is transforming digital marketing strategies and what it means for businesses.',
    content: `
      <p>Artificial Intelligence has moved from a futuristic concept to an essential component of effective digital marketing. In 2025, AI is reshaping how marketers understand their audiences, create content, and optimize campaigns.</p>

      <h2>AI-Powered Customer Insights</h2>
      <p>AI algorithms can now analyze vast amounts of customer data to identify patterns and preferences that would be impossible for humans to detect manually. This enables hyper-personalization at scale, allowing marketers to tailor messages to individual customers based on their behavior, preferences, and predicted needs.</p>

      <h2>Content Creation and Optimization</h2>
      <p>AI tools have advanced significantly in their ability to generate and optimize content. From writing assistance that helps marketers create more engaging copy to AI systems that can automatically generate entire articles or social media posts, these tools are changing the content creation landscape.</p>

      <p>However, the most effective approach combines AI capabilities with human creativity and oversight. AI excels at data-driven optimization and generating variations, while humans provide the strategic direction, emotional intelligence, and ethical considerations that AI still lacks.</p>

      <h2>Predictive Analytics and Campaign Optimization</h2>
      <p>Predictive analytics powered by AI allows marketers to forecast campaign performance with increasing accuracy. These systems can recommend the optimal channel mix, timing, and messaging for different audience segments, leading to more efficient ad spend and higher conversion rates.</p>

      <h2>Conversational Marketing</h2>
      <p>AI chatbots and virtual assistants have evolved from simple rule-based systems to sophisticated conversational agents that can handle complex customer interactions. These tools provide immediate, personalized responses to customer queries, qualifying leads and guiding customers through the purchase journey 24/7.</p>

      <h2>Visual and Voice Search Optimization</h2>
      <p>As visual and voice search continue to grow in popularity, AI is essential for optimizing content for these modalities. AI-powered image recognition and natural language processing help marketers understand how their content will be interpreted by these search technologies.</p>

      <h2>Ethical Considerations and Challenges</h2>
      <p>The increasing use of AI in marketing raises important ethical questions about privacy, transparency, and potential bias. Marketers must navigate these issues carefully, ensuring that AI systems are used responsibly and in ways that build rather than erode customer trust.</p>

      <h2>The Human Element</h2>
      <p>Despite the growing capabilities of AI, human marketers remain essential. The most successful marketing teams use AI as a tool to augment human capabilities, allowing marketers to focus on strategy, creativity, and building authentic connections with customers.</p>

      <h2>Conclusion</h2>
      <p>AI is not replacing marketers but transforming how they work. By embracing AI tools while maintaining focus on human creativity and ethical considerations, marketers can leverage these powerful technologies to create more effective, efficient, and personalized marketing campaigns.</p>
    `,
    date: '2025-02-15',
    coverImage: '/images/blog/ai-marketing.jpg',
    category: 'Digital Marketing',
    tags: ['AI', 'Machine Learning', 'Marketing Automation', 'Personalization'],
    author: fallbackAuthors.michael,
    readingTime: 8,
  },
];

// Function to get all blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        created_at,
        cover_image,
        category,
        tags,
        reading_time,
        author_id,
        blog_authors:author_id(id, name, role, avatar, bio)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return fallbackPosts;
    }

    // Transform the data to match the BlogPost interface
    const posts = data.map((post:any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      date: post.created_at,
      coverImage: post.cover_image,
      category: post.category,
      tags: post.tags || [],
      readingTime: post.reading_time,
      author: {
        id: post.blog_authors.id,
        name: post.blog_authors.name,
        role: post.blog_authors.role,
        avatar: post.blog_authors.avatar,
        bio: post.blog_authors.bio
      }
    }));

    return posts;
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    return fallbackPosts;
  }
}

// Function to get a single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  console.log('Getting blog post with slug:', slug);
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        created_at,
        cover_image,
        category,
        tags,
        reading_time,
        author_id,
        blog_authors:author_id(id, name, role, avatar, bio)
      `)
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error('Error fetching blog post:', error);
      return fallbackPosts.find(post => post.slug === slug) || null;
    }

    // Log the data structure for debugging
    console.log('Blog post data structure:', JSON.stringify(data, null, 2));

    // Check if blog_authors exists and has the expected structure
    let author: Author;
    if (data.blog_authors) {
      // Handle both array and object formats
      if (Array.isArray(data.blog_authors)) {
        // It's an array, use the first item
        if (data.blog_authors.length > 0) {
          author = {
            id: data.blog_authors[0].id || '',
            name: data.blog_authors[0].name || '',
            role: data.blog_authors[0].role || '',
            avatar: data.blog_authors[0].avatar || '',
            bio: data.blog_authors[0].bio || ''
          };
        } else {
          // Empty array, use fallback
          author = fallbackAuthors.john;
        }
      } else {
        // It's an object - use type assertion to handle TypeScript error
        const authorData = data.blog_authors as any;
        author = {
          id: authorData.id || '',
          name: authorData.name || '',
          role: authorData.role || '',
          avatar: authorData.avatar || '',
          bio: authorData.bio || ''
        };
      }
    } else {
      // No author data, use fallback
      author = fallbackAuthors.john;
    }

    // Transform the data to match the BlogPost interface
    const post: BlogPost = {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      date: data.created_at,
      coverImage: data.cover_image,
      category: data.category,
      tags: data.tags || [],
      readingTime: data.reading_time,
      author: author
    };

    return post;
  } catch (error) {
    console.error('Error in getBlogPost:', error);
    return fallbackPosts.find(post => post.slug === slug) || null;
  }
}

// Function to get blog posts by category
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    // Convert category to normalized form for comparison
    const normalizedCategory = category.toLowerCase().replace(/-/g, ' ');

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        created_at,
        cover_image,
        category,
        tags,
        reading_time,
        author_id,
        blog_authors:author_id(id, name, role, avatar, bio)
      `)
      .ilike('category', normalizedCategory)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts by category:', error);
      return fallbackPosts.filter(post => post.category.toLowerCase() === normalizedCategory);
    }

    // Transform the data to match the BlogPost interface
    const posts = data.map((post:any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      date: post.created_at,
      coverImage: post.cover_image,
      category: post.category,
      tags: post.tags || [],
      readingTime: post.reading_time,
      author: {
        id: post.blog_authors.id,
        name: post.blog_authors.name,
        role: post.blog_authors.role,
        avatar: post.blog_authors.avatar,
        bio: post.blog_authors.bio
      }
    }));

    return posts;
  } catch (error) {
    console.error('Error in getBlogPostsByCategory:', error);
    const normalizedCategory = category.toLowerCase().replace(/-/g, ' ');
    return fallbackPosts.filter(post => post.category.toLowerCase() === normalizedCategory);
  }
}

// Function to get related posts (same category, excluding the current post)
export async function getRelatedPosts(currentSlug: string, category: string): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        created_at,
        cover_image,
        category,
        tags,
        reading_time,
        author_id,
        blog_authors:author_id(id, name, role, avatar, bio)
      `)
      .eq('category', category)
      .neq('slug', currentSlug)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching related posts:', error);
      return fallbackPosts
        .filter(post => post.category === category && post.slug !== currentSlug)
        .slice(0, 3);
    }

    // Transform the data to match the BlogPost interface
    const posts = data.map((post:any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      date: post.created_at,
      coverImage: post.cover_image,
      category: post.category,
      tags: post.tags || [],
      readingTime: post.reading_time,
      author: {
        id: post.blog_authors.id,
        name: post.blog_authors.name,
        role: post.blog_authors.role,
        avatar: post.blog_authors.avatar,
        bio: post.blog_authors.bio
      }
    }));

    return posts;
  } catch (error) {
    console.error('Error in getRelatedPosts:', error);
    return fallbackPosts
      .filter(post => post.category === category && post.slug !== currentSlug)
      .slice(0, 3);
  }
}

// Function to get blog posts by tag
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    // Convert tag to normalized form for comparison
    const normalizedTag = tag.toLowerCase().replace(/-/g, ' ');

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        created_at,
        cover_image,
        category,
        tags,
        reading_time,
        author_id,
        blog_authors:author_id(id, name, role, avatar, bio)
      `)
      .contains('tags', [normalizedTag])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts by tag:', error);
      return fallbackPosts.filter(post =>
        post.tags.some(postTag => postTag.toLowerCase() === normalizedTag)
      );
    }

    // Transform the data to match the BlogPost interface
    const posts = data.map((post:any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      date: post.created_at,
      coverImage: post.cover_image,
      category: post.category,
      tags: post.tags || [],
      readingTime: post.reading_time,
      author: {
        id: post.blog_authors.id,
        name: post.blog_authors.name,
        role: post.blog_authors.role,
        avatar: post.blog_authors.avatar,
        bio: post.blog_authors.bio
      }
    }));

    return posts;
  } catch (error) {
    console.error('Error in getBlogPostsByTag:', error);
    const normalizedTag = tag.toLowerCase().replace(/-/g, ' ');
    return fallbackPosts.filter(post =>
      post.tags.some(postTag => postTag.toLowerCase() === normalizedTag)
    );
  }
}

// Function to search blog posts
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  try {
    const searchTerm = query.toLowerCase();

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        created_at,
        cover_image,
        category,
        tags,
        reading_time,
        author_id,
        blog_authors:author_id(id, name, role, avatar, bio)
      `)
      .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching blog posts:', error);
      return fallbackPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Transform the data to match the BlogPost interface
    const posts = data.map((post:any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      date: post.created_at,
      coverImage: post.cover_image,
      category: post.category,
      tags: post.tags || [],
      readingTime: post.reading_time,
      author: {
        id: post.blog_authors.id,
        name: post.blog_authors.name,
        role: post.blog_authors.role,
        avatar: post.blog_authors.avatar,
        bio: post.blog_authors.bio
      }
    }));

    return posts;
  } catch (error) {
    console.error('Error in searchBlogPosts:', error);
    const searchTerm = query.toLowerCase();
    return fallbackPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
}

// Function to get all categories
export async function getAllCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .order('category');

    if (error) {
      console.error('Error fetching categories:', error);
      return Array.from(new Set(fallbackPosts.map(post => post.category)));
    }

    // Extract unique categories
    const categories = Array.from(new Set(data.map(post => post.category)));
    return categories;
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    return Array.from(new Set(fallbackPosts.map(post => post.category)));
  }
}

// Function to get all tags
export async function getAllTags(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('tags');

    if (error) {
      console.error('Error fetching tags:', error);
      return Array.from(new Set(fallbackPosts.flatMap(post => post.tags)));
    }

    // Extract all tags and flatten the array
    const allTags = data.flatMap(post => post.tags || []);

    // Get unique tags
    const uniqueTags = Array.from(new Set(allTags));
    return uniqueTags;
  } catch (error) {
    console.error('Error in getAllTags:', error);
    return Array.from(new Set(fallbackPosts.flatMap(post => post.tags)));
  }
}
