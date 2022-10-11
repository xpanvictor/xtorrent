'use strict'

const cryp = require('crypto')

let id: Uint8Array | null = null

exports.genId = () => {
    if (!id) {
        id = cryp.randomBytes(20)
        Buffer.from('-XP0001-').copy(<Uint8Array>id, 0)
        console.log(id)
    }
    return id
}