let MessageContract = require('./class/message')
let contracts = require('require-all')({
    dirname     :  __dirname + '/contract',
    filter      :  /(.*)\.js$/,
    excludeDirs :  /^\.(git|svn)$/,
    recursive   : true
})

class MQInOne {
    DEFAULT_OPTIONS = {
        pollingWaitTime: 30
    }

    constructor(CONFIG, MQType, logger) {
        if (contracts[MQType]) {
            this.mq = new contracts[MQType](CONFIG, logger)
        } else {
            throw new Error(`Doesn't Support MQ Service [${MQType}]`)
        }
    }

    /* 使用底层 pollingMessage */
    pollingMessage(pollingWaitTime, handler) {
        if (typeof pollingWaitTime === 'function') {
            handler = pollingWaitTime
            pollingWaitTime = this.DEFAULT_OPTIONS.pollingWaitTime
        }

        this.mq.receiveMessage(pollingWaitTime)
            .then((message) => {
                handler(null, message)
                return setTimeout(() => {
                    this.pollingMessage(pollingWaitTime, handler)
                }, 0)
            }).catch((error) => {
                if (error.code !== 'MessageNotExist') {
                    handler(error)
                }
                return setTimeout(() => {
                    this.pollingMessage(pollingWaitTime, handler)
                }, 0)
            })
    }

    /**
     * To push message to mq
     *
     * @param {String} content - message content
     * @param {Object} options - options for the message
     * @return Promise<MessageContract>
     * */
    pushMessage (content, options = {}) {
        return this.mq.pushMessage(content, options)
    }

    /**
     * To receive message from MQ
     *
     * @param {Number} pollingWaitSeconds - The time that the client wait for the message
     * @return Promise<MessageContract>
     * */
    receiveMessage (pollingWaitSeconds = 5) {
        return this.mq.receiveMessage(pollingWaitSeconds)
    }


    /**
     * To receive message from MQ
     *
     * @param {MessageContract} message - The time that the client wait for the message
     * @return Promise<Message>
     * */
    consumeMessage (message) {
        return this.mq.consumeMessage(message)
    }
}

MQInOne.Message = MessageContract

module.exports = MQInOne
