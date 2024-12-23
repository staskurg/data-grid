# Data Grid Component

A flexible and performant data grid component built with React, TypeScript, and Material UI.

## Architecture Decisions

### Frontend Architecture

- **Component-Based Structure**: Pluggable component architecture for maximum reusability
- **State Management**: React Query for server state management, providing built-in caching and data synchronization
- **UI Framework**: Material UI with Material React Table v3 for consistent design and rich functionality
- **Type Safety**: TypeScript for enhanced developer experience and code reliability
- **API Layer**: Serverless functions via Vercel for backend functionality

### Key Technical Choices

1. **Material React Table v3**

   - Built on TanStack Table V8
   - Native TypeScript support
   - Built-in virtualization for handling large datasets
   - CRUD support and rich functionality
   - Efficient memoization

2. **React Query**
   - Built-in caching and state management
   - Simplified data fetching
   - Automatic background refetching
   - Server state synchronization

## Running Locally

1. Install dependencies:

### `yarn install`

2. Start the development server:

### `yarn start`

3. For local API development, install Vercel CLI and run:

### `vercel dev`

## Assumptions Made

1. Data Structure

   - Predefined column types: link, user, number, tag
   - Fixed schema for user data and table structure
   - Consistent data format across all table instances

2. User Interface
   - Material UI design language is suitable for all use cases
   - Table functionality prioritizes performance over customization
   - Tooltip-based overflow handling for dense data

## Known Limitations

1. Performance

   - Limited to client-side sorting and filtering
   - No server-side pagination implementation
   - Memory constraints with very large datasets

2. Features
   - Mock API limitations for demonstration purposes
   - Limited column type customization
   - Basic CRUD operations only

## Future Improvements

1. Technical Enhancements

   - Implement server-side pagination
   - Add real-time updates via WebSocket
   - Add comprehensive test coverage
   - Implement column-specific data fetching
     - Allow developers to specify required columns in API requests
     - Reduce payload size by fetching only needed data
     - Support dynamic column selection based on use case
     - Enable efficient data loading for different table views
   - Optimize large dataset performance
     - Implement row and column virtualization
     - Enable efficient rendering for 10,000+ rows
     - Support horizontal virtualization for many columns
     - Dynamic viewport calculations for smooth scrolling

2. Feature Additions

   - Custom cell editor components (not completed due to time limit)
     - Autocomplete-style user picker with multi-select
     - Real-time user search and filtering
     - Profile picture and user info display
     - Loading states and error handling
   - Advanced filtering and search capabilities
   - Customizable theming system

3. Developer Experience

   - Add Storybook documentation
   - Improve API documentation
   - Add more usage examples

## Tech Stack

- React
- TypeScript
- Material UI
- Material React Table v3
- React Query
- Vercel (Deployment & Serverless Functions)

## Project Structure

- `src/`: Contains the frontend source code.

  - `src/components/`: Contains the React components.
  - `src/hooks/`: Contains custom React hooks.
  - `src/pages/`: Contains the main pages of the application.
  - `src/services/`: Contains the API service.

- `api/`: Contains serverless functions.

- `shared/`: Shared types and mock data.

## Live Demo

Experience the component in action:

- **Main Application**: [https://data-grid-steel.vercel.app](https://data-grid-steel.vercel.app)

The demo displays the Development Tasks Board by default. Currently, tables can be switched by modifying the table ID in `homepage.tsx`:

```typescript:src/pages/homepage.tsx
// For Development Tasks Board
const { data: tableData } = useTableData('table2');

// For Laboratory Plasmids Inventory
const { data: tableData } = useTableData('table1');
```
