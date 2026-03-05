const fs = require('fs');
const content = fs.readFileSync('lib/translations.ts', 'utf8');

// A simple but robust way is to use Babel or TS compiler API to do this perfectly, 
// or since this is a simple text file with "key: value," format, we can parse it line by line.
// We have two main sections: 'es:' and 'en:'.

let lines = content.split('\n');
let newLines = [];
let currentLang = null;
let seenKeys = new Set();
let inTranslations = false;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  if (line.match(/^export const translations = {/)) {
    inTranslations = true;
    newLines.push(line);
    continue;
  }
  
  if (inTranslations && line.match(/^  (es|en): {/)) {
    currentLang = line.match(/^  (es|en): {/)[1];
    seenKeys.clear();
    newLines.push(line);
    continue;
  }
  
  if (inTranslations && currentLang && line.match(/^  },?/)) {
    currentLang = null;
    newLines.push(line);
    continue;
  }
  
  if (inTranslations && currentLang) {
    // Try to match a key-value pair line
    // e.g. "    myKey: 'myValue'," or '    "my-key": "myValue",'
    const match = line.match(/^    ([a-zA-Z0-9_]+|"[a-zA-Z0-9_-]+"):/);
    if (match) {
      const key = match[1];
      if (seenKeys.has(key)) {
        // Skip duplicate
        console.log(`Skipping duplicate key ${key} in ${currentLang}`);
        continue;
      } else {
        seenKeys.add(key);
      }
    }
  }
  
  newLines.push(line);
}

fs.writeFileSync('lib/translations.ts', newLines.join('\n'));
