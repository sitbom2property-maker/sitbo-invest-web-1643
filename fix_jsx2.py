#!/usr/bin/env python3
import re

for fname in ['src/web/pages/invest.tsx', 'src/web/pages/mortgage.tsx', 'src/web/pages/project.tsx', 'src/web/pages/catalog.tsx', 'src/web/pages/index.tsx', 'src/web/pages/turnkey.tsx']:
    try:
        with open(fname, 'r') as f:
            content = f.read()
        
        # Fix children} -> {children}
        content = re.sub(r'>\s*children\}', '>{children}', content)
        content = re.sub(r'^\s+children\}$', '      {children}', content, flags=re.MULTILINE)
        
        # Fix array objects missing opening brace
        content = re.sub(r'^\s+label:\s*"', '    { label: "', content, flags=re.MULTILINE)
        content = re.sub(r'",\s*}\s*,\s*$', '" },', content, flags=re.MULTILINE)
        
        with open(fname, 'w') as f:
            f.write(content)
        print(f"Fixed {fname}")
    except Exception as e:
        print(f"Error {fname}: {e}")
