#!/usr/bin/env node
var sh = require('shorthash');
const makeDiagId = (id) => {
      return 'id' + sh.unique(id)
}

const make = (armData) => {
    var result = ""
    Object.values(armData.pipMap).forEach((pip) => {
          const id = makeDiagId(pip.id)
          result += `user1 -> ${id} : ports???\n`
          result += `user2 -> ${id} : ports???\n`
        })

    return result
}

exports["default"] = make

