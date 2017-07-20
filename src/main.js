#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const azure = require('./azure').default
const diagram = require('./seqDiagram').default
const { exec } = require('child_process');

program
  .option('-g, --group [group]', 'set resource group [REQUIRED]')
  .parse(process.argv);

program.on('--help', function(){
  console.log('');
  console.log('Use above params to point to a resource group')
  console.log('that contains a VNet that has subnets, public')
  console.log('IPs, load balancers, and NSGs')
  console.log('')
  console.log('Set environment variables for:')
  console.log('  ARM_SUBSCRIPTION_ID')
  console.log('  ARM_CLIENT_ID')
  console.log('  ARM_CLIENT_SECRET')
  console.log('  ARM_TENANT_ID')
  console.log('  ')

})

if (!program.group || 
  !process.env.ARM_SUBSCRIPTION_ID || 
  !process.env.ARM_CLIENT_ID || 
  !process.env.ARM_CLIENT_SECRET || 
  !process.env.ARM_TENANT_ID
) {
  program.help()
}

azure(program.group).then((result) => {
  const d = diagram(result)
  fs.mkdir("out", () => {
    fs.writeFile(`out/seq-${program.group}.uml`, d, function (err) {
      if(err) throw new Error(err); 
      exec(`./bin/plantuml out/seq-${program.group}.uml`, (err, stdout, stderr) => {
        if(err) throw new Error(err); 
      });
    })
  })
}).catch((err) => {
  console.dir(err, {depth: null, colors: true})
})

