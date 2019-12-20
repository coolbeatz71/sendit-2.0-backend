module.exports = {
  extends: ['./node_modules/poetic/config/eslint/eslint-config.js'],
  // Add custom rules here
  rules: {
    'import/imports-first': true,
    'one-var': 0,
    'one-var-declaration-per-line': 0,
    'new-cap': 0,
    'consistent-return': 0,
    'no-param-reassign': 0,
    'comma-dangle': 0,
    'eact/no-string-refs': 0,
    curly: ['error', 'multi-line'],
    'import/no-unresolved': [
      2,
      {
        commonjs: true,
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'no-shadow': [
      'error',
      {
        allow: ['req', 'res', 'err'],
      },
    ],
    'valid-jsdoc': [
      'error',
      {
        requireReturn: true,
        requireReturnType: true,
        requireParamDescription: false,
        requireReturnDescription: true,
      },
    ],
    'require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
        },
      },
    ],
  },
};
