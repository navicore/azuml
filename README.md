Diagram Generator for Azure Subnets and NSGs
----

Create diagrams based on ARM API calls of your deployed Azure network.

## STATUS

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

