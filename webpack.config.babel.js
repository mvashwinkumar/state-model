import { join } from 'path'
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'
import webpack from 'webpack'

const context = join(__dirname, 'src/lib')

export default {
    context,
    entry: './diff',
    output: {
        path: join(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: 'StateModel'
    },
    devTool: 'source-map',
    externals: [
        "jquery"
    ],
    module: {
        loaders: [
            // { test: /\.js$/, loaders: ['babel'], include: context },
            {
      'loader': 'babel',
      'test': /\.js$/,
      'exclude': /node_modules/,
      'query': {
        'plugins': ['lodash'],
        'presets': ['es2015']
      }
    },
            { test: /\.json$/, loaders: ['json'], include: context }
        ]
    },
    plugins: [
        new LodashModuleReplacementPlugin({
            'cloning': true
        }),
        new webpack.optimize.OccurrenceOrderPlugin,
        new webpack.optimize.UglifyJsPlugin
    ]
}