import axios from 'axios'

export class Network {
    private getBaseUrl() {
        return '';
    }

    public GET(url) {

        url = this.getBaseUrl() + url;
        return new Promise((resolve, reject) => {
                console.log('🌐 Loading URL: ' + url);
                axios.get(url).then((response) => {
                    resolve(response.data);
                }).catch((error) => {
                    reject(error);
                });
            }
        );
    }
}
