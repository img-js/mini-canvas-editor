const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version || !(/^\d+\.\d+\.\d+$/.test(version))) {
	console.log('Usage: node set-version.js 1.2.3');
	return;
}

const dependencies = [
	'mini-canvas-core',
	'mini-canvas-editor'
];

function resolvePath(filePath) {
	return path.join(__dirname, '..', filePath);
}

function updateDependencies(deps) {
	if (!deps) {
		return;
	}
	for (const name in deps) {
		if (dependencies.includes(name)) {
			deps[name] = `^${version}`;
		}
	}
}

function updatePackage(filePath, setVersion) {
	filePath = resolvePath(filePath);
	const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

	if (setVersion) {
		json['version'] = version;
	}
	updateDependencies(json['dependencies']);
	updateDependencies(json['peerDependencies']);
	updateDependencies(json['devDependencies']);

	fs.writeFileSync(filePath, JSON.stringify(json, null, '\t'), 'utf-8');
}

function updateJsdelivrUrl(filePath) {
	filePath = resolvePath(filePath);
	let text = fs.readFileSync(filePath, 'utf-8');

	text = text.replace(/\/\/cdn\.jsdelivr\.net\/npm\/mini-canvas-(editor|core)@\d+\.\d+\.\d+/g, (found) => {
		const parts = found.split('@');
		return `${parts[0]}@${version}`;
	});

	fs.writeFileSync(filePath, text, 'utf-8');
}

updatePackage('core/package.json', true);
updatePackage('editor/package.json', true);
updatePackage('demos/webpack-app/package.json', false);
updatePackage('demos/svelte-app/package.json', false);
updateJsdelivrUrl('README.md');
updateJsdelivrUrl('demos/webpack-app/public/vanilla-javascript.html');
