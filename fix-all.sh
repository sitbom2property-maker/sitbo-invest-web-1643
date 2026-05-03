#!/bin/bash
for file in src/web/pages/*.tsx src/web/components/*.tsx; do
  [ -f "$file" ] || continue
  # Replace patterns where return (<> doesn't have matching </>
  perl -i -pe '
    if (/return \(<>/) {
      $in_return = 1;
      $brace_count = 0;
    }
    if ($in_return) {
      $brace_count += tr/<{/</;
      $brace_count -= tr/>}/>/;
      if (/^ *\);$/ && $brace_count > 0) {
        s/^( *)\);$/$1<\/>);/;
        $in_return = 0;
      }
    }
  ' "$file"
done
echo "Done"
