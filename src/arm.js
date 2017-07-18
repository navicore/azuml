const program = require('commander');
const msRestAzure = require('ms-rest-azure');
const AzureServiceClient = msRestAzure.AzureServiceClient;

program
  .option('-g, --group [group]', 'set resource group [REQUIRED]')
  .parse(process.argv);

program.on('--help', function(){
  console.log('');
  console.log('Use above params to point to a resource group')
  console.log('that contains a VNet that has subnets, public')
  console.log('IPs, load balancers, and NSGs')
  console.log('');
  console.log('Set environment variables for:');
  console.log('  ARM_SUBSCRIPTION_ID');
  console.log('  ARM_CLIENT_ID');
  console.log('  ARM_CLIENT_SECRET');
  console.log('  ARM_TENANT_ID');
  console.log('  ');

});

if (!program.group || 
  !process.env.ARM_SUBSCRIPTION_ID || 
  !process.env.ARM_CLIENT_ID || 
  !process.env.ARM_CLIENT_SECRET || 
  !process.env.ARM_TENANT_ID
) {
  program.help()
}

const clientId = process.env['ARM_CLIENT_ID']
const secret = process.env['ARM_CLIENT_SECRET']
const domain = process.env['ARM_TENANT_ID']
const subscriptionId = process.env['ARM_SUBSCRIPTION_ID']

const apiVersion = "2016-09-01"
const resourceGroup = program.group

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

Promise.all([vnets, nsgs]).then((results) => {
  console.dir(results[0], {depth: null, colors: true})
  console.dir(results[1], {depth: null, colors: true})
}).catch((err) => {
  console.dir(err, {depth: null, colors: true})
})


