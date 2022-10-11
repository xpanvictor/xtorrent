'use strict';
const cryp = require('crypto');
let id = null;
exports.genId = () => {
    if (!id) {
        id = cryp.randomBytes(20);
        Buffer.from('-XP0001-').copy(id, 0);
        console.log(id);
    }
    return id;
};
