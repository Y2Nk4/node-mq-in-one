let ALIMNS = require('ali-mns'),
    MessageNotExistError = require('../error/MessageNotExist'),
    MessageContract = require('../class/message')


class mns {
    constructor(CONFIG, logger) {
        this.logger = logger
        this.CONFIG = CONFIG

        this.AliAccount = new ALIMNS.Account(CONFIG.accountId, CONFIG.keyId, CONFIG.keySecret)
        this.MNSClient = new ALIMNS.MQ(CONFIG.queueName, this.AliAccount, CONFIG.mqRegion)

    }

    receiveMessage (pollingWaitSeconds = 5) {
        return this.MNSClient.recvP(pollingWaitSeconds).then(message => {
            return new MessageContract(
                message.Message.MessageBody,
                message.Message.ReceiptHandle,
                {
                    enqueueTime: new Date(parseInt(message.Message.EnqueueTime)),
                    dequeueCount:  message.Message.DequeueCount,
                    nextVisibleTime:  new Date(parseInt(message.Message.NextVisibleTime)),
                    priority:  message.Message.Priority,
                    firstDequeueTime:  new Date(parseInt(message.Message.FirstDequeueTime)),
                    messageId:  message.Message.MessageId,
                    mqType: mns.mqType
                },
                message
            )
        }).catch(error => {
            if (error.Error.Code === 'MessageNotExist') {
                return Promise.reject(new MessageNotExistError({
                    requestId: error.Error.RequestId,
                    hostId: error.Error.HostId,
                }))
            }
            return Promise.reject(error)
        })
    }

    pushMessage (message, options = {}) {
        return this.MNSClient.sendP(
            message,
            options.priority,
            options.delaySeconds
        ).then((sentResult) => {
            return new MessageContract(
                message,
                null,
                {
                    messageId:  sentResult.Message.MessageId,
                    mqType: mns.mqType
                },
                sentResult
            )
        })
    }

    consumeMessage (message) {
        return this.MNSClient.deleteP(message.getHandler())
            .then(result => {
                return result === 204
            })
    }
}

mns.mqType = 'mns'

module.exports = mns
