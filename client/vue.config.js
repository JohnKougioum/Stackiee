const path = require('path');

module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000'
            }
        }
    },
    css:{
        loaderOptions:{
            sass:{
                additionalData: `@import "@/assets/common.scss";`
            }
        }
    }
}