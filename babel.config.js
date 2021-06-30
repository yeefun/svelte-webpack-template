module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: 'defaults, not IE 11',
        },
        ignoreBrowserslistConfig: true,
        // debug: true,
        bugfixes: true,
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true },
      },
    ],
  ];
  const plugins = [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-runtime',
  ];

  return {
    presets,
    plugins,
  };
};
