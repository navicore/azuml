const makePipConnections = require('./pips').connect
const sortSubnets = require('../util').sortSubnets
const sh = require('shorthash');

const makeDiagId = (id) => {
  return 'id' + sh.unique(id)
}

const matchSourceAddressPrefix = (source, prefix) => {
  //console.log(`todo: more sophisticated match: prefix ${prefix} source ${source}`)
  return prefix === source
}

const connectCidrSubnets = (rule, armData, id) => {
  let result = ""
  Object.values(armData.subnetMap).forEach((subnet) => {
    const sid = makeDiagId(subnet.id)
    if (id !== sid && matchSourceAddressPrefix(subnet.properties.addressPrefix, rule.properties.sourceAddressPrefix))
      result += `${id} <- ${sid} : ${rule.name} (port ${rule.properties.destinationPortRange}) 
`
  })
  return result
}

const connectAllSubnets = (rule, armData, id) => {
  let result = ""
  Object.values(armData.subnetMap).forEach((subnet) => {
    const sid = makeDiagId(subnet.id)
    if (id !== sid)
      result += `${id} <- ${sid} : ${rule.name} (port ${rule.properties.destinationPortRange}) 
`
  })
  return result
}

const connectSubnets = (armData) => {
  let result = ""
  sortSubnets(Object.values(armData.subnetMap)).forEach((subnet) => {
    const id = makeDiagId(subnet.id)
    // todo: ensure there are explicit deny rules and/or sane default deny rules
    // iterate on rules
    if (!subnet.properties.networkSecurityGroup) {
      result += connectAllSubnets({name: "WARNING:\\nno subnet NSG\\nall ports open to vnet\\n", properties: {destinationPortRange: "*"}}, armData, id)
      return //bail - this subnet has no NSG
    }
    const nsg = armData.nsgMap[subnet.properties.networkSecurityGroup.id]
    if (!nsg || ! nsg.properties.securityRules) {
      console.log("WARNING, no nsg rules for " + subnet.properties.networkSecurityGroup.id)
      return
    }
    const rules = nsg.properties.securityRules
    rules.filter(rule => rule.properties.access !== 'Deny').forEach(rule => {
      if (rule.properties.sourceAddressPrefix === 'VirtualNetwork') {
        // map to ALL other subnets
        result += connectAllSubnets(rule, armData, id)
      } else if (rule.properties.sourceAddressPrefix === '*') {
        result += makePipConnections(rule, armData, id, subnet)
        result += connectAllSubnets(rule, armData, id)
      } else if (rule.properties.sourceAddressPrefix === 'INTERNET') {
        // connect pips to subnets and lbs
        result += makePipConnections(rule, armData, id, subnet)
      } else {
        // map to other subnets that match the cidr pattern
        result += connectCidrSubnets(rule, armData, id)
      }
    })
  })

  return Array.from(new Set(result.split('\n'))).join('\n') //no dupes
}

exports["connect"] = connectSubnets

