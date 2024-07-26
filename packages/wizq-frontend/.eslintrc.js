module.exports = {
  extends: '../../.eslintrc.js',
  rules: {
    '@typescript-eslint/no-unsafe-member-access': 'error',
    // allow leading underscore for "private" imports
    '@typescript-eslint/naming-convention': [
      2,
      {
        leadingUnderscore: 'allow',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        selector: 'variable',
      },
    ],
    // allow to use style jsx, see https://nextjs.org/blog/styling-next-with-styled-jsx
    'react/no-unknown-property': [2, { ignore: ['jsx', 'global'] }],
    // sometimes we want to try but not to catch
    'no-empty': ['error', { allowEmptyCatch: true }],
  },
  env: {
    browser: true,
    node: true,
  },
  globals: { document: true, window: true, fetch: true },
};
