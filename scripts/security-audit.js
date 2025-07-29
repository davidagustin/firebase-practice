const fs = require('fs');
const path = require('path');

// Security audit configuration
const SECURITY_CHECKS = {
  // Critical security issues
  critical: {
    'eval\\(': 'Critical: eval() can execute arbitrary code',
    'Function\\(': 'Critical: Function constructor can execute arbitrary code',
    'document.write': 'Critical: document.write can lead to XSS',
    'innerHTML': 'Warning: innerHTML can lead to XSS if not properly sanitized',
    'outerHTML': 'Warning: outerHTML can lead to XSS if not properly sanitized',
    'localStorage.setItem': 'Info: localStorage usage detected',
    'sessionStorage.setItem': 'Info: sessionStorage usage detected',
    'console.log': 'Info: console.log statements found (remove in production)',
    'console.error': 'Info: console.error statements found (remove in production)',
    'console.warn': 'Info: console.warn statements found (remove in production)',
    'apiKey.*=.*["\']': 'Warning: API keys in code (should be in environment)',
    'password.*=.*["\']': 'Critical: Hardcoded passwords detected',
    'secret.*=.*["\']': 'Critical: Hardcoded secrets detected',
    'token.*=.*["\']': 'Warning: Hardcoded tokens detected'
  },
  
  // Angular-specific security
  angular: {
    'bypassSecurityTrustHtml': 'Warning: Bypassing Angular security',
    'bypassSecurityTrustUrl': 'Warning: Bypassing Angular security',
    'bypassSecurityTrustResourceUrl': 'Warning: Bypassing Angular security',
    'bypassSecurityTrustScript': 'Critical: Bypassing Angular security for scripts',
    'bypassSecurityTrustStyle': 'Warning: Bypassing Angular security for styles',
    'DomSanitizer': 'Info: DomSanitizer usage detected',
    'SafeHtml': 'Info: SafeHtml usage detected',
    'SafeUrl': 'Info: SafeUrl usage detected'
  },
  
  // Firebase security
  firebase: {
    'allow read.*if true': 'Warning: Overly permissive Firestore rules',
    'allow write.*if true': 'Critical: Overly permissive Firestore rules',
    'request\.auth == null': 'Warning: Allowing unauthenticated access',
    'request\.auth != null': 'Info: Requiring authentication',
    'request\.auth\.uid': 'Info: User-specific access control'
  }
};

// Files to scan
const SCAN_PATTERNS = [
  'src/**/*.ts',
  'src/**/*.js',
  'src/**/*.html',
  'src/**/*.scss',
  'scripts/**/*.js',
  '*.json',
  '*.md'
];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Check for security patterns
    Object.entries(SECURITY_CHECKS).forEach(([category, patterns]) => {
      Object.entries(patterns).forEach(([pattern, message]) => {
        const regex = new RegExp(pattern, 'gi');
        const matches = content.match(regex);
        if (matches) {
          issues.push({
            category,
            pattern,
            message,
            count: matches.length,
            file: filePath
          });
        }
      });
    });
    
    return issues;
  } catch (error) {
    return [{
      category: 'error',
      pattern: 'file-read',
      message: `Error reading file: ${error.message}`,
      count: 1,
      file: filePath
    }];
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

function generateSecurityReport(issues) {
  const report = {
    summary: {
      total: issues.length,
      critical: issues.filter(i => i.message.includes('Critical:')).length,
      warnings: issues.filter(i => i.message.includes('Warning:')).length,
      info: issues.filter(i => i.message.includes('Info:')).length
    },
    issues: issues,
    recommendations: []
  };
  
  // Generate recommendations
  if (report.summary.critical > 0) {
    report.recommendations.push('🚨 CRITICAL: Address all critical security issues immediately');
  }
  
  if (report.summary.warnings > 0) {
    report.recommendations.push('⚠️ WARNING: Review and fix security warnings');
  }
  
  if (issues.some(i => i.message.includes('console.log'))) {
    report.recommendations.push('🧹 CLEANUP: Remove console.log statements for production');
  }
  
  if (issues.some(i => i.message.includes('apiKey'))) {
    report.recommendations.push('🔐 SECURITY: Move API keys to environment variables');
  }
  
  return report;
}

function printReport(report) {
  console.log('\n🔒 SECURITY AUDIT REPORT');
  console.log('=' .repeat(50));
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total Issues: ${report.summary.total}`);
  console.log(`   Critical: ${report.summary.critical}`);
  console.log(`   Warnings: ${report.summary.warnings}`);
  console.log(`   Info: ${report.summary.info}`);
  
  if (report.recommendations.length > 0) {
    console.log(`\n💡 Recommendations:`);
    report.recommendations.forEach(rec => console.log(`   ${rec}`));
  }
  
  if (report.issues.length > 0) {
    console.log(`\n🔍 Detailed Issues:`);
    
    // Group by category
    const grouped = report.issues.reduce((acc, issue) => {
      if (!acc[issue.category]) acc[issue.category] = [];
      acc[issue.category].push(issue);
      return acc;
    }, {});
    
    Object.entries(grouped).forEach(([category, categoryIssues]) => {
      console.log(`\n   ${category.toUpperCase()}:`);
      categoryIssues.forEach(issue => {
        console.log(`     ${issue.message}`);
        console.log(`       File: ${issue.file}`);
        console.log(`       Count: ${issue.count}`);
      });
    });
  }
  
  console.log('\n' + '=' .repeat(50));
}

async function runSecurityAudit() {
  try {
    console.log('🔒 Starting security audit...\n');
    
    const allFiles = getAllFiles('.', SCAN_PATTERNS);
    console.log(`📁 Scanning ${allFiles.length} files...`);
    
    let allIssues = [];
    
    allFiles.forEach(file => {
      const issues = scanFile(file);
      allIssues = allIssues.concat(issues);
    });
    
    const report = generateSecurityReport(allIssues);
    printReport(report);
    
    // Return exit code based on critical issues
    if (report.summary.critical > 0) {
      console.log('\n❌ Security audit failed - Critical issues found!');
      process.exit(1);
    } else {
      console.log('\n✅ Security audit passed!');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Security audit failed:', error.message);
    process.exit(1);
  }
}

runSecurityAudit(); 