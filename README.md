# News project

## How to run in Production

- Build project via [Docker](https://www.docker.com/get-started):

  ```sh
  npm run docker-build
  ```

  > **Note:** Make sure you have filled out the **.env** file in advance according to **.env.example**

- Start project via [Docker](https://www.docker.com/get-started):

  ```sh
  npm run docker-start
  ```

- Stop project via [Docker](https://www.docker.com/get-started):

  ```sh
  npm run docker-stop
  ```

## How to run in Development

- Initial setup:

  ```sh
  npm run setup
  ```
  > **Note:** Make sure you have filled out the **.env** file in advance according to **.env.example**

- Run the first build:

  ```sh
  npm run build
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

### Test user

The database seed script creates a new user with some data you can use to get started:

- Email: `test_user@remix.run`
- Password: `test_user`

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

I'm use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
