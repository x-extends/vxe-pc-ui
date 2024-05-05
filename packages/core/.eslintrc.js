module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      objectLiteralDuplicateProperties: false
    }
  },
  env: {
    amd: true,
    browser: true,
    node: true
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'prettier/@typescript-eslint',
    'standard'
  ],
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'no-debugger': ['error'],
    'keyword-spacing': ['error']
  }
}
