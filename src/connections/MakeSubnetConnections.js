#!/usr/bin/env node
var sh = require('shorthash');
const makeDiagId = (id) => {
    return 'id' + sh.unique(id)
}

const make = (armData) => {
  var result = ""
  Object.values(armData.subnetMap).forEach((subnet) => {
    const id = makeDiagId(subnet.id)
    // todo:
  })

  return result
}

exports["default"] = make

