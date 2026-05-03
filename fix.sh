#!/bin/bash
# Fix children} in JSX
for file in src/web/pages/*.tsx src/web/components/*.tsx; do
  [ -f "$file" ] || continue
  # Pattern 1: >children} at the start of line or after newline
  sed -i 's/>children}/>{children}</g' "$file"
  # Pattern 2: just children} on its own line (inside JSX content)
  sed -i 's/^    children}$/    {children}/' "$file"
  sed -i 's/^      children}$/      {children}/' "$file"
  sed -i 's/^        children}$/        {children}/' "$file"
done
echo "Done"
