#!/usr/bin/env node

/**
 * Newsletter Generator for howibuild.ai
 * 
 * Usage: node generate-newsletter.js [week-start-date] [summary-line]
 * 
 * Example: node generate-newsletter.js 2025-09-09 "This week was wild. From launching the site in 3 hours to fixing database dramas and creating custom wordmarks, here's what went down in the trenches:"
 * 
 * This script:
 * 1. Fetches your RSS feed
 * 2. Filters posts from the last week
 * 3. Generates newsletter markdown using excerpts
 * 4. Outputs to newsletter/weekly-wrap-[date].md
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const RSS_URL = 'https://howibuild.ai/rss.xml';
const NEWSLETTER_DIR = path.join(__dirname);
const SITE_URL = 'https://howibuild.ai';

// Get week start date and summary line from command line
const weekStartArg = process.argv[2];
const summaryLine = process.argv[3];

// Default to previous Monday if no date provided
function getPreviousMonday() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days to Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysToSubtract);
  monday.setHours(0, 0, 0, 0); // Start of day
  return monday;
}

const weekStart = weekStartArg ? new Date(weekStartArg) : getPreviousMonday();
const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

// Default summary line if none provided
const defaultSummary = "This week was wild. From launching the site in 3 hours to fixing database dramas and creating custom wordmarks, here's what went down in the trenches:";
const finalSummary = summaryLine || defaultSummary;

console.log(`📰 Generating newsletter for week: ${weekStart.toISOString().split('T')[0]} to ${weekEnd.toISOString().split('T')[0]}`);

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
  return posts.filter(post => {
    return post.pubDate >= weekStart && post.pubDate < weekEnd;
  });
}

// Generate newsletter markdown
function generateNewsletter(posts) {
  const weekStartStr = weekStart.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const weekEndStr = weekEnd.toLocaleDateString('en-US', { 
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
    
    console.log('🔍 Filtering posts from last week...');
    const recentPosts = filterRecentPosts(allPosts);
    
    if (recentPosts.length === 0) {
      console.log('❌ No posts found for the specified week.');
      console.log(`   Looking for posts between: ${weekStart.toISOString()} and ${weekEnd.toISOString()}`);
      console.log(`   Found ${allPosts.length} total posts in RSS feed.`);
      return;
    }
    
    console.log(`✅ Found ${recentPosts.length} posts for this week:`);
    recentPosts.forEach(post => {
      console.log(`   - ${post.title} (${post.pubDate.toISOString().split('T')[0]})`);
    });
    
    console.log('📰 Generating newsletter...');
    const newsletter = generateNewsletter(recentPosts);
    
    // Save to file
    const filename = `weekly-wrap-${weekStart.toISOString().split('T')[0]}.md`;
    const filepath = path.join(NEWSLETTER_DIR, filename);
    
    fs.writeFileSync(filepath, newsletter);
    
    console.log(`✅ Newsletter generated: ${filename}`);
    console.log(`📁 Location: ${filepath}`);
    console.log('\n📋 Next steps:');
    console.log('1. Review the generated newsletter');
    console.log('2. Update the "Quick Tools Roundup" section with any new tools');
    console.log('3. Copy the content into Beehiv');
    console.log('4. Send to your subscribers!');
    
  } catch (error) {
    console.error('❌ Error generating newsletter:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
