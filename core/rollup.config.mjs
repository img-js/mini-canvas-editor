import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const external = Object.keys(packageJson.dependencies);

const ts = typescript({
	useTsconfigDeclarationDir: true
});

function bundle(fileName, node) {
	return [
		{
			input: './src/index.ts',
			plugins: [
				node ? replace({
					preventAssignment: true,
					delimiters: ['', ''],
					values: {
						'\'fabric\'': '\'fabric/node\'',
					}
				}) : false,
				ts,
				terser()
			],
			cache: false,
			external,
			output: [
				{
					file: `./lib/cjs/${fileName}.cjs`,
					format: 'cjs'
				},
				{
					file: `./lib/esm/${fileName}.js`,
					format: 'es'
				}
			]
		},
		{
			input: `./build/index.d.ts`,
			output: [
				{
					file: `./lib/${fileName}.d.ts`,
					format: 'es'
				}
			],
			plugins: [dts()],
		}
	];
}

export default [
	...bundle('index.browser', false),
	...bundle('index.node', true),
	{
		input: './src/index.ts',
		plugins: [
			nodeResolve({
				browser: true,
			}),
			ts,
			terser()
		],
		output: [
			{
				file: './dist/index.umd.js',
				format: 'umd',
				name: 'miniCanvasCore'
			}
		]
	}
];
