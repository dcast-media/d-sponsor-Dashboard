# DSponsor Dashboard (WIP)

## Project Structure

The application is organized to be modular and maintainable. Each folder in `src/` has a specific role and is structured to facilitate scalability.

### `public/`

Contains static files like images and fonts.

### `src/`

The source folder contains all the application code.

- **abi/**: Smart contracts ABIs.

- **components/**: 
  - `ui/`: Reusable UI components.
  - `layout/`: Global layout components.
  - `features/`: Components specific to certain features or pages.
 
- **data/**: Static or mock data for the application.
  
- **hooks/**: Custom Hooks for managing state or specific effects.

- **lib/**: Reusable code not specific to React (API calls, cookie management, etc.).

- **pages/**: Application pages and API routes.

- **styles/**: Global style files.

- **utils/**: Utility functions.

- **config/**: Configuration files (i.e. defining the chain config according to the environment).

- **context/**: Global context providers for shared state.

- **types/**: Types of the different objects.

- **middleware.js**: Middlewares for handling requests (authentication, etc.).

## Development Commands

We use Yarn to manage dependencies and run the application.

- `yarn dev`: Starts the application in development mode.
- `yarn build`: Compiles the application for production.
- `yarn start`: Runs the application in production mode after `build` is executed.

## Naming Conventions

- Use PascalCase for components.
- Use camelCase for functions and variables.
- JavaScript files should have the `.js` or `.jsx` extension.

## Contribution

To contribute to the project, please follow these guidelines:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request.
