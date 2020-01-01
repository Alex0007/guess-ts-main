import * as fs from "fs";
import * as path from "path";

export const _resolveMain = ({
  packageJson,
  tsconfigJson
}: any): {
  sources: string[];
  pathToMain: string;
} => {
  const sources: string[] = [...tsconfigJson.include];
  const outDir = tsconfigJson.compilerOptions?.outDir;
  const main = packageJson.main || "index.js";

  const outDirRegex = new RegExp(`^${outDir}`);

  const temp = main.replace(outDirRegex, "");
  const parseResult = path.parse(temp);

  return {
    sources,
    pathToMain: path.join(
      parseResult.dir.replace(/^\//, ""),
      parseResult.name + ".ts"
    )
  };
};

export const guessTsMain = (projectPath: string) => {
  let tsconfigJson = null;
  let packageJson = null;

  try {
    tsconfigJson = require(path.resolve(projectPath, "tsconfig.json"));
    packageJson = require(path.resolve(projectPath, "package.json"));
  } catch (e) {
    throw new Error(
      `tsconfig.json or package.json is missing at path: ${projectPath}`
    );
  }

  const { pathToMain, sources } = _resolveMain({ packageJson, tsconfigJson });

  const results = sources.map(source => {
    const checkPath = path.resolve(
      projectPath,
      fs.lstatSync(source).isDirectory() ? source : path.join(source, ".."),
      pathToMain
    );
    const exists = fs.existsSync(checkPath);
    return { checkPath, exists };
  });

  return (results.find(_ => _.exists) || results[0]).checkPath;
};

export default guessTsMain;
