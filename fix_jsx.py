#!/usr/bin/env python3
import re
import sys

def fix_jsx_fragments(content):
    # Find all return (<> ... ); patterns and ensure they have </>
    lines = content.split('\n')
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if 'return (<>' in line or 'return(<>' in line:
            # Start of a fragment, collect until );
            fragment_start = i
            result.append(line)
            i += 1
            depth = 1  # Count <>
            has_closing = False
            
            while i < len(lines) and depth > 0:
                current = lines[i]
                result.append(current)
                
                # Count <> and </>
                if '<>' in current:
                    depth += 1
                if '</>' in current:
                    depth -= 1
                    has_closing = True
                
                # If we see ); at the end, check if we need </>
                if current.strip().endswith(');') and depth > 0:
                    # Remove the ); from the last line
                    result[-1] = current.rstrip().rstrip(');')
                    # Add </> and then );
                    result[-1] += '\n  </>);'
                    depth = 0
                
                i += 1
        else:
            result.append(line)
            i += 1
    
    return '\n'.join(result)

for fname in sys.argv[1:]:
    with open(fname, 'r') as f:
        content = f.read()
    fixed = fix_jsx_fragments(content)
    with open(fname, 'w') as f:
        f.write(fixed)
    print(f"Fixed {fname}")
