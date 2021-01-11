let ALIMNS = require('ali-mns')


class mns {
    constructor(CONFIG, maxRetries, logger) {
        this.logger = logger
        this.CONFIG = CONFIG
        this.maxRetries = maxRetries

        this.AliAccount = new ALIMNS.Account(CONFIG.accountId, CONFIG.keyId, CONFIG.keySecret)
        this.MNSClient = new ALIMNS.MQ(CONFIG.queueName, this.AliAccount, CONFIG.mqRegion)

    }

    pollingMessage (handler) {
        this.MNSClient.notifyRecv((error, message) => {
            try{
                if (error) {
                    this.logger.error(error)
                    return
                }

                this.logger.info(message)

                if (this.maxRetries && parseInt(message.Message.DequeueCount) > this.maxRetries) {
                    this.logger.info(`Deleted Request ${message.Message.MessageId} due to too many failed attempts`)
                    return true
                }

                handler(message.Message.MessageBody, async (result) => {
                    if (result) {
                        await this.MNSClient.deleteP(message.Message.ReceiptHandle)
                    } else if (this.maxRetries && (parseInt(message.Message.DequeueCount) + 1) > this.maxRetries) {
                        this.logger.info(`Deleted Request ${message.Message.MessageId} due to too many failed attempts`)
                    }
                })
            }catch (e) {
                this.logger.error('pollingMessage Error', e)
            }
        })
    }

    pushMessage (message, options = {}) {
        return this.MNSClient.sendP(
            message,
            options.priority,
            options.delaySeconds
        )
    }
}

module.exports = mns
