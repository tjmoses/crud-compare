const ClosureCompiler = require('google-closure-compiler').compiler;
const fs = require('fs');

console.log(ClosureCompiler.COMPILER_PATH); // absolute path to the compiler jar
console.log(ClosureCompiler.CONTRIB_PATH); // absolute path to the contrib folder which contain externs

const compileLevels = {
  WHITESPACE_ONLY: 'WHITESPACE_ONLY',
  SIMPLE_OPTIMIZATIONS: 'SIMPLE_OPTIMIZATIONS',
  ADVANCED_OPTIMIZATIONS: 'ADVANCED_OPTIMIZATIONS'
}

const closureCompiler = new ClosureCompiler({
  js: ['dist/index.js', 'dist/helpers.js', 'dist/main.js', 'dist/validation.js'],
  module_resolution: 'node',
  process_common_js_modules: true,
  compilation_level: compileLevels.ADVANCED_OPTIMIZATIONS
});

const compilerProcess = closureCompiler.run((exitCode, stdOut, stdErr) => {
  console.error(stdErr);
  fs.writeFile('dist/out.js', stdOut, error => {
    if (error) {
      console.error(error);
      return;
    }
  });
});
