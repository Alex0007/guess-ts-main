const path = require("path");
const { _resolveMain, guessTsMain } = require("..");

test("Dummy internal test", () => {
  const packageJson = {
    main: "dist/utils/custom.js"
  };
  const tsconfigJson = {
    compilerOptions: {
      outDir: "dist"
    },
    include: ["src"]
  };
  const result = _resolveMain({ packageJson, tsconfigJson });

  expect(result.pathToMain).toBe("utils/custom.ts");
});

test("Dummy internal test 2", () => {
  const packageJson = {};
  const tsconfigJson = {
    compilerOptions: {},
    include: ["index.js"]
  };
  const result = _resolveMain({ packageJson, tsconfigJson });
  expect(result.pathToMain).toBe("index.ts");
});

test("Dummy package test", () => {
  const result = guessTsMain(path.resolve(__dirname, "sample-project"));

  expect(result).toContain("/sample-project/src/custom.ts");
});

test("Self package test", () => {
  const result = guessTsMain(path.resolve(__dirname, ".."));
  expect(result).toMatch(/\/guess-ts-main\/src\/index\.ts$/);
});
