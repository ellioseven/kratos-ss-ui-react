# Kratos Self Service UI: React

[kratos-selfservice-ui-node](https://github.com/ory/kratos-selfservice-ui-node/blob/master/src/index.ts) clone, but in
React! Currently a work in progress.

## Installation

```
docker-compose run --rm kratos-ss-ui-react yarn install
docker-compose up -d
browse 127.0.0.1:4455
```

## @todo

- Implement error page
- Implement session refresh
- Implement Kratos config
- Investigate Kratos client bundle size
- Implement custom button messages
- Password Toggle
- KratosMessage types (global, etc.)
- Don't hard code auth routes
