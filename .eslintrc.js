module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended'
  ],
  plugins: [
    'svelte3',
    'html'
  ],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  rules: {
    semi: ['error', 'never']
  }
}
