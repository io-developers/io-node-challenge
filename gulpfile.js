import gulp from "gulp";
import ts from "gulp-typescript";
import zip from "gulp-zip";
// Use a named import or import * as del to handle this
import * as del from "del";
import webpack from "webpack";
import webpackStream from "webpack-stream";

import webpackConfig from "./webpack.config.js"; // Import the Webpack configuration

import fs from "fs";
import path from "path";

const tsProject = ts.createProject("tsconfig.json");

const paths = {
  scripts: {
    src: "src/**/*.ts",
    dest: "dist",
  },
  handlers: {
    src: "dist",
  },
  packages: {
    dest: "packages",
  },
};

// Clean dist and packages folders
export function clean() {
  return del.deleteAsync(["dist", "packages"]); // Use deleteAsync for async/await or return a promise
}

// Transpile TypeScript to JavaScript
export function transpile() {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(paths.scripts.dest));
}

export function newTranspile() {
  return gulp
    .src("src/**/*.ts")
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest("dist"));
}

// Create ZIP packages for each Lambda function
export function packageLambdas(done) {
  const handlersPath = paths.handlers.src;
  const HANDLER_SUFIX = "Handler.js";
  // Read the directories inside the handlers folder
  const directories = fs
    .readdirSync(handlersPath, { withFileTypes: true })
    // .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name.replace(HANDLER_SUFIX, ""));

  // Create zip tasks
  const zipTasks = directories.map((dirName) => {
    console.log("dirName:::: ", dirName);
    const srcPath = path.join(handlersPath, dirName + HANDLER_SUFIX);
    const zipName = `${dirName}_lambda_function.zip`;
    return () =>
      gulp
        .src([`${srcPath}`, "node_modules/**/*"], { base: "." })
        .pipe(zip(zipName))
        .pipe(gulp.dest(paths.packages.dest));
  });

  // Run zip tasks in series
  gulp.series(...zipTasks)(done);
}

// Define complex tasks
export const build = gulp.series(clean, newTranspile, packageLambdas);

// Default task
export default build;
