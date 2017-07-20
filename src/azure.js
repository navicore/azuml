const assert = require("assert");
const msRestAzure = require("ms-rest-azure");
const AzureServiceClient = msRestAzure.AzureServiceClient;

const armMeta = resourceGroup => {
  const clientId = process.env["ARM_CLIENT_ID"];
  const secret = process.env["ARM_CLIENT_SECRET"];
  const domain = process.env["ARM_TENANT_ID"];
  const subscriptionId = process.env["ARM_SUBSCRIPTION_ID"];

  const apiVersion = "2016-09-01";

  const vnetUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/virtualnetworks?api-version=${apiVersion}`;
  const nsgUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/networkSecurityGroups?api-version=${apiVersion}`;
  const pipUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/publicIPAddresses?api-version=${apiVersion}`;
  const lbUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/loadBalancers?api-version=${apiVersion}`;
  const nicUrl = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Network/networkInterfaces?api-version=${apiVersion}`;

  const listResources = url =>
    msRestAzure
      .loginWithServicePrincipalSecret(clientId, secret, domain)
      .then(creds => {
        client = new AzureServiceClient(creds);
        let options = {
          method: "GET",
          url: url,
          headers: {
            "user-agent": "AzUml/1.0"
          }
        };
        return client.sendRequest(options);
      });

  const metaPromisses = [vnetUrl, nsgUrl, pipUrl, lbUrl, nicUrl].map(url => {
    return msRestAzure
      .loginWithServicePrincipalSecret(clientId, secret, domain)
      .then(creds => {
        return listResources(url);
      });
  });

  const reduceToMap = o => {
    return o.reduce(function(acc, o) {
      acc[o.id] = o;
      return acc;
    }, {});
  };

  return Promise.all(metaPromisses).then(results => {
    if (results[0].value.length !== 1)
      throw Error("Resource group must have a single VirtualNetowrk.");

    var vnet = results[0].value[0];

    var subnetByCidMap = results[0].value[0].properties.subnets.reduce(function(
      acc,
      o
    ) {
      acc[o.properties.addressPrefix] = o;
      return acc;
    }, {});

    var subnetMap = reduceToMap(results[0].value[0].properties.subnets);
    assert(subnetMap);
    var nsgMap = reduceToMap(results[1].value);
    assert(nsgMap);
    var pipMap = reduceToMap(results[2].value);
    assert(pipMap);
    var lbMap = reduceToMap(results[3].value);
    assert(lbMap);
    var nicMap = reduceToMap(results[4].value);
    assert(nicMap);

    return { vnet, subnetMap, nsgMap, pipMap, lbMap, subnetByCidMap, nicMap };
  });
};

exports["default"] = armMeta;
