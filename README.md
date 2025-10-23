# Bank Project

A backend banking system built with Node.js and TypeScript that provides user management, account operations, and transactions through a RESTful API. Designed for learning, testing, and modular development.

## Architecture

Main Components:
- Server: Handles authentication, account management, and transaction processing
- Database: Stores user details, accounts and transaction history
- Middleware: Validates requests and handles authentication

Key Features:
- User registration with OTP-based email verification
- Secure JWT authentication and session management
- Transactions between registered accounts
- Full transaction history tracking
- Modular, testable TypeScript codebase
- RESTful API design with integrated Swagger documentation


## Project Structure

bank_project/
src/                   	- TypeScript source code
src/routes/            	- API route handlers
src/controllers/       	- Business logic
src/middleware/        	- Auth, validation
src/services/          	- Data models
src/swagger/			- API documentation
src/types/				- Internal type declarations
src/utils/             	- Helper functions
src/libs/				- Used libraries
test/                 	- Postman files, intergration and unit tests
config/                	- Environment configuration
package.json           	- Dependencies and scripts
tsconfig.json          	- TypeScript config
.gitignore             	- Ignored files and folders

## Configuration

The project uses environment variables to configure storage and security.
Create a .env file in the project root:

### Example .env (Local Storage)
	PORT=3000
	JWT_SECRET=your-jwt-secret
	
	USER_DB=local
	ACCOUNT_DB=local
	TRANSACTION_DB=local
	
	USER_EMAIL=youremail@gmail.com
	EMAIL_PASSKEY=alfuibalcouabcoan 
	APP_NAME="My Bank"
	EMAIL_FROM_ADDRESS=noreply@My-Bank.com
	
	INITIAL_ACCOUNT_BALANCE=5000
	
### Example .env (MongoDB)
	PORT=3000
	JWT_SECRET=your-jwt-secret

	USER_DB=mongo
	ACCOUNT_DB=mongo
	TRANSACTION_DB=mongo

	MONGO_URI=mongodb://localhost:27017/banking_db
	MONGO_HOST=localhost
	MONGO_PORT=27017
	MONGO_DB=banking_db
	MONGO_USER=user
	MONGO_PASS=pass

	DB_TEST_NAME=MyName

	USER_EMAIL=youremail@gmail.com
	EMAIL_PASSKEY=alfuibalcouabcoan 
	APP_NAME="My Bank"
	EMAIL_FROM_ADDRESS=noreply@My-Bank.com

	INITIAL_ACCOUNT_BALANCE=5000
	
## Quick Start

Prerequisites:
- Node.js >= 18
- npm or yarn
- MongoDB instance (only if DB_TYPE=mongo)

Installation:
1. Clone the repository: git clone https://github.com/<your-username>/bank_project.git
   cd bank_project
2. Install dependencies: npm install
3. Build the project: npm run build
4. Start the server: npm start
5. Development mode (hot reload): npm run dev

## API Endpoints

### Public (no authentication):
Endpoints for signup, login, and email verification.

- POST 	/public/signup - Register a new user
- POST 	/public/login - Authenticate and receive JWT

- POST	/public/verify/send - Send verification email after signup or email change
- POST 	/public/verify/verify - Confirm email ownership using the verification code
- POST 	/public/verify/status - Check account’s email verification status

### Authenticated (requires valid JWT):
Endpoints for user account management and transactions.

- GET 	/auth/ - Get account dashboard (balance, recent transactions)
- POST 	/auth/logout - Log out the current user

- GET	/auth/info - Retrieve full user profile information
- PUT	/auth/info - Update user profile information

- POST 	/auth/security/change-email - Request an email address change
- POST	/auth/security/confirm-email-change - Confirm email change using verification code
- POST 	/auth/security/change-password - Change account password

- GET 	/auth/transactions/history - View complete transaction history
- GET	/auth/transactions/:id - Retrieve a specific transaction by ID
- POST 	/auth/transactions/ - Create a new transaction


## API Documentation

Swagger is integrated and served automatically.
Once the server is running, open:
http://localhost:<PORT>/docs

swagger.ts -> Maintained source definition

swagger-generate.ts -> Generate swagger.yaml file

swagger.yaml -> Generated output (can be regenerated anytime)
    
## Testing

- Run integration tests: npm run test:integration
- Run unit tests only: npm run test:unit (if applicable)
- Verify API endpoints using Postman or curl

## Troubleshooting

- Server won’t start: Check .env configuration and database connection
- Port already in use: Change PORT in .env or kill the existing process
- Failed authentication: Ensure JWT_SECRET matches server configuration

## Performance

- Scalability: Supports multiple concurrent users
- Reliability: Database transactions ensure consistency

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes with descriptive messages
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please respect the original author's work.

## Author

Alon Nov - Bank Project

