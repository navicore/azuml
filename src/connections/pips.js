const sortSubnets = require("../util").sortSubnets;
const sh = require("shorthash");

const makeDiagId = id => {
  return "id" + sh.unique(id);
};

const connectUser = (id, port) => {
  if (`${port}`.includes("22"))
    return `${id} <- devops1 : (port ${port}) 
`;
  else
    return `${id} <- user1 : (port ${port}) 
`;
};

const connectNic = (ipConfigId, rule, armData, id, subnet) => {
  let result = "";
  const nicId = ipConfigId.substring(0, ipConfigId.indexOf("/ipConfigur"));
  const nic = armData.nicMap[nicId];
  nic.properties.ipConfigurations.forEach(ipconfig => {
    const subnetId = ipconfig.properties.subnet.id;
    if (subnetId === subnet.id) {
      const subnetShortId = makeDiagId(subnet.id);
      result += connectUser(id, rule.properties.destinationPortRange);
      result += `${subnetShortId} <- ${id} : ${rule.name} (port ${rule
        .properties.destinationPortRange}) 
`;
    }
  });
  return result;
};

const connectLb = (ipConfigId, rule, armData, id, subnet) => {
  let result = "";
  const lbId = ipConfigId.substring(
    0,
    ipConfigId.indexOf("/frontendIPConfigurations")
  );
  const lb = armData.lbMap[lbId];
  lb.properties.backendAddressPools.forEach(pool => {
    pool.properties.backendIPConfigurations.forEach(ipConfig => {
      const nicId = ipConfig.id.substring(
        0,
        ipConfig.id.indexOf("/ipConfigurations")
      );
      const nic = armData.nicMap[nicId];
      nic.properties.ipConfigurations.forEach(nicIpConfig => {
        const subnetId = nicIpConfig.properties.subnet.id;
        if (subnetId === subnet.id) {
          lb.properties.loadBalancingRules.forEach(lbRule => {
            const lbId = makeDiagId(lb.id);
            lb.properties.frontendIPConfigurations.forEach(frontendConfig => {
              const pipId = makeDiagId(
                frontendConfig.properties.publicIPAddress.id
              );
              const pipConn = `${pipId} -> ${lbId} : ${lbRule.name} (port ${lbRule
                .properties.frontendPort}) 
`;
              result += connectUser(pipId, lbRule.properties.frontendPort);
              if (!result.includes(pipConn)) result += pipConn; // draw pip connection
            });
            const subnetId = makeDiagId(subnet.id);
            const lbConn = `${subnetId} <- ${lbId} : ${rule.name} (port ${rule
              .properties.destinationPortRange}) 
`;
            if (!result.includes(lbConn)) result += lbConn; // draw load balancer connection
          });
        }
      });
    });
  });
  return result;
};

const connectPips = (rule, armData, id, subnet) => {
  let result = "";
  Object.values(armData.pipMap).forEach(pip => {
    const id = makeDiagId(pip.id);
    const ipConfigId = pip.properties.ipConfiguration.id;
    if (ipConfigId.includes("networkInterfaces")) {
      result += connectNic(ipConfigId, rule, armData, id, subnet);
    } else if (ipConfigId.includes("loadBalancers")) {
      result += connectLb(ipConfigId, rule, armData, id, subnet);
    }
  });

  return result;
};

exports["connect"] = connectPips;
