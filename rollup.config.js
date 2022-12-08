import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
// To handle css files
import postcss from "rollup-plugin-postcss";
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
// import image from '@rollup/plugin-image';
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import packageJson from "./package.json" assert {type: "json"};

const externals = {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-scripts': 'ReactScripts',
    "react/jsx-runtime": "react/jsx-runtime"
};

export default [
    {
        input: "src/index.ts",
        external: Object.keys(externals),
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true,
            },
            {
                "exports": "named",
                file: packageJson.module,
                // dir: 'esm/',
                format: "esm",
                sourcemap: true,
                preserveModules: false,
            }, {
                file: "dist/umd/bundle.js",
                format: "umd",
                exports: "named",
                extend: true,
                name: "HelloApp",
                sourcemap: true,
            },
        ],
        plugins: [
            peerDepsExternal(),
            resolve({
                browser: true
            }),
            commonjs(),
            typescript({tsconfig: "./tsconfig.json"}),
            postcss({
                minimize: true,
                extract: true,
                // modules: true,
            }),

            terser(),
            // image()
            babel({
                babelHelpers: 'bundled',
                presets: [
                    ["@babel/preset-react", {
                        runtime: 'classic',
                        useBuiltIns: "usage",
                        forceAllTransforms: true,
                    }]
                ],
            }),
            serve({
                open: true,
                verbose: true,
                contentBase: ["", "examples/html-umd/"],
                host: "localhost",
                port: 3000,
            }),
            livereload({watch: "dist"}),
        ],
    },
    {
        input: "dist/esm/types/index.d.ts",
        output: [{file: "dist/index.d.ts", format: "esm"}],
        plugins: [dts()],

        external: [/\.css$/, /\.scss$/], // telling rollup anything that is .css aren't part of type exports
    },
]