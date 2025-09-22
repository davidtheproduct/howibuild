#!/usr/bin/env node

/**
 * Newsletter Generator for howibuild.ai (CommonJS)
 *
 * Usage: node generate-newsletter.cjs [end-date] [summary-line]
 * - end-date is the inclusive end of the 7-day window (YYYY-MM-DD)
 * - if omitted, today is used
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const RSS_URL = 'https://howibuild.ai/rss.xml';
const NEWSLETTER_DIR = __dirname;
const SITE_URL = 'https://howibuild.ai';

// Get end date (inclusive) and summary line from command line
const endDateArg = process.argv[2];
const summaryLine = process.argv[3];

// Helpers for date handling at local day boundaries
function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDateAtLocalStart(dateStr) {
  // Construct via YYYY-MM-DD components to avoid TZ surprises
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function todayAtStartOfDay() {
  return startOfDay(new Date());
}

// Sliding 7-day window ending on endDate (inclusive)
const endDate = endDateArg ? parseDateAtLocalStart(endDateArg) : todayAtStartOfDay();
const startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000);
const endDateExclusive = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);

// Default summary line if none provided
const defaultSummary = "This week was wild. From launching the site in 3 hours to fixing database dramas and creating custom wordmarks, here's what went down in the trenches:";
const finalSummary = summaryLine || defaultSummary;

console.log(
  `📰 Generating newsletter for last 7 days: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`
);

// Fetch RSS feed
function fetchRSS() {
  return new Promise((resolve, reject) => {
    https.get(RSS_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Parse RSS XML (simple regex-based parser)
function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    
    const title = itemXml.match(/<title>(.*?)<\/title>/)?.[1] || '';
    const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
    const description = itemXml.match(/<description>(.*?)<\/description>/)?.[1] || '';
    const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    
    if (title && link) {
      items.push({
        title: title.replace(/&apos;/g, "'").replace(/&amp;/g, "&"),
        link,
        description: description.replace(/&apos;/g, "'").replace(/&amp;/g, "&"),
        pubDate: new Date(pubDate)
      });
    }
  }
  
  return items;
}

// Filter posts from the last week
function filterRecentPosts(posts) {
  return posts.filter((post) => post.pubDate >= startDate && post.pubDate < endDateExclusive);
}

// Generate newsletter markdown
function generateNewsletter(posts) {
  const weekStartStr = startDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const weekEndStr = endDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  let newsletter = `# Weekly Wrap: Build Logs from the Trenches
*${weekStartStr} - ${weekEndStr}*

Hey builders! 👋

${finalSummary}

## 🚀 This Week's Build Logs

`;

  // Add each post
  posts.forEach(post => {
    const slug = post.link.replace(SITE_URL + '/', '');
    newsletter += `**${post.title}**
${post.description}

[Read the full build log →](${post.link})

`;
  });

  // Add tools section (you'll need to manually update this each week)
  newsletter += `## 🔧 Quick Tools Roundup

This week's tech stack that made it all possible:
- **Planning**: ChatPRD for requirements
- **IDE**: Cursor with Claude Code  
- **Framework**: Astro + Tailwind (**NEW**: AstroWind template)
- **Analytics**: PostHog with AI assistant
- **Deployment**: Netlify (git-based)
- **Design**: **NEW**: Inkscape for vector graphics
- **Database**: Supabase with proper RLS

## 💡 Forward to a Friend

Know someone who'd appreciate these unfiltered build logs? Forward this newsletter to a fellow builder who's wrestling with technical decisions and wants to see how it's actually done.

**Built something interesting?** Have a founder war story worth sharing? [Get involved](${SITE_URL}/get-involved) and contribute your own build log.

---

*Building in public, one build log at a time.*

---

*This newsletter is powered by howibuild.ai - build logs and founder lessons from the trenches.*`;

  return newsletter;
}

// Main execution
async function main() {
  try {
    console.log('📡 Fetching RSS feed...');
    const rssXml = await fetchRSS();
    
    console.log('📝 Parsing RSS feed...');
    const allPosts = parseRSS(rssXml);
    
    console.log('🔍 Filtering posts from the last 7 days...');
    const recentPosts = filterRecentPosts(allPosts);
    
    if (recentPosts.length === 0) {
      console.log('❌ No posts found for the specified window.');
      console.log(`   Looking for posts between: ${startDate.toISOString()} and ${endDateExclusive.toISOString()}`);
      console.log(`   Found ${allPosts.length} total posts in RSS feed.`);
      return;
    }
    
    console.log(`✅ Found ${recentPosts.length} posts in the last 7 days:`);
    recentPosts.forEach(post => {
      console.log(`   - ${post.title} (${post.pubDate.toISOString().split('T')[0]})`);
    });
    
    console.log('📰 Generating newsletter...');
    const newsletter = generateNewsletter(recentPosts);
    
    // Save to file
    const filename = `weekly-wrap-${endDate.toISOString().split('T')[0]}.md`;
    const filepath = path.join(NEWSLETTER_DIR, filename);
    
    fs.writeFileSync(filepath, newsletter);
    
    console.log(`✅ Newsletter generated: ${filename}`);
    console.log(`📁 Location: ${filepath}`);
    console.log('\n📋 Next steps:');
    console.log('1. Review the generated newsletter');
    console.log('2. Update the "Quick Tools Roundup" section with any new tools');
    console.log('3. Copy the content into Beehiiv');
    console.log('4. Send to your subscribers!');
    
  } catch (error) {
    console.error('❌ Error generating newsletter:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
