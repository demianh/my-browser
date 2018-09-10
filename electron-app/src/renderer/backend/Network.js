import axios from 'axios'
export class Network {
  getBaseUrl () {
    return ''
  }
  GET (url) {
    url = this.getBaseUrl() + url
    return new Promise((resolve, reject) => {
      console.log('Loading URL: ' + url)
      axios.get(url).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
