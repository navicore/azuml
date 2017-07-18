#!/usr/bin/env node

const make = (nsgMap, subnetMap) => {

  var result = ""
  result += "@startuml\n"

  const makeRoot = (subnet, seq) => {
  const diagram = `
  cloud "${subnet.name}" as cloud1${seq} {
    interface "interface1${seq}" as interface1${seq}
  }
  `
    result += `${diagram}\n`
  }

  const makeDiagram = (rootSeq, peerSubnet, seq) => {
  const diagram = `
  cloud "${peerSubnet.name}" as cloud2${seq} {
    interface "interface2${seq}" as interface2${seq}
  }
  interface1${rootSeq} -(0- interface2${seq}
  `
    result += `${diagram}\n`
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

  result += "\n@enduml\n"
  return result
}

exports["default"] = make

