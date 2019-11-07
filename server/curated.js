const fs = require('fs');
const util = require('util');
const path = require('path');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

let pageCache = {};

async function readCuratedContent(page) {
	if (!pageCache[page]) {
		const json = await readFile(path.join(__dirname, `../src/curated/${page}.json`));
		pageCache[page] = JSON.parse(json);
	}
	return pageCache[page];
}

async function writeCuratedContent({ page, data }) {
	pageCache[page] = data;
	await writeFile(path.join(__dirname, `../src/curated/${page}.json`), JSON.stringify(data), { encoding: 'utf8' });
}

module.exports = { readCuratedContent, writeCuratedContent };
