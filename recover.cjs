const fs = require('fs');
const path = require('path');

const logFile = '/Users/dasoda/.gemini/antigravity/brain/72a8b1e5-ac0a-4b34-a5c8-046b7f71d457/.system_generated/logs/overview.txt';
const targetFile = '/Users/dasoda/Desktop/봉봉단 홈페이지/src/app/pages/ApplyVolunteer.tsx';

const content = fs.readFileSync(logFile, 'utf8');
const lines = content.split('\n');

let currentCode = fs.readFileSync(targetFile, 'utf8');

const replacements = [];

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const data = JSON.parse(line);
    if (data.source === 'MODEL' && data.tool_calls) {
      for (const call of data.tool_calls) {
        if (call.name === 'multi_replace_file_content' || call.name === 'replace_file_content') {
          const args = call.args;
          // Clean up the target file name
          let file = args.TargetFile || '';
          file = file.replace(/^"|"$/g, '');
          if (file === targetFile) {
            replacements.push(args);
          }
        }
      }
    }
  } catch (e) {
    // ignore parse errors
  }
}

console.log(`Found ${replacements.length} replacement actions for ApplyVolunteer.tsx`);

// Apply them sequentially
let codeLines = currentCode.split('\n');

for (let i = 0; i < replacements.length; i++) {
  const args = replacements[i];
  
  if (args.Instruction) console.log(`Applying: ${args.Instruction}`);
  
  let chunks = [];
  if (args.ReplacementChunks) {
    try {
      chunks = JSON.parse(args.ReplacementChunks.replace(/^"|"$/g, ''));
    } catch(e) {
      if (typeof args.ReplacementChunks === 'string') {
        try {
            chunks = JSON.parse(args.ReplacementChunks);
        } catch(err) {
            console.log("Could not parse chunks");
        }
      }
    }
  } else if (args.ReplacementContent) {
    chunks = [{
      StartLine: parseInt(args.StartLine.replace(/"/g, '')),
      EndLine: parseInt(args.EndLine.replace(/"/g, '')),
      ReplacementContent: args.ReplacementContent.replace(/^"|"$/g, '').replace(/\\n/g, '\n'),
      TargetContent: args.TargetContent.replace(/^"|"$/g, '').replace(/\\n/g, '\n')
    }];
  }

  // To apply chunks, we sort them by StartLine descending so we don't mess up indices
  chunks.sort((a, b) => b.StartLine - a.StartLine);
  
  for (const chunk of chunks) {
    const startIdx = chunk.StartLine - 1;
    const endIdx = chunk.EndLine - 1;
    const newContent = chunk.ReplacementContent.split('\n');
    
    // Replace the lines
    codeLines.splice(startIdx, endIdx - startIdx + 1, ...newContent);
  }
}

fs.writeFileSync(targetFile, codeLines.join('\n'));
console.log('Recovery complete!');
