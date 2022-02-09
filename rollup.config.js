import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const name = 'newtClient';

export default [
  // cjs
  {
    input: './src/index.ts',
    output: [
      {
        file: `./dist/cjs/${name}.js`,
        sourcemap: 'inline',
        format: 'cjs',
      },
    ],
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [
      typescript({ useTsconfigDeclarationDir: true }),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.js'],
        presets: [['@babel/preset-env', { targets: { node: '16' } }]],
      }),
      terser(),
    ],
  },
  // esm
  {
    input: './src/index.ts',
    output: [
      {
        file: `./dist/esm/${name}.js`,
        sourcemap: 'inline',
        format: 'esm',
      },
    ],
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [
      typescript({
        tsconfigOverride: { compilerOptions: { declaration: false } },
      }),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.js'],
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                edge: '90',
                firefox: '90',
                chrome: '90',
                safari: '13',
                node: '16',
              },
            },
          ],
        ],
      }),
      terser(),
    ],
  },
  // umd
  {
    input: './src/index.ts',
    output: [
      {
        name: name,
        file: `./dist/umd/${name}.js`,
        format: 'umd',
      },
    ],
    plugins: [
      nodeResolve({ browser: true }),
      typescript({
        tsconfigOverride: { compilerOptions: { declaration: false } },
      }),
      commonjs({ extensions: ['.ts', '.js'] }),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.js'],
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                edge: '90',
                firefox: '90',
                chrome: '90',
                safari: '13',
              },
            },
          ],
        ],
      }),
      terser(),
    ],
  },
];
