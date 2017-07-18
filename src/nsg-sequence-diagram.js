#!/usr/bin/env node
var sh = require('shorthash');

const inetBox = () => {
  var result = `
box "Internet" #LightGreen
  actor "User App User" as user2
  actor "DEVOPS eng" as user1
end box
`
  return result
}

const makeDiagId = (id) => {
    return 'id' + sh.unique(id)
}

const azurePublicBoundryBox = (pipMap, lbMap) => {
  var result = `
box "Azure Internet Boundary" #White

`
  Object.values(pipMap).forEach((pip) => {

    const pipid = makeDiagId(pip.id)
    result += `  collections "${pip.name} \\nPublic IP" as ${pipid}\n`

  })

  Object.values(lbMap).forEach((lb) => {

    const lbid = makeDiagId(lb.id)
    result += `  control "${lb.name} \\nLoad Balancer" as ${lbid}\n`

  })

  result += `
end box
`
  return result
}

const azurePrivateNetBox = (vnet, subnetMap) => {
  var result = `
box "Private Azure VNET ${vnet.name}" #LightBlue

`
  Object.values(subnetMap).forEach((subnet) => {

    const snid = makeDiagId(subnet.name)
    result += `  collections "${subnet.name} \\nSubnet" as ${snid}\n`

  })

  result += `
end box

`
  return result
}

const deActivateLbs = (lbMap) => {
  var result = ""
  Object.values(lbMap).forEach((lb) => {
    const id = makeDiagId(lb.id)
    result += `deactivate ${id}\n`
  })
  return result
}
const activateLbs = (lbMap) => {
  var result = ""

  Object.values(lbMap).forEach((lb) => {
    const id = makeDiagId(lb.id)
    result += `activate ${id}\n`
  })
  return result
}

const makeConnections = (vnet, nsgMap, subnetMap, pipMap, lbMap) => {
  var result = ""
  Object.values(pipMap).forEach((pip) => {
    const id = makeDiagId(pip.id)
    result += `user1 -> ${id} : ports???\n`
  })

  return result
}

const make = (vnet, nsgMap, subnetMap, pipMap, lbMap) => {

  var result = ""
  result += "@startuml\n"

  result += inetBox()
  result += azurePublicBoundryBox(pipMap, lbMap)
  result += azurePrivateNetBox(vnet, subnetMap)

  result += activateLbs(lbMap)
  result += makeConnections(vnet, nsgMap, subnetMap, pipMap, lbMap)
  result += deActivateLbs(lbMap)

  result += "\n@enduml\n"
  return result
}

exports["default"] = make

