import { NextRequest, NextResponse } from 'next/server';
import { getBlogPost } from '@/lib/blog';

export const dynamic = 'force-dynamic';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID || '2', 10);
const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;
const SITE_URL = 'https://formiqstudio.in';
const NEW_POST_TEMPLATE_ID = 2;

async function getTemplateHtml(templateId: number, params: Record<string, string>): Promise<string> {
  if (!BREVO_API_KEY) throw new Error('Brevo not configured');

  const res = await fetch(`https://api.brevo.com/v3/smtp/templates/${templateId}`, {
    headers: { 'api-key': BREVO_API_KEY },
  });

  if (!res.ok) throw new Error('Failed to fetch template');
  const template = await res.json();
  let html: string = template.htmlContent;

  for (const [key, value] of Object.entries(params)) {
    html = html.replace(new RegExp(`\\{\\{\\s*params\\.${key}\\s*\\}\\}`, 'g'), value);
  }

  return html;
}

async function sendCampaign(post: {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: { name: string };
  readingTime: number;
  category: string;
}) {
  if (!BREVO_API_KEY) throw new Error('Brevo not configured');

  const params = {
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    category: post.category,
    author: post.author.name,
    readingTime: String(post.readingTime),
    postUrl: `${SITE_URL}/blog/${post.slug}`,
  };

  const htmlContent = await getTemplateHtml(NEW_POST_TEMPLATE_ID, params);

  const campaignRes = await fetch('https://api.brevo.com/v3/emailCampaigns', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `Blog: ${post.title}`,
      subject: `New Post: ${post.title}`,
      sender: { name: 'FormiqStudio', email: 'shivaysharmachemistry@gmail.com' },
      type: 'classic',
      htmlContent,
      recipients: { listIds: [BREVO_LIST_ID] },
    }),
  });

  const campaignData = await campaignRes.json();
  if (!campaignRes.ok) throw new Error(campaignData.message || 'Campaign creation failed');

  const sendRes = await fetch(
    `https://api.brevo.com/v3/emailCampaigns/${campaignData.id}/sendNow`,
    { method: 'POST', headers: { 'api-key': BREVO_API_KEY } }
  );

  if (!sendRes.ok) {
    const sendData = await sendRes.json();
    throw new Error(sendData.message || 'Campaign send failed');
  }

  return campaignData.id;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === 'INSERT' && body.table === 'blog_posts' && body.record) {
      const secret = request.headers.get('x-webhook-secret');
      if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const slug = body.record.slug;
      if (!slug) {
        return NextResponse.json({ error: 'No slug in record' }, { status: 400 });
      }

      await new Promise((r) => setTimeout(r, 2000));

      const post = await getBlogPost(slug);
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      const campaignId = await sendCampaign(post);
      return NextResponse.json({ message: 'Newsletter sent!', campaignId });
    }

    const authHeader = request.headers.get('x-api-key');
    if (authHeader !== BREVO_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = body;
    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const post = await getBlogPost(slug);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const campaignId = await sendCampaign(post);
    return NextResponse.json({ message: 'Newsletter sent!', campaignId });
  } catch (error: any) {
    console.error('Error in POST /api/newsletter/send-post:', error.message);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
