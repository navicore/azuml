const msRestAzure = require('ms-rest-azure')
const AzureServiceClient = msRestAzure.AzureServiceClient

const armMeta = (resourceGroup) => {

  const clientId = process.env['ARM_CLIENT_ID']
  const secret = process.env['ARM_CLIENT_SECRET']
  const domain = process.env['ARM_TENANT_ID']
  const subscriptionId = process.env['ARM_SUBSCRIPTION_ID']

  const apiVersion = "2016-09-01"

  const vnetUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/virtualnetworks?api-version=${apiVersion}`
  const nsgUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/networkSecurityGroups?api-version=${apiVersion}`
  const pipUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/publicIPAddresses?api-version=${apiVersion}`
  const lbUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/loadBalancers?api-version=${apiVersion}`

  const listResources = (url) => msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain).then((creds) => {
    client = new AzureServiceClient(creds);
    let options = {
      method: 'GET',
      url: url,
      headers: {
        'user-agent': 'AzUml/1.0'
      }
    }
    return client.sendRequest(options)
  })

  const vnets = msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain).then((creds) => {
    return listResources(vnetUrl)
  })

  const nsgs = msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain).then((creds) => {
    return listResources(nsgUrl)
  })

  const pips = msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain).then((creds) => {
    return listResources(pipUrl)
  })

  const lbs = msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain).then((creds) => {
    return listResources(lbUrl)
  })

  return Promise.all([vnets, nsgs, pips, lbs]).then((results) => {

    if (results[0].value.length !== 1) throw Error('Resource group must have a single VirtualNetowrk.')

    var vnet = results[0].value[0]

    var subnetByCidMap = results[0].value[0].properties.subnets.reduce(function(acc, o) {
      acc[o.properties.addressPrefix] = o;
      return acc;
    }, {});

    var subnetMap = results[0].value[0].properties.subnets.reduce(function(acc, o) {
      acc[o.id] = o;
      return acc;
    }, {});

    var nsgMap = results[1].value.reduce(function(acc, o) {
      acc[o.id] = o;
      return acc;
    }, {});

    var pipMap = results[2].value.reduce(function(acc, o) {
      acc[o.id] = o;
      return acc;
    }, {});

    var lbMap = results[3].value.reduce(function(acc, o) {
      acc[o.id] = o;
      return acc;
    }, {});

    return {vnet, subnetMap, nsgMap, pipMap, lbMap, subnetByCidMap}

  })
}

exports["default"] = armMeta

