module.exports = function (options = {}) {
    let error = new Error()
    error.message = 'Message Not Exist'
    error.code = 'MessageNotExist'
    error.requestId = options.requestId
    error.hostId = options.hostId

    return error
}
