module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    '@vue/typescript',
    '@vue/prettier',
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

      "comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          exports: "always-multiline",
          functions: "never",
        },
      ],
      "no-unused-vars": ["off"],
    "vue/require-prop-types":["off"]
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
