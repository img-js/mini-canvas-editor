import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const external = Object.keys(packageJson.dependencies ?? []);

const ts = typescript({
	useTsconfigDeclarationDir: true
});

export default [
	{
		input: './src/index.ts',
		plugins: [
			ts,
			terser()
		],
		external,
		cache: false,
		output: [
			{
				file: './lib/esm/index.js',
				format: 'es'
			},
			{
				file: './lib/cjs/index.cjs',
				format: 'cjs'
			}
		]
	},
	{
		input: './build/index.d.ts',
		output: [
			{
				file: './lib/index.d.ts',
				format: 'es'
			}
		],
		plugins: [dts()],
	},
	{
		input: './src/index.ts',
		plugins: [
			nodeResolve({
				browser: true,
			}),
			ts,
			terser()
		],
		external: [
			'mini-canvas-core'
		],
		output: [
			{
				file: './dist/index.umd.js',
				format: 'umd',
				name: 'miniCanvasEditor'
			}
		]
	}
];
