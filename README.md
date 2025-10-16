# archeo-matrix-builder

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

Sadly, this project has some issues with pnpm - the drizzle sqlite migration script somehow broke the dependencies and I wasn't able to fix that with pnpm.

I recommend using yarn for this project - it can fix the broken dependencies simply by running `pnpm rebuild`.

### Install

```bash
yarn install
```

### Development

Dev mode

```bash
yarn dev
```

Preview mode (whatever this is)

```bash
yarn start
```

### Troubleshooting

[How to fix Error: The module 'path\node_modules\better-sqlite3\build\Release\better_sqlite3.node'
was compiled against a different Node.js](https://github.com/WiseLibs/better-sqlite3/issues/549#issuecomment-774506826)

### Build

```bash
# For windows
$ yarn build:win

# For macOS
$ yarn build:mac

# For Linux
$ yarn build:linux
```

### Api

There is a Fastify server running in the Electron app. It is accessible by default on `http://localhost:4321/api/v1/<domain>`. The exact path can be configured via the .env file.
