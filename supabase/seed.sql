-- Seed data for blog_authors
INSERT INTO blog_authors (id, name, role, avatar, bio)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'John Smith', 'Lead Developer', '/images/blog/authors/john.jpg', 'John is a full-stack developer with over 10 years of experience in web development. He specializes in React, Node.js, and cloud architecture.'),
  ('00000000-0000-0000-0000-000000000002', 'Sarah Johnson', 'UX/UI Designer', '/images/blog/authors/sarah.jpg', 'Sarah is a UX/UI designer with a passion for creating intuitive and beautiful user experiences. She has worked with startups and enterprise clients across various industries.'),
  ('00000000-0000-0000-0000-000000000003', 'Michael Chen', 'Digital Marketing Specialist', '/images/blog/authors/michael.jpg', 'Michael is a digital marketing expert with a focus on SEO, content strategy, and analytics. He helps businesses grow their online presence and drive meaningful results.')
ON CONFLICT (id) DO NOTHING;

-- Seed data for blog_posts
INSERT INTO blog_posts (id, title, slug, excerpt, content, cover_image, category, tags, reading_time, author_id, created_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'How to Build a High-Performance React Application',
    'how-to-build-high-performance-react-application',
    'Learn the best practices for building fast and efficient React applications that provide an excellent user experience.',
    '<p>React has become one of the most popular JavaScript libraries for building user interfaces, but with great power comes great responsibility. Building high-performance React applications requires careful consideration of various factors.</p><h2>Use React.memo for Component Memoization</h2><p>React.memo is a higher-order component that memoizes the rendered output of the wrapped component and skips unnecessary re-renders. This can significantly improve performance for components that render often with the same props.</p><pre><code>const MyComponent = React.memo(function MyComponent(props) {  /* render using props */});</code></pre><h2>Implement Code Splitting</h2><p>Code splitting is a technique that allows you to split your code into smaller chunks which can then be loaded on demand or in parallel. This can dramatically improve the initial loading time of your application.</p><pre><code>// Using dynamic imports with React.lazy const LazyComponent = React.lazy(() => import(''./LazyComponent'')); function MyComponent() {  return (    <React.Suspense fallback={<div>Loading...</div>}>      <LazyComponent />    </React.Suspense>  );}</code></pre><h2>Virtualize Long Lists</h2><p>When rendering long lists of data, consider using virtualization libraries like react-window or react-virtualized. These libraries render only the items currently visible to the user, which can greatly improve performance.</p><h2>Optimize Context API Usage</h2><p>While the Context API is powerful, it can cause unnecessary re-renders if not used correctly. Split your contexts into smaller, more focused pieces to prevent components from re-rendering when unrelated context values change.</p><h2>Use the Production Build</h2><p>Always use the production build of React for deployment. The development build includes extra warnings and is significantly slower.</p><h2>Conclusion</h2><p>Building high-performance React applications requires a combination of good architecture, proper use of React''s features, and attention to performance metrics. By following these best practices, you can create React applications that are both feature-rich and performant.</p>',
    '/images/blog/react-performance.jpg',
    'Web Development',
    ARRAY['React', 'JavaScript', 'Performance', 'Frontend'],
    8,
    '00000000-0000-0000-0000-000000000001',
    '2025-03-15T00:00:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'The Psychology of Color in UI Design',
    'psychology-of-color-in-ui-design',
    'Discover how color choices in your UI can influence user behavior and perception of your brand.',
    '<p>Color is one of the most powerful tools in a designer''s arsenal. It can influence mood, evoke emotions, and even drive specific actions. Understanding the psychology of color is essential for creating effective UI designs.</p><h2>The Emotional Impact of Colors</h2><p>Different colors evoke different emotional responses:</p><ul><li><strong>Blue</strong>: Conveys trust, security, and reliability. It''s no coincidence that many financial institutions and tech companies use blue in their branding.</li><li><strong>Red</strong>: Stimulates excitement, urgency, and passion. It''s often used for call-to-action buttons or sale announcements.</li><li><strong>Green</strong>: Associated with growth, health, and tranquility. Perfect for environmental brands or wellness applications.</li><li><strong>Yellow</strong>: Represents optimism, clarity, and warmth. It can be used to draw attention to important elements.</li><li><strong>Purple</strong>: Conveys luxury, creativity, and wisdom. Often used in beauty or premium product interfaces.</li></ul><h2>Cultural Considerations</h2><p>It''s important to remember that color associations can vary significantly across different cultures. For example, while white represents purity and innocence in Western cultures, it''s associated with mourning in some Eastern cultures.</p><h2>Accessibility and Color</h2><p>When designing with color, always consider accessibility. Ensure sufficient contrast between text and background colors, and don''t rely solely on color to convey important information, as this can exclude users with color vision deficiencies.</p><h2>Creating a Cohesive Color Palette</h2><p>A well-designed color palette should:</p><ul><li>Reflect your brand identity</li><li>Create visual hierarchy</li><li>Maintain consistency across the interface</li><li>Include primary, secondary, and accent colors</li><li>Consider light and dark mode variations</li></ul><h2>Testing Color Effectiveness</h2><p>A/B testing can be a valuable tool for determining which colors drive the desired user behavior. Small changes in button colors or highlight colors can sometimes lead to significant improvements in conversion rates.</p><h2>Conclusion</h2><p>Color is more than just an aesthetic choice in UI design—it''s a powerful communication tool that can significantly impact user experience and behavior. By understanding color psychology and applying it thoughtfully, designers can create more effective and engaging interfaces.</p>',
    '/images/blog/color-psychology.jpg',
    'Design',
    ARRAY['UI Design', 'Color Theory', 'UX', 'Psychology'],
    6,
    '00000000-0000-0000-0000-000000000002',
    '2025-03-10T00:00:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'SEO Strategies That Actually Work in 2025',
    'seo-strategies-that-actually-work-in-2025',
    'Stay ahead of the competition with these proven SEO techniques that align with the latest search engine algorithms.',
    '<p>Search Engine Optimization (SEO) continues to evolve rapidly as search engines become more sophisticated. What worked a few years ago might not be effective today. Here are the strategies that are proving successful in 2025.</p><h2>Focus on User Experience Signals</h2><p>Google''s Core Web Vitals and other user experience metrics have become increasingly important ranking factors. Ensuring your website loads quickly, is stable, and provides a good interactive experience is no longer optional—it''s essential for good SEO.</p><h2>Create Comprehensive, Authoritative Content</h2><p>Search engines are getting better at understanding content quality and depth. Rather than creating many short articles, focus on comprehensive, authoritative content that thoroughly covers a topic. This approach often results in better rankings for multiple related keywords.</p><h2>Optimize for Voice and Visual Search</h2><p>With the rise of voice assistants and visual search tools, optimizing for these search methods is increasingly important. This includes using natural language in your content and providing detailed image alt text and structured data.</p><h2>Build Topical Authority</h2><p>Search engines now evaluate your expertise on a topic across your entire site, not just individual pages. Building a cluster of related content that demonstrates depth of knowledge on specific topics can significantly improve your rankings.</p><h2>Leverage AI for Content Optimization</h2><p>AI tools can help analyze top-ranking content and identify patterns and gaps in your own content. While AI shouldn''t replace human creativity, it can provide valuable insights for optimization.</p><h2>Focus on E-E-A-T</h2><p>Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T) continue to be crucial, especially for YMYL (Your Money or Your Life) topics. Clearly displaying author credentials, citing reputable sources, and maintaining accurate, up-to-date information are all important.</p><h2>Implement Structured Data</h2><p>Structured data helps search engines understand your content better and can result in rich snippets in search results, which typically have higher click-through rates. Keep up with the latest schema.org vocabulary to maximize these opportunities.</p><h2>Conclusion</h2><p>SEO in 2025 is less about technical tricks and more about creating genuinely valuable content and excellent user experiences. By focusing on these areas, you can build sustainable search visibility that withstands algorithm updates.</p>',
    '/images/blog/seo-strategies.jpg',
    'Digital Marketing',
    ARRAY['SEO', 'Digital Marketing', 'Content Strategy', 'Search Engines'],
    7,
    '00000000-0000-0000-0000-000000000003',
    '2025-03-05T00:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;
