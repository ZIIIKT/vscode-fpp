//@ts-check
import * as esbuild from 'esbuild';

const options = {
    watch: process.argv.includes('--watch'),
    minify: process.argv.includes('--minify'),
};

const successMessage = options.watch
    ? 'Watch build succeeded'
    : 'Build succeeded';

/** @type {import('esbuild').Plugin[]} */
const plugins = [
    {
        name: 'watch-plugin',
        setup(build) {
            build.onEnd((result) => {
                if (result.errors.length === 0) {
                    console.log(getTime() + successMessage);
                }
            });
        },
    },
];

const nodeContext = await esbuild.context({
    entryPoints: [
        'src/extension.ts',
        'src/parser/worker.ts',
    ],
    outdir: 'out',
    entryNames: '[name]', // Make sure extension.js and worker.js are placed under `out/`
    bundle: true,
    target: 'es2022',
    format: 'cjs',
    loader: { '.ts': 'ts' },
    outExtension: {
        '.js': '.js',
    },
    external: ['vscode'],
    platform: 'node',
    sourcemap: 'inline',
    minify: options.minify,
    plugins,
});

const browserContext = await esbuild.context({
    entryPoints: [
        'src-webview/main.ts',
    ],
    outdir: 'out',
    bundle: true,
    target: 'es2022',
    loader: { '.ts': 'ts', '.css': 'css' },
    platform: 'browser',
    sourcemap: 'inline',
    minify: options.minify,
    plugins,
    external: ['sprotty', 'sprotty-vscode-webview'],
});

if (options.watch) {
    await Promise.all([
        nodeContext.watch(),
        browserContext.watch()
    ]);
} else {
    await Promise.all([
        nodeContext.rebuild(),
        browserContext.rebuild()
    ]);
    nodeContext.dispose();
    browserContext.dispose();
}

function getTime() {
    const date = new Date();
    return `[${`${padZeroes(date.getHours())}:${padZeroes(
        date.getMinutes()
    )}:${padZeroes(date.getSeconds())}`}] `;
}

/**
 * @param {number} i
 */
function padZeroes(i) {
    return i.toString().padStart(2, '0');
}
