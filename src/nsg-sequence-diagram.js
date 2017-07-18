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


const make = (vnet, nsgMap, subnetMap, pipMap, lbMap) => {

  var result = ""
  result += "@startuml\n"

  result += inetBox()
  result += azurePublicBoundryBox(pipMap, lbMap)
  result += azurePrivateNetBox(vnet, subnetMap)

  /*
  const makeRoot = (subnet, seq) => {
  const diagram = `
  cloud "${subnet.name}" as cloud1${seq} {
    interface "interface1${seq}" as interface1${seq}
  }
  `
    //result += `${diagram}\n`
  }

  const makeDiagram = (rootSeq, peerSubnet, seq) => {
  const diagram = `
  cloud "${peerSubnet.name}" as cloud2${seq} {
    interface "interface2${seq}" as interface2${seq}
  }
  interface1${rootSeq} -(0- interface2${seq}
  `
    //result += `${diagram}\n`
  }

  var seq = 0
  Object.values(subnetMap).forEach(
    (subnet) => {
      makeRoot(subnet, ++seq)
      const rootSeq = seq
      Object.values(subnetMap).forEach(
        (peerSubnet) => {
          if (subnet.id === peerSubnet.id) return
          makeDiagram(rootSeq, peerSubnet, seq++)
        }
      )
    }
  )
  */

  result += "\n@enduml\n"
  return result
}

exports["default"] = make

