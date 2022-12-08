import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';
export default {
  input: './src/ChainApi.js',
  output: {
    file: './dist/burgerswapjssdk.js',
    format: 'umd',
    name: 'burgerswapjssdk',
    globals: {
      web3: 'web3',
      WalletConnect: 'WalletConnect',
    },
    intro: 'const global = window;'
  },
  externals: ["web3", "WalletConnect"],

  runtimeHelpers: false,
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({
			preferBuiltins: true,
			mainFields: ['browser']
		}),

    // terser(),

    json(),
    builtins(),
    commonjs({
      include: ['node_modules/**'],
      sourceMap: false
    }),
  ],
};
