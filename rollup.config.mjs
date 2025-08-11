import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: './scripts/main.js',
  output: {
    file: './dist/bundle.js',
    format: 'iife', // Immediately Invoked Function Expression
    name: 'MyBundle', // Global variable name for the bundle
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ]
}

