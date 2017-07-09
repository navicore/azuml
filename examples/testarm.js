const msrest = require('ms-rest');
const msRestAzure = require('ms-rest-azure');
const AzureServiceClient = msRestAzure.AzureServiceClient;

const clientId = process.env['ARM_CLIENT_ID'];
const secret = process.env['ARM_CLIENT_SECRET'];
const tenantId = process.env['ARM_TENANT_ID']
const subscriptionId = process.env['ARM_SUBSCRIPTION_ID']
var client;

const apiVersion = "2016-09-01"
const resourceGroup = "s00159sb"

/*
// get vnet and subnets
msRestAzure.loginWithServicePrincipalSecret(clientId, secret, tenantId).then((creds) => {
  client = new AzureServiceClient(creds);
  let options = {
    method: 'GET',
    url: `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/virtualnetworks?api-version=${apiVersion}`,
    headers: {
      'user-agent': 'MyTestApp/1.0'
    }
  }
  return client.sendRequest(options);
}).then((result) => {
  console.dir("---------------- vnet info ----------------")
  console.dir(result, {depth: null, colors: true});
}).catch((err) => {
  console.dir(err, {depth: null, colors: true});
});

// get nsgs
msRestAzure.loginWithServicePrincipalSecret(clientId, secret, tenantId).then((creds) => {
  client = new AzureServiceClient(creds);
  let options = {
    method: 'GET',
    url: `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/networkSecurityGroups?api-version=${apiVersion}`,
    headers: {
      'user-agent': 'MyTestApp/1.0'
    }
  }
  return client.sendRequest(options);
}).then((result) => {
  console.dir("---------------- nsg info ----------------")
  console.dir(result, {depth: null, colors: true});
}).catch((err) => {
  console.dir(err, {depth: null, colors: true});
});


// get pips
msRestAzure.loginWithServicePrincipalSecret(clientId, secret, tenantId).then((creds) => {
  client = new AzureServiceClient(creds);
  let options = {
    method: 'GET',
    url: `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/publicIPAddresses?api-version=${apiVersion}`,
    headers: {
      'user-agent': 'MyTestApp/1.0'
    }
  }
  return client.sendRequest(options);
}).then((result) => {
  console.dir("---------------- pip info ----------------")
  console.dir(result, {depth: null, colors: true});
}).catch((err) => {
  console.dir(err, {depth: null, colors: true});
});

msRestAzure.loginWithServicePrincipalSecret(clientId, secret, tenantId).then((creds) => {
  client = new AzureServiceClient(creds);
  let options = {
    method: 'GET',
    url: `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/networkInterfaces?api-version=${apiVersion}`,
    headers: {
      'user-agent': 'MyTestApp/1.0'
    }
  }
  return client.sendRequest(options);
}).then((result) => {
  console.dir("---------------- pip info ----------------")
  console.dir(result, {depth: null, colors: true});
}).catch((err) => {
  console.dir(err, {depth: null, colors: true});
});
*/


// get lbs
msRestAzure.loginWithServicePrincipalSecret(clientId, secret, tenantId).then((creds) => {
  client = new AzureServiceClient(creds);
  let options = {
    method: 'GET',
    url: `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/loadBalancers?api-version=${apiVersion}`,
    headers: {
      'user-agent': 'MyTestApp/1.0'
    }
  }
  return client.sendRequest(options);
}).then((result) => {
  console.dir("---------------- pip info ----------------")
  console.dir(result, {depth: null, colors: true});
}).catch((err) => {
  console.dir(err, {depth: null, colors: true});
});

