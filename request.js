const https = require('https')
module.exports = (config, callback, body) => {
    const req = https.request(config, function (res) {
        let data = ''
        res.on('data', function (chunk) {
            data += chunk
        })
        res.on('end', function () {
            callback(data, res)
        })
    })
    if (body) {
        if (typeof body == 'object') req.write(JSON.stringify(body))
        else req.write(body)
    }
    req.end()
}