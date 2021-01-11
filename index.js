let contracts = require('require-all')({
    dirname     :  __dirname + '/contract',
    filter      :  /(.*)\.js$/,
    excludeDirs :  /^\.(git|svn)$/,
    recursive   : true
})

class MQInOne {
    constructor(CONFIG, MQType, logger) {
        console.log(contracts)

        if (contracts[MQType]) {
            this.mq = new contracts[MQType](CONFIG, logger)
        } else {
            throw new Error(`Doesn't Support MQ Service [${MQType}]`)
        }
    }

    /* 使用底层 pollingMessage */
    pollingMessage(maxRetries, handler) {
        return this.mq.pollingMessage(maxRetries, handler)
    }
}

module.exports = MQInOne
