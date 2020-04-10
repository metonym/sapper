import * as path from "path";
import RollupCompiler from "./RollupCompiler";
import { WebpackCompiler } from "./WebpackCompiler";
import { set_dev, set_src, set_dest } from "../../config/env";

export type Compiler = RollupCompiler | WebpackCompiler;

export type Compilers = {
  client: Compiler;
  server: Compiler;
};

export default async function create_compilers(
  bundler: "rollup" | "webpack",
  cwd: string,
  src: string,
  dest: string,
  dev: boolean
): Promise<Compilers> {
  set_dev(dev);
  set_src(src);
  set_dest(dest);

  if (bundler === "webpack") {
    const config = require(path.resolve(cwd, "webpack.config.js"));
    validate_config(config, "webpack");

    return {
      client: new WebpackCompiler(config.client),
      server: new WebpackCompiler(config.server),
    };
  }

  // this shouldn't be possible...
  throw new Error(`Invalid bundler option '${bundler}'`);
}

function validate_config(config: any, bundler: "rollup" | "webpack") {
  if (!config.client || !config.server) {
    throw new Error(
      `${bundler}.config.js must export a { client, server } object`
    );
  }
}
