/**
 * Middleware for tracking AI crawlers server-side.
 *
 * AI crawlers (GPTBot, ClaudeBot, etc.) don't execute JavaScript,
 * so they're invisible to PostHog's client-side tracking.
 * This middleware runs server-side on every request to capture them.
 */
import type { MiddlewareHandler } from 'vocs/server'

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'anthropic-ai',
  'ClaudeBot',
  'claude-web',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Googlebot',
  'Bingbot',
  'Amazonbot',
  'Applebot',
  'Applebot-Extended',
  'FacebookBot',
  'meta-externalagent',
  'LinkedInBot',
  'Bytespider',
  'DuckAssistBot',
  'cohere-ai',
  'AI2Bot',
  'CCBot',
  'Diffbot',
  'omgili',
  'Timpibot',
  'YouBot',
  'MistralAI-User',
  'GoogleAgent-Mariner',
]

export default function test(): MiddlewareHandler {
  return async (c, next) => {
    const ua = c.req.header('user-agent') || ''
    const matchedCrawler = AI_CRAWLERS.find((crawler) => ua.includes(crawler))
    if (!matchedCrawler) return next()

    const url = new URL(c.req.url)
    const posthogKey = import.meta.env.VITE_POSTHOG_KEY
    const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

    if (!posthogKey) return next()

    const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()

    const event = {
      api_key: posthogKey,
      event: 'crawler_pageview',
      distinct_id: `crawler_${matchedCrawler}`,
      properties: {
        crawler_name: matchedCrawler,
        user_agent: ua,
        path: url.pathname,
        $current_url: c.req.url,
        $ip: ip,
      },
    }

    fetch(`${posthogHost}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    }).catch(() => {})

    await next()
  }
}
