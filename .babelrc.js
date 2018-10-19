
const target = process.env.BABEL_ENV || 'esm';

module.exports = {
    presets: [
        ['@babel/env', {
            targets: {
                browsers: [
                    '>0.1%',
                    'not dead',
                    'not OperaMini all',
                    'not IE < 11',
                    'last 2 Edge versions',
                ],
            },
            
            // Have babel add in polyfills automatically based on usage
            // https://github.com/babel/babel-preset-env/issues/203
            useBuiltIns: 'usage',
            
            // Whether to transpile modules
            modules: target === 'cjs' ? 'commonjs' : false,
        }],
    ],
    plugins: [
        '@babel/proposal-object-rest-spread',     // `{ ...obj }`
    ],
};
