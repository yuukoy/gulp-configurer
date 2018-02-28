import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/gulp-configurer.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
