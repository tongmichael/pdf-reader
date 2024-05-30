module.exports = {
    publicPath: '',
    devServer: {
        port: process.env.PORT || 42000,
        host: '0.0.0.0',
        // https: true,
        proxy: {
            '/api/': {
                changeOrigin: true,
                pathRewrite: {},
                target: 'http://devops4.sucsoft.com:31458/',
                ws: true
            },
            '/file/': {
                changeOrigin: true,
                pathRewrite: {},
                target: 'http://172.18.200.102:5333/',
                ws: true
            }
        }
    },
    configureWebpack: {
        externals: process.env.NODE_ENV === 'production'
            ? {
                'vue-pdf': {
                    commonjs: 'vue-pdf',
                    commonjs2: 'vue-pdf'
                },
                'vue-virtual-scroller': {
                    commonjs: 'vue-virtual-scroller',
                    commonjs2: 'vue-virtual-scroller'
                },
                'axios': {
                    commonjs: 'axios',
                    commonjs2: 'axios'
                },
                'vue-property-decorator': {
                    commonjs: 'vue-property-decorator',
                    commonjs2: 'vue-property-decorator'
                },
                'vue-class-component': {
                    commonjs: 'vue-class-component',
                    commonjs2: 'vue-class-component'
                },
                'core-js': {
                    commonjs: 'core-js',
                    commonjs2: 'core-js'
                },
                'tslib': {
                    commonjs: 'tslib',
                    commonjs2: 'tslib'
                }
            }
            : {}
    }
};
