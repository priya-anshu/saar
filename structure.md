```
saar/
├── next.config.ts
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                           ← class picker
│   ├── class/[n]/page.tsx                 ← subject tabs + notes list
│   └── note/[n]/[subject]/[slug]/page.tsx ← note viewer
├── components/
│   ├── ClassView.tsx                      ← tabs + animated list
│   └── ThreeViewer.tsx                    ← .glb viewer (three.js)
├── lib/
│   ├── data.ts                            ← classes, subjects, types
│   ├── icons.ts                           ← icon maps
│   └── notes.ts                           ← reads files from public/notes
└── public/notes/<class>/<subject>/YYYY-MM-DD_title.ext
```