# APA1 Supa Task Backend

This repository contains the backend API for the APA1 Supa Task application. It is designed to handle user authentication, expense management including CRUD operations, and data retrieval for the frontend application.

## Key Features

- **User Management**: 
  - **Create User**: POST - Takes a JSON body including username and password values to create a new user record (user_id is auto increment and handled by the DB).
  - **Check User Exists**: GET - Filters by username and returns true if a record is found. Used as a validator in front end before calling create user api.
  - **Login**: POST - Takes username and password values in JSON body, validates credentials exist in DB and returns user ID on success.

- **Expense Management**:
  - **Get Expenses (by User ID)**: GET - Retrieves expenses filtered by user_id (for the logged-in user).
  - **Sort Expenses**: GET - Retreives expenses filtered by user_id (logged in user) and orders based on user-defined criteria which is passed in as request/search params (sortBy, sortOrder).   -- Defaults to date_added, desc.
  - **Post Expense**: POST - Adds a new expense linked to the logged in user by taking a JSON body of {description, category, amount, user_id} to insert in to the expenses table.   -- (id, date_added are handled by DB with auto increment, now())
  - **Edit Expense**: PUT - Updates an existing expense by filtering by id and updating the other values passed in the JSON body {description, category, amount}. 
  - **Delete Expense**: DELETE - Removes an expense by ID.
 
  - **Bonus Feature - Get All Expenses**: GET - Retrieves all expenses, accessible only to admin users (user_id: 5).

 - **User Management (CURRENTLY BACKEND ONLY - for future implementation on front end)**:
  - **Update Password**: PUT - Passes user_id of logged in user and input value for desired new password in request body and updates the password attribute in the users table.
  - - **Delete User**: DELETE - Passes user_id of logged in user in the request body to remove the record in the users table with the matching user_id. (cascade on delete results in all associated expenses being deleted also) 

## Development Process

### Challenges and Solutions

1. **Supabase Learning Curve**:
   - **Issue**: As a new technology, Supabase required significant learning and adaptation. Understanding its workflow and debugging issues, such as the auto-increment bug, posed initial challenges.
   - **Solution**: Extensive research and available resources were utilized to understand Supabase better. This included reading documentation, exploring online forums, and experimenting with different configurations to overcome workflow barriers.

2. **Auto Increment Issues**:
   - **Issue**: A sudden 500 Internal Server Error occurred when attempting to post an expense. Supabase logs did not show any invocation, making it difficult to debug.
   - **Solution**: After several code changes and redeployments without success, the issue was suspected to be at the database level. Testing with SQL insert statements revealed a duplicate ID error, indicating a problem with Supabase's auto-increment feature. By manually inserting records until the auto-increment caught up, the issue was resolved, and normal functionality was restored.

3. **Local Storage and URL Challenges**:
   - **Storing User ID**:
     - **Issue**: The user ID was incorrectly stored in local storage due to a mismatch between the expected key (`userId`) and the actual key (`user_id`) returned by the backend.
     - **Solution**: Through trial and error, and extensive testing and console logging, the discrepancy was identified and corrected by ensuring the backend returned the correct key, aligning with the database column name.

   - **Request Parameter Handling**:
     - **Issue**: When updating server logic to use request parameters, an invalid URL error occurred. This was due to an incorrect assumption about the base URL for the Express.js proxy.
     - **Solution**: Research revealed the need to specify a base URL for Express.js to correctly redirect requests to Supabase. By using `localhost` and the appropriate port number, the issue was resolved, enhancing understanding of Express.js's role as a proxy service.

4. **Handling User Existence Check**:
     - **Challenge**: Preventing duplicate user registrations efficiently.
     - **Solution**: Implemented a GET API endpoint to check if a username already exists, returning a simple boolean or status message without exposing sensitive user data.


## Testing

### Manual Testing

- **Backend**: Utilized Postman to manually test API endpoints, ensuring that all routes responded correctly to valid and invalid requests. This included testing with various HTTP methods and payloads to simulate real-world usage.
- **Frontend**: Utilized Chrome DevTools to monitor console logs and network activity, verifying that API calls were made correctly and responses were handled as expected.

### Unit Testing
- Implemented on front end to check basic functionality including endpoint behaviour and that they were being called with the correct data from the front end/user.

### Code Coverage and Edge Cases

- **Code Coverage**: While unit tests were limited, manual testing was thorough, focusing on covering as many code paths as possible. This included:
  - Testing user creation with missing or invalid fields.
  - Simulating login attempts with incorrect credentials.
  - Verifying expense operations (create, edit, delete) with valid and invalid data.
  - Ensuring that sorting and filtering functionalities worked under different scenarios.

- **Edge Cases**: Specific attention was given to potential edge cases, such as:
  - Attempting to create a user with an existing username.
  - Submitting expenses with negative or zero amounts.
  - Handling large datasets for sorting and filtering to test performance and stability.

These testing strategies ensured that the application was robust and could handle a variety of user interactions without failure. Additional automated tests can be implemented in the future to further enhance test coverage. 

Furthermore, hashing could be implemented to passwords both at user input and in the database. This would ensure that passwords are never transmitted in plain text, adding an extra layer of security against potential interception during data transmission.

## Note
For information on the front-end, please refer to the front-end repo's README.md file.

Screenshots have been provided in the submission as evidence of manual testing.
