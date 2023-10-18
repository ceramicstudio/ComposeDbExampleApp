kind: ConfigMap
metadata:
  name: ipfs-container-init-0
apiVersion: v1
data:
  001-config.sh: |
    #!/bin/sh
    set -ex
    # Do not bootstrap against public nodes
    ipfs bootstrap rm all
    # Do not sticky peer with ceramic specific peers
    # We want an isolated network
    ipfs config --json Peering.Peers '[]'
    # Disable the gateway
    ipfs config  --json Addresses.Gateway '[]'
    # Enable pubsub
    ipfs config  --json PubSub.Enabled true
    # Only listen on specific tcp address as nothing else is exposed
    ipfs config  --json Addresses.Swarm '["/ip4/0.0.0.0/tcp/4001"]'
    # Set explicit resource manager limits as Kubo computes them based off
    # the k8s node resources and not the pods limits.
    ipfs config Swarm.ResourceMgr.MaxMemory '400 MB'
    ipfs config --json Swarm.ResourceMgr.MaxFileDescriptors 500000
