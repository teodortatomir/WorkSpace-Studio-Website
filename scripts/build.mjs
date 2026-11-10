import { buildSite } from './lib/build.mjs';

const result = await buildSite();
console.log(`Built ${result.codeFiles} code files and ${result.assets} assets in ${result.output}`);
