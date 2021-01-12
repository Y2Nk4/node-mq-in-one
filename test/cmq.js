let config = require('./config/cmq_config'),
    log4js = require('log4js')
    mqInOne = require('../index')

let logger = log4js.getLogger('default')

let mq = new mqInOne(config, config.mqType, logger)

/*mq.receiveMessage(2)
    .then((message) => {
        console.log('received', message)
        return mq.consumeMessage(message)
    })
    .then(result => {
        console.log('deleted result', result)
    })*/

// mq.pollingMessage(30, (error, message) => {
//     console.log('polling:', error, message)
//     return mq.consumeMessage(message)
// })

mq.pushMessage('test message', {
    delaySeconds: 2
}).then((result) => {
    console.log('sent', result)
})
