let { CMQ } = require('cmq-sdk'),
    MessageNotExistError = require('../error/MessageNotExist'),
    MessageContract = require('../class/message')

class cmq {
    constructor(CONFIG, logger) {
        this.logger = logger
        this.CONFIG = CONFIG

        this.CMQClient = CMQ.NEW({
            path: '/v2/index.php',
            signatureMethod: 'HmacSHA256',
            extranet: true,
            secretId: this.CONFIG.keyId,
            secretKey: this.CONFIG.keySecret,
            region: this.CONFIG.mqRegion
        })
    }

    receiveMessage (pollingWaitSeconds = 5) {
        return this.CMQClient.receiveMessage({
            queueName: this.CONFIG.queueName,
            pollingWaitSeconds
        }).then((message) => {
            if (message.code === 7000 || message.message.indexOf('no message') !== -1) {
                return Promise.reject(new MessageNotExistError({
                    requestId: message.requestId
                }))
            }

            return new MessageContract(message.msgBody,
                message.receiptHandle,
                {
                    dequeueCount:  message.dequeueCount,
                    messageId:  message.msgId,
                    enqueueTime: new Date(message.enqueueTime * 1000),
                    nextVisibleTime:  new Date(message.nextVisibleTime * 100),
                    firstDequeueTime:  new Date(message.firstDequeueTime * 100),
                }, message)
        }).catch(error => {
            if (error.code === 'ETIMEDOUT') {
                return Promise.reject(new MessageNotExistError())
            }
            return Promise.reject(error)
        })
    }

    pushMessage (content, options = {}) {
        return this.CMQClient.sendMessage({
            queueName: this.CONFIG.queueName,
            msgBody: content,
            delaySeconds: options.delaySeconds || cmq.DEFAULT_OPTIONS.delaySeconds
        }).then((result) => {
            return new MessageContract(content, null, {
                messageId: result.msgId
            }, result)
        })
    }

    consumeMessage (message) {
        return this.CMQClient.deleteMessage({
            queueName: this.CONFIG.queueName,
            receiptHandle: message.getHandler()
        })
            .then(result => {
                return result.code === 0
            })
    }
}

cmq.DEFAULT_OPTIONS = {
    delaySeconds: 0
}

module.exports = cmq
