#!/usr/bin/env node
var nsgData = require('./nsg.json');
var subnetData = require('./subnets.json');

var nsgMap = nsgData.reduce(function(acc, nsg) {
  acc[nsg.id] = nsg;
  return acc;
}, {});

subnetData.forEach((subnet) => {
  console.log( `subnet ${subnet.name} uses ${nsgMap[subnet.networkSecurityGroup.id].name}` )
})

//console.log(JSON.stringify(nsgMap, 0, 2))
// nsgData.forEach((nsg) => {
//   console.log( `nsg ${nsg.name}` )
// })
//

