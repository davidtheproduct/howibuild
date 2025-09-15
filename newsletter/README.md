# Newsletter Generator

Simple script to generate weekly newsletters from your RSS feed.

## Usage

```bash
# Generate newsletter for the previous week (Monday to Sunday, uses default summary)
node generate-newsletter.js

# Generate newsletter for a specific week starting on Monday (uses default summary)
node generate-newsletter.js 2025-09-09

# Generate newsletter with custom summary line
node generate-newsletter.js 2025-09-09 "This week was wild. From launching the site in 3 hours to fixing database dramas and creating custom wordmarks, here's what went down in the trenches:"
```

## What it does

1. **Fetches your RSS feed** from `https://howibuild.ai/rss.xml`
2. **Filters posts** from the specified week (Monday to Sunday)
3. **Generates markdown** using the exact excerpts from your posts
4. **Saves to file** like `weekly-wrap-2025-09-09.md`

## Week Logic

- **Default behavior**: Uses the previous Monday as the start of the week
- **Monday start**: Weeks run Monday to Sunday (standard business week)
- **Perfect for Sunday/Monday runs**: Run on Sunday or Monday to get the previous week's content

## Output

The script creates a newsletter with:
- ✅ **Header** with week date range
- ✅ **Build logs section** with all posts from the week
- ✅ **Tools roundup** (you'll need to update this manually)
- ✅ **CTAs** for forwarding and getting involved
- ✅ **Footer** with branding

## Manual Steps

After running the script, you'll need to:

1. **Review the generated newsletter**
2. **Update the "Quick Tools Roundup"** section with any new tools (add **NEW** tags)
3. **Copy content into Beehiv**
4. **Send to subscribers**

## Example

```bash
$ node generate-newsletter.js 2025-09-09 "This week was wild. From launching the site in 3 hours to fixing database dramas and creating custom wordmarks, here's what went down in the trenches:"

📰 Generating newsletter for week: 2025-09-09 to 2025-09-16
📡 Fetching RSS feed...
📝 Parsing RSS feed...
🔍 Filtering posts from last week...
✅ Found 4 posts for this week:
   - Creating a Custom Wordmark for howibuild (2025-09-13)
   - How I Built This Site in 3 Hours (2025-09-12)
   - Why howibuild.ai Exists (2025-09-12)
   - Monorepo Mayhem & Database Drama (2025-09-12)
📰 Generating newsletter...
✅ Newsletter generated: weekly-wrap-2025-09-09.md
📁 Location: /path/to/newsletter/weekly-wrap-2025-09-09.md
```

## Customization

Edit `generate-newsletter.js` to customize:
- RSS URL
- Newsletter template
- Date formatting
- File naming
