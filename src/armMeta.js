const msRestAzure = require('ms-rest-azure')
const AzureServiceClient = msRestAzure.AzureServiceClient

const armMeta = (resourceGroup) => {

  const clientId = process.env['ARM_CLIENT_ID']
  const secret = process.env['ARM_CLIENT_SECRET']
  const domain = process.env['ARM_TENANT_ID']
  const subscriptionId = process.env['ARM_SUBSCRIPTION_ID']

  const apiVersion = "2016-09-01"

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
    const url = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/virtualnetworks?api-version=${apiVersion}`
    return listResources(url)
  })

  const nsgs = msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain).then((creds) => {
    const url = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/networkSecurityGroups?api-version=${apiVersion}`
    return listResources(url)
  })

  return Promise.all([vnets, nsgs]).then((results) => {

    if (results[0].value.length !== 1) throw Error('Resource group must have a single VirtualNetowrk.')

    var vnetMap = results[0].value.reduce(function(acc, nsg) {
      acc[nsg.id] = nsg;
      return acc;
    }, {});

    var subnetMap = results[0].value[0].properties.subnets.reduce(function(acc, nsg) {
      acc[nsg.id] = nsg;
      return acc;
    }, {});

    var nsgMap = results[1].value.reduce(function(acc, nsg) {
      acc[nsg.id] = nsg;
      return acc;
    }, {});

    return {vnetMap, subnetMap, nsgMap}

  })
}

exports["default"] = armMeta

