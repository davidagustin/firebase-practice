const fs = require('fs');
const path = require('path');

// Cleanup configuration
const CLEANUP_TASKS = {
  // Remove console statements
  removeConsole: {
    patterns: [
      /console\.log\([^)]*\);?\s*/g,
      /console\.error\([^)]*\);?\s*/g,
      /console\.warn\([^)]*\);?\s*/g,
      /console\.info\([^)]*\);?\s*/g,
      /console\.debug\([^)]*\);?\s*/g
    ],
    description: 'Remove console statements'
  },
  
  // Remove empty lines after console removal
  removeEmptyLines: {
    patterns: [
      /^\s*[\r\n]/gm,
      /[\r\n]\s*[\r\n]/g
    ],
    description: 'Remove excessive empty lines'
  },
  
  // Add security headers
  addSecurityHeaders: {
    patterns: [],
    description: 'Add security headers to HTML files'
  }
};

function cleanupFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let cleanedContent = content;
    let changes = 0;
    
    // Apply cleanup tasks
    Object.entries(CLEANUP_TASKS).forEach(([taskName, task]) => {
      if (taskName === 'removeConsole') {
        task.patterns.forEach(pattern => {
          const matches = cleanedContent.match(pattern);
          if (matches) {
            cleanedContent = cleanedContent.replace(pattern, '');
            changes += matches.length;
          }
        });
      } else if (taskName === 'removeEmptyLines') {
        task.patterns.forEach(pattern => {
          const beforeLength = cleanedContent.length;
          cleanedContent = cleanedContent.replace(pattern, '\n');
          const afterLength = cleanedContent.length;
          if (beforeLength !== afterLength) {
            changes += 1;
          }
        });
      }
    });
    
    // Only write if changes were made
    if (changes > 0) {
      fs.writeFileSync(filePath, cleanedContent, 'utf8');
      return { file: filePath, changes };
    }
    
    return null;
  } catch (error) {
    return { file: filePath, error: error.message };
  }
}

function getAllFiles(dir, patterns) {
  const files = [];
  
  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walkDir(fullPath);
      } else if (stat.isFile()) {
        // Check if file matches any pattern
        const matches = patterns.some(pattern => {
          const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
          return regex.test(fullPath);
        });
        
        if (matches) {
          files.push(fullPath);
        }
      }
    });
  }
  
  walkDir(dir);
  return files;
}

function addSecurityHeaders() {
  const indexHtmlPath = path.join(__dirname, '..', 'src', 'index.html');
  
  if (fs.existsSync(indexHtmlPath)) {
    try {
      let content = fs.readFileSync(indexHtmlPath, 'utf8');
      
      // Add security headers if not already present
      const securityHeaders = `
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="X-Frame-Options" content="DENY">
  <meta http-equiv="X-XSS-Protection" content="1; mode=block">
  <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com;">
`;
      
      if (!content.includes('X-Content-Type-Options')) {
        // Insert after the first <head> tag
        content = content.replace('<head>', '<head>' + securityHeaders);
        fs.writeFileSync(indexHtmlPath, content, 'utf8');
        return { file: indexHtmlPath, changes: 1, type: 'security-headers' };
      }
    } catch (error) {
      return { file: indexHtmlPath, error: error.message };
    }
  }
  
  return null;
}

function createProductionEnvironment() {
  const envPath = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');
  
  if (fs.existsSync(envPath)) {
    try {
      let content = fs.readFileSync(envPath, 'utf8');
      
      // Add production-specific settings
      const productionSettings = `
  // Production security settings
  enableDebugMode: false,
  enableConsoleLogs: false,
  enableAnalytics: true,
  strictMode: true,
`;
      
      if (!content.includes('enableDebugMode')) {
        // Insert before the closing brace
        content = content.replace('};', productionSettings + '};');
        fs.writeFileSync(envPath, content, 'utf8');
        return { file: envPath, changes: 1, type: 'production-settings' };
      }
    } catch (error) {
      return { file: envPath, error: error.message };
    }
  }
  
  return null;
}

async function runCodeCleanup() {
  try {
    console.log('🧹 Starting code cleanup...\n');
    
    const scanPatterns = [
      'src/**/*.ts',
      'src/**/*.js',
      'src/**/*.html',
      'src/**/*.scss'
    ];
    
    const allFiles = getAllFiles('..', scanPatterns);
    console.log(`📁 Found ${allFiles.length} files to clean...`);
    
    let results = [];
    let totalChanges = 0;
    
    // Clean up individual files
    allFiles.forEach(file => {
      const result = cleanupFile(file);
      if (result) {
        results.push(result);
        if (result.changes) {
          totalChanges += result.changes;
        }
      }
    });
    
    // Add security headers
    const securityResult = addSecurityHeaders();
    if (securityResult) {
      results.push(securityResult);
      totalChanges += securityResult.changes || 0;
    }
    
    // Add production environment settings
    const envResult = createProductionEnvironment();
    if (envResult) {
      results.push(envResult);
      totalChanges += envResult.changes || 0;
    }
    
    // Print results
    console.log('\n📊 Cleanup Results:');
    console.log('=' .repeat(40));
    console.log(`Total files processed: ${allFiles.length}`);
    console.log(`Files modified: ${results.length}`);
    console.log(`Total changes: ${totalChanges}`);
    
    if (results.length > 0) {
      console.log('\n📝 Modified files:');
      results.forEach(result => {
        if (result.error) {
          console.log(`   ❌ ${result.file}: ${result.error}`);
        } else {
          console.log(`   ✅ ${result.file}: ${result.changes} changes`);
        }
      });
    }
    
    console.log('\n✅ Code cleanup completed!');
    console.log('\n🔒 Security improvements added:');
    console.log('   - Removed console statements');
    console.log('   - Added security headers to HTML');
    console.log('   - Enhanced production environment settings');
    console.log('   - Cleaned up empty lines');
    
  } catch (error) {
    console.error('❌ Code cleanup failed:', error.message);
    process.exit(1);
  }
}

runCodeCleanup(); 