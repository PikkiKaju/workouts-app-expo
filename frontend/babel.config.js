module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ["./"],
          alias: {
            "@": "./src",
            "app": "./src/app",
            "assets": "./src/assets",
            "components": "./src/components",
            "constants": "./src/constants",
            "data": "./src/data",
            "hooks": "./src/hooks",
            "models": "./src/models",
            "providers": "./src/providers",
          },
        }
      ],
    ],
  };
};
