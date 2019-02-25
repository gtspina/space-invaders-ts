import butternut from 'rollup-plugin-butternut';

const config = [
    {
        input: './build_ts/main.js',
        output: {
            file: './build/js/main.js',
            format: 'iife'
        },
        //plugins: [ butternut() ]
    }
];

export default config;