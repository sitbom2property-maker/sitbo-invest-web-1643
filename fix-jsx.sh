#!/bin/bash
for file in src/web/pages/*.tsx; do
  # Find patterns like return (<> ... </div> ); and add </> before );
  perl -i -pe '
    if (/return \(<>/) {
      $in_return = 1;
    }
    if ($in_return && m{</div>\s*\n\s*\);}) {
      s{(</div>)\s*(\n\s*\);)}{$1\n  </>);};
      $in_return = 0;
    }
  ' "$file"
done
echo "Done"
