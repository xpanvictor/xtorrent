'use strict'

const fs = require('fs')
const bencode = require('bencode')

const tracker = require('./tracker')


const torrent = bencode.decode(fs.readFileSync(__dirname + '/dsa.torrent'))

tracker.getPeers(torrent, (peers: Array<any>) => {
    console.log('list of peers: ', peers)
})
