Diagram Generator for Azure Subnets and NSGs
----

Create diagrams based on ARM API calls of your deployed Azure network.

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

* walk LBs to figure out connections from public
* walk PIPs to figure out connections from public
* sort subnets as bastion, public, ....., database, cicd via score of 1 to 5

