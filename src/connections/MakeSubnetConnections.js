#!/usr/bin/env node
var sh = require('shorthash');
const makeDiagId = (id) => {
  return 'id' + sh.unique(id)
}

const matchSourceAddressPrefix = (prefix, source) => {
  console.log(`todo: prefix ${prefix} source ${source}`)
  return false
}

const connectCidSubnets = (rule, armData, id) => {
  var result = ""
  Object.values(armData.subnetMap).forEach((subnet) => {
    const sid = makeDiagId(subnet.id)
    if (id !== sid && matchSourceAddressPrefix(subnet.properties.addressPrefix, rule.properties.sourceAddressPrefix))
      result += `${id} <- ${sid} : ${rule.name} (port ${rule.properties.destinationPortRange}) 
`
  })
  return result
}

const connectFromInternet = (rule, armData, id) => {
  console.log(JSON.stringify(armData.lbMap, 0, 2))
  console.log(`todo: allow from inet`)
  var result = ""
  return result
}

const connectAllSubnets = (rule, armData, id) => {
  var result = ""
  Object.values(armData.subnetMap).forEach((subnet) => {
    const sid = makeDiagId(subnet.id)
    if (id !== sid)
      result += `${id} <- ${sid} : ${rule.name} (port ${rule.properties.destinationPortRange}) 
`
  })
  return result
}

const make = (armData) => {
  var result = ""
  Object.values(armData.subnetMap).forEach((subnet) => {
    const id = makeDiagId(subnet.id)
    // todo: ensure there are explicit deny rules and/or sane default deny rules
    // iterate on rules
    const nsg = armData.nsgMap[subnet.properties.networkSecurityGroup.id]
    const rules = nsg.properties.securityRules
    rules.filter(rule => rule.properties.access !== 'Deny').forEach(rule => {
      if (rule.properties.sourceAddressPrefix === 'VirtualNetwork') {
        // map to ALL other subnets
        result += connectAllSubnets(rule, armData, id)
      } else if (rule.properties.sourceAddressPrefix === '*') {
        result += connectAllSubnets(rule, armData, id)
        result += connectFromInternet(rule, armData, id)
      } else if (rule.properties.sourceAddressPrefix === 'INTERNET') {
        // map to pips and lbs
        result += connectFromInternet(rule, armData, id)
      } else {
        // handle cidr
        result += connectCidSubnets(rule, armData, id)
      }
    })
  })

  return result
}

exports["default"] = make

