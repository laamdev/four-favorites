import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tailwindcss from 'eslint-plugin-tailwindcss'

export default [
  {
    extends: [
      'next/core-web-vitals',
      'prettier',
      'plugin:tailwindcss/recommended'
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
      tailwindcss: tailwindcss
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      'react/jsx-key': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'react-hooks/exhaustive-deps': 'error',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn'
    }
  }
]

// // export default {
// //   extends: [
// //     'next/core-web-vitals',
// //     'prettier',
// //     'plugin:tailwindcss/recommended'
// //   ],
// //   plugins: ['tailwindcss', 'simple-import-sort'],
// //   rules: {
// //     '@next/next/no-html-link-for-pages': 'off',
// //     'react/jsx-key': 'off',
// //     'tailwindcss/no-custom-classname': 'off',
// //     'react-hooks/exhaustive-deps': 'error',
// //     'simple-import-sort/imports': 'warn',
// //     'simple-import-sort/exports': 'warn'
// //   },
// //   settings: {
// //     tailwindcss: {
// //       callees: ['cn'],
// //       config: 'tailwind.config.js'
// //     },
// //     next: {
// //       rootDir: ['./']
// //     }
// //   },
// //   overrides: [
// //     {
// //       files: ['*.ts', '*.tsx'],
// //       parser: '@typescript-eslint/parser'
// //     }
// //   ]
// // }
