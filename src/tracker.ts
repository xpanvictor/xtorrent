
const dgram = require('dgram')
const urlParser = require('url').parse
const crypt = require('crypto')

exports.getPeers = (torrent: any, callback: (value: any) => {}) => {
    const socket = dgram.createSocket('udp4')
    const url = torrent.announce.toString('utf8')

    udpSend(socket, buildConnReq(), url)

    socket.on('message', (response: Buffer) => {
        if (respType(response) == 'connect') {
            const connResp = parseConnResp(response)

            const announceReq = buildAnnouceReq(connResp.connectionId)
            udpSend(socket, announceReq, url)
        } else if(respType(response) == 'announce') {
            const announceResp = parseAnnounceResp(response)
            callback(announceResp.peers)
        }
    })

}


function respType(response: any): string {

}


function udpSend(socket: any, message: string, rawUrl: URL, callback: VoidFunction = () => {}) {
    const url = urlParser(rawUrl)
    socket.send(message, 0, message.length, url.port, url.host, callback)
}

function buildConnReq() {
    const buf = Buffer.alloc(16)
    // write the connection id according to bep
    buf.writeUInt32BE(0x417, 0)
    buf.writeUInt32BE(0x27101980, 4)
    // the action which is connect
    buf.writeUInt32BE(0, 8)
    // now the transaction id
    crypt.randomBytes(4).copy(buf, 12)
    // now we have our 16bytes buffer
    return buf
}

function parseConnResp(response: Buffer) {
    return {
        action: response.readUInt32BE(0),
        transactionId: response.readUInt32BE(4),
        connectionId: response.slice(8)
    }
}

function buildAnnouceReq(connectionId: string) {

}

function announceReq() {

}

function parseAnnounceResp(response: any) {

}
