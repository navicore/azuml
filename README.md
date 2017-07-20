Diagram Generator for Azure Subnets and NSGs
----

Automatically create diagrams based on ARM API calls of your deployed Azure network.

The resulting sequence diagram shows what ports are open to internal and external domains,
making it easy to quickly determine that the deployed system matches your intended design.

Visually verify security policy - ie: if your policy is that all ssh access is via a bastion host, you'll
visually verify via the  graphic that only the bastion host's port 22 is visible to the Internet.

## STATUS

Alpha.

Works for my specific needs.

Assumptions:

* a single resource group with a single vnet
* subnets have NSGs with explicit rules (default rules not yet evaluated)
* expects load balancer rules (NAT rules not yet supported)

## PREREQS

* node >= v7
* Azure service principal

## INSTALL

```console
npm install -g https://github.com/navicore/azuml.git
```

## USAGE

run command with no args to get help

```console
azuml
```

png files and their source are created in `./out`

## TODOs

* outbound rules
* option to expand all subnets to include VMs
* option to expand a single subnet to include VMs

