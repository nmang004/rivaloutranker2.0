#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix relative imports without extensions (from statements)
  content = content.replace(
    /(from ['"])(\.[^'"]*?)(?<!\.js)(?<!\/index)(['"];)/g,
    (match, prefix, importPath, suffix) => {
      modified = true;
      // Check if this is a directory import that should point to index
      const fullImportPath = path.resolve(path.dirname(filePath), importPath);
      if (fs.existsSync(fullImportPath) && fs.lstatSync(fullImportPath).isDirectory()) {
        return `${prefix}${importPath}/index.js${suffix}`;
      }
      return `${prefix}${importPath}.js${suffix}`;
    }
  );

  // Fix all imports without extensions
  content = content.replace(
    /(import\s+.*?from\s+['"])(\.[^'"]*?)(?<!\.js)(['"];)/g,
    (match, prefix, importPath, suffix) => {
      modified = true;
      // Check if this is a directory import that should point to index
      const fullImportPath = path.resolve(path.dirname(filePath), importPath);
      if (fs.existsSync(fullImportPath) && fs.lstatSync(fullImportPath).isDirectory()) {
        return `${prefix}${importPath}/index.js${suffix}`;
      }
      return `${prefix}${importPath}.js${suffix}`;
    }
  );

  // Fix require calls without extensions  
  content = content.replace(
    /require\(['"](\.[^'"]*?)(?<!\.js)['"]\)/g,
    (match, requirePath) => {
      modified = true;
      return `require('${requirePath}.js')`;
    }
  );

  // Fix path aliases to relative paths based on file location
  const relativePath = path.relative('./dist', filePath);
  const pathDepth = relativePath.split(path.sep).length - 1;
  const backPath = '../'.repeat(pathDepth);

  content = content.replace(
    /from ['"]@\/shared\/([^'"]*?)(?<!\.js)['"];/g,
    (match, importPath) => {
      modified = true;
      return `from '${backPath}shared/${importPath}.js';`;
    }
  );

  content = content.replace(
    /from ['"]@\/server\/([^'"]*?)(?<!\.js)['"];/g,
    (match, importPath) => {
      modified = true;
      return `from '${backPath}server/${importPath}.js';`;
    }
  );

  content = content.replace(
    /from ['"]@\/lib\/([^'"]*?)(?<!\.js)['"];/g,
    (match, importPath) => {
      modified = true;
      return `from '${backPath}lib/${importPath}.js';`;
    }
  );

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed imports in: ${filePath}`);
  }
}

function fixImportsInDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      fixImportsInDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      fixImportsInFile(fullPath);
    }
  }
}

console.log('Fixing ES module imports...');
fixImportsInDirectory('./dist');
console.log('Import fixing complete!');