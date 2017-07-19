create diagrams for Azure subnets and NSGs
----

# PREREQS

node >= v7

# INSTALL

```console
npm install -g https://github.com/navicore/azuml.git
```

# USAGE

run command with no args to get help

```console
azuml
```

png files and their source are created in `./out`

# TODOs

* walk LBs to figure out connections from public
* walk PIPs to figure out connections from public
* sort subnets as bastion, public, ....., database, cicd via score of 1 to 5

