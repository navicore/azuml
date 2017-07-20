#!/usr/bin/env node
let sh = require('shorthash');
const makeDiagId = (id) => {
  return 'id' + sh.unique(id)
}

const matchSourceAddressPrefix = (prefix, source) => {
  console.log(`todo: prefix ${prefix} source ${source}`)
  return false
}

const connectCidSubnets = (rule, armData, id) => {
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

const connectNic = (ipConfigId, rule, armData, id, subnet) => {
  let result = ""
  const nicId = ipConfigId.substring(0, ipConfigId.indexOf('/ipConfigur'))
  const nic = armData.nicMap[nicId]
  nic.properties.ipConfigurations.forEach(ipconfig => {
    const subnetId = ipconfig.properties.subnet.id
    if (subnetId === subnet.id) {
      const subnetShortId = makeDiagId(subnet.id)
      result += `${subnetShortId} <- ${id} : ${rule.name} (port ${rule.properties.destinationPortRange}) 
`
    }
  })
  return result
}

const connectLb = (ipConfigId, rule, armData, id, subnet) => {
  let result = ""
  const lbId = ipConfigId.substring(0, ipConfigId.indexOf('/frontendIPConfigurations'))
  const lb = armData.lbMap[lbId]
  lb.properties.backendAddressPools.forEach(pool => {
    pool.properties.backendIPConfigurations.forEach(ipConfig => {
      const nicId = ipConfig.id.substring(0, ipConfig.id.indexOf('/ipConfigurations'))
      const nic = armData.nicMap[nicId]
      nic.properties.ipConfigurations.forEach(nicIpConfig => {
        const subnetId = nicIpConfig.properties.subnet.id
        if (subnetId === subnet.id) {
          lb.properties.loadBalancingRules.forEach(lbRule => {
            const lbId = makeDiagId(lb.id)
            lb.properties.frontendIPConfigurations.forEach(frontendConfig => {
              const pipId = makeDiagId(frontendConfig.properties.publicIPAddress.id)
              const pipConn = `${pipId} -> ${lbId} : ${lbRule.name} (port ${lbRule.properties.frontendPort}) 
`
              if (!result.includes(pipConn)) result += pipConn
            })
            const subnetId = makeDiagId(subnet.id)
            const lbConn = `${subnetId} <- ${lbId} : ${rule.name} (port ${rule.properties.destinationPortRange}) 
`
            if (!result.includes(lbConn)) result += lbConn
          })
        }
      })
    })
  })
  return result
}

const makePipConnections = (rule, armData, id, subnet) => {
  let result = ""
  Object.values(armData.pipMap).forEach((pip) => {
    const id = makeDiagId(pip.id)
    const ipConfigId = pip.properties.ipConfiguration.id
    if (ipConfigId.includes('networkInterfaces')) {
      result += connectNic(ipConfigId, rule, armData, id, subnet)
    } else if (ipConfigId.includes('loadBalancers')) {
      result += connectLb(ipConfigId, rule, armData, id, subnet)
    }
  })

  return result
}

const makeSubnetConnections = (armData) => {
  let result = ""
  Object.values(armData.subnetMap).forEach((subnet) => {
    const id = makeDiagId(subnet.id)
    // todo: ensure there are explicit deny rules and/or sane default deny rules
    // iterate on rules
    if (!subnet.properties.networkSecurityGroup) {
      result += connectAllSubnets({name: "WARNING:\\nno subnet NSG\\nall ports open to vnet\\n", properties: {destinationPortRange: "*"}}, armData, id)
      return //bail - this subnet has no NSG
    }
    const nsg = armData.nsgMap[subnet.properties.networkSecurityGroup.id]
    const rules = nsg.properties.securityRules
    rules.filter(rule => rule.properties.access !== 'Deny').forEach(rule => {
      if (rule.properties.sourceAddressPrefix === 'VirtualNetwork') {
        // map to ALL other subnets
        result += connectAllSubnets(rule, armData, id)
      } else if (rule.properties.sourceAddressPrefix === '*') {
        result += makePipConnections(rule, armData, id, subnet)
        result += connectAllSubnets(rule, armData, id)
      } else if (rule.properties.sourceAddressPrefix === 'INTERNET') {
        // map to pips and lbs
        result += makePipConnections(rule, armData, id, subnet)
      } else {
        // handle cidr
        result += connectCidSubnets(rule, armData, id)
      }
    })
  })

  return Array.from(new Set(result.split('\n'))).join('\n') //no dupes
}

exports["default"] = makeSubnetConnections

