import axios from 'axios';

export default function Request() {
    return {
        post: (url, data, callback) => {
            axios({ method:'POST', url:url, data:data })
            .then((r) => {
                try {
                    console.log('Request with POST, response :', r.data)
                    if(typeof callback === 'function') {
                        callback(null, r.data.data)
                    }
                } catch(err) {
                    console.log('Request with POST, error :', err)
                    if(typeof callback === 'function') {
                        callback(err, null)
                    }
                }
            })
            .catch((err) => {
                if(typeof callback === 'function') {
                    callback(err, null)
                }
            })
        }
    }
}