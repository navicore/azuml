#!/usr/bin/env node

var nsgData = require('./data/nsg.json');
var subnetData = require('./data/subnets.json');

var nsgMap = nsgData.reduce(function(acc, nsg) {
  acc[nsg.id] = nsg;
  return acc;
}, {});

const makeRoot = (subnet, seq) => {
const diagram = `
cloud "${subnet.name}" as cloud1${seq} {
  interface "interface1${seq}" as interface1${seq}
}
`
  console.log(diagram)
}

const makeDiagram = (rootSeq, peerSubnet, seq) => {
const diagram = `
cloud "${peerSubnet.name}" as cloud2${seq} {
  interface "interface2${seq}" as interface2${seq}
}
interface1${rootSeq} -(0- interface2${seq}
`
  console.log(diagram)
}

var seq = 0
subnetData.forEach(
  (subnet) => {
    console.log(`@startuml`)
    makeRoot(subnet, ++seq)
    const rootSeq = seq
    subnetData.forEach(
      (peerSubnet) => {
        if (subnet.id === peerSubnet.id) return
        makeDiagram(rootSeq, peerSubnet, seq++)
      }
    )
    console.log(`@enduml`)
  }
)

//console.log( `subnet ${subnet.name} uses ${nsgMap[subnet.networkSecurityGroup.id].name}` )

