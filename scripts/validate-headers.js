const fs = require('fs');
const path = require('path');

function validateUserscript(filePath) {
    console.log('Validating userscript:', filePath);

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        // Check for userscript header
        if (!lines[0].startsWith('// ==UserScript==')) {
            console.error('❌ Missing userscript header');
            return false;
        }

        // Find the end of the header
        let headerEnd = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('// ==/UserScript==')) {
                headerEnd = i;
                break;
            }
        }

        if (headerEnd === -1) {
            console.error('❌ Missing userscript header end');
            return false;
        }

        // Validate header fields
        const headerLines = lines.slice(1, headerEnd);
        const requiredFields = ['name', 'version', 'author'];
        const foundFields = [];

        headerLines.forEach(line => {
            const match = line.match(/^\/\/ @(\w+)\s+/);
            if (match) {
                foundFields.push(match[1]);
            }
        });

        const missingFields = requiredFields.filter(field => !foundFields.includes(field));
        if (missingFields.length > 0) {
            console.error('❌ Missing required header fields:', missingFields.map(f => '@' + f).join(', '));
            return false;
        }

        // Check for syntax errors (basic check)
        const scriptContent = lines.slice(headerEnd + 1).join('\n');

        // Try to parse as JavaScript
        try {
            new Function(scriptContent);
            console.log('✅ Userscript header validation passed');
            return true;
        } catch (syntaxError) {
            console.error('❌ JavaScript syntax error:', syntaxError.message);
            return false;
        }

    } catch (error) {
        console.error('❌ Error reading file:', error.message);
        return false;
    }
}

// Main validation
const userscriptPath = path.join(__dirname, '..', 'Enhanced Grok Export v2.4-2.4.1.user.js');

if (!fs.existsSync(userscriptPath)) {
    console.error('❌ Userscript file not found:', userscriptPath);
    process.exit(1);
}

const isValid = validateUserscript(userscriptPath);
if (!isValid) {
    process.exit(1);
}

console.log('✅ Userscript validation completed successfully');