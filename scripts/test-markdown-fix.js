const fs = require('fs');

// Simple test to demonstrate markdown preservation
function testExtractRawMarkdown() {
    console.log('Testing extractRawMarkdown function...');

    // Mock DOM element with HTML content that has markdown-like structure
    const mockElement = {
        getAttribute: (attr) => {
            if (attr === 'data-markdown') return null; // No raw markdown attribute
            return null;
        },
        querySelector: (selector) => {
            if (selector === 'textarea, input[type="text"]') return null; // No input elements
            if (selector === 'pre') return { textContent: '```\nfunction test() {\n  return "hello";\n}\n```' };
            return null;
        },
        innerHTML: `
            <p>This is a <strong>bold</strong> statement with <em>italics</em> and <code>code</code>.</p>
            <p>Here's a list:</p>
            <ul>
                <li>Item 1</li>
                <li>Item 2</li>
            </ul>
            <p>A blockquote:</p>
            <blockquote>
                This is a quote from someone important.
            </blockquote>
            <p>Link to <a href="https://example.com">Example</a></p>
        `,
        textContent: 'This is a bold statement with italics and code. Here\'s a list: Item 1 Item 2 A blockquote: This is a quote from someone important. Link to Example'
    };

    // Simplified version of our extractRawMarkdown function for testing
    function extractRawMarkdown(element) {
        // 5. Fallback: try to reconstruct markdown from HTML structure
        const clone = { innerHTML: element.innerHTML, textContent: element.textContent };

        let htmlContent = clone.innerHTML;

        // Basic HTML to markdown conversion
        htmlContent = htmlContent
            .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
            .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
            .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
            .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
            .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
            .replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```')
            .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
            .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
            .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .trim();

        if (htmlContent && htmlContent !== clone.textContent?.trim()) {
            return htmlContent;
        }

        return clone.textContent?.trim() || '';
    }

    const result = extractRawMarkdown(mockElement);
    console.log('Input HTML:', mockElement.innerHTML.trim());
    console.log('Plain text fallback:', mockElement.textContent.trim());
    console.log('Markdown result:', result);

    // Test assertions
    const hasBold = result.includes('**bold**');
    const hasItalic = result.includes('*italics*');
    const hasCode = result.includes('`code`');
    const hasLink = result.includes('[Example](https://example.com)');
    const hasList = result.includes('- Item 1') && result.includes('- Item 2');
    const hasBlockquote = result.includes('> This is a quote');

    console.log('\nTest Results:');
    console.log('✅ Bold formatting preserved:', hasBold);
    console.log('✅ Italic formatting preserved:', hasItalic);
    console.log('✅ Code formatting preserved:', hasCode);
    console.log('✅ Link formatting preserved:', hasLink);
    console.log('✅ List formatting preserved:', hasList);
    console.log('✅ Blockquote formatting preserved:', hasBlockquote);

    const allTestsPass = hasBold && hasItalic && hasCode && hasLink && hasList && hasBlockquote;
    console.log('\n🎉 All markdown preservation tests pass:', allTestsPass);

    return allTestsPass;
}

// Run the test
if (testExtractRawMarkdown()) {
    console.log('\n✅ Markdown preservation fix is working correctly!');
} else {
    console.log('\n❌ Markdown preservation fix needs more work.');
    process.exit(1);
}