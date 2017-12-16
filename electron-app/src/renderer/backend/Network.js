
import Vue from 'vue'

import axios from 'axios'

Vue.mixin({
    methods: {
        _getBaseUrl: function() {
            return '';
        },
        loadUrl: function (url) {
            url = this._getBaseUrl() + url;
            return new Promise(
                function(resolve, reject) {
                    console.log('Loading URL: ' + url);
                    axios.get(url).then((response) => {
                        resolve(response.data);
                    }).catch((error) => {
                        reject(error);
                    });
                }
            );
        }
    }
});
