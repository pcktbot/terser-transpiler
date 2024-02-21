import fs from 'fs';
import path from 'path';
import {transform} from '@babel/core';
import {minify} from 'terser';

const outputDir = path.join(process.cwd(), 'builds');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const [inputFilePath] = process.argv.slice(2);

if (!inputFilePath) {
  console.error('Please provide a file path.');
  process.exit(1);
}

const outputFilePath = path.join(outputDir, path.basename(inputFilePath));
const inputFileContent = fs.readFileSync(inputFilePath, 'utf8');

transform(inputFileContent, {
  presets: ['@babel/preset-env'],
}, (err, babelResult) => {
  if (err) {
    console.error('Babel transformation error:', err);
    return;
  }

  minify(babelResult.code).then((terserResult) => {
    if (terserResult.error) {
      console.error('Terser minification error:', terserResult.error);
      return;
    }
    console.log(terserResult);
    fs.writeFileSync(outputFilePath, terserResult.code);
    console.log(`Processed file saved as: ${outputFilePath}`);
  });
});
