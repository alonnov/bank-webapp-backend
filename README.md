# Bank Project

A backend banking system built with Node.js and TypeScript that provides user management, account operations, and transactions through a RESTful API. Designed for learning, testing, and modular development.

## Architecture

Components:
- Server: Handles authentication, account management, and transaction processing
- Database: Stores user details, accounts and transaction history
- Middleware: Validates requests and handles authentication

Key Features:
- User registration with OTP-based email verification
- Transactions between registered accounts
- Transaction history tracking
- JWT authentication and role-based access control
- Modular, testable backend codebase with TypeScript
- RESTful API design

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
test/                 	- Unit tests
config/                	- Environment configuration
package.json           	- Dependencies and scripts
tsconfig.json          	- TypeScript config
.gitignore             	- Ignored files and folders

## Configuration

The project uses environment variables to configure storage and security.
Create a .env file in the project root:

Example .env (Local Storage)
	PORT=3000
	USER_DB=local
	ACCOUNT_DB=local
	TRANSACTION_DB=local
	INITIAL_ACCOUNT_BALANCE=50
	
Example .env (MongoDB)
	PORT=3000
	USER_DB=mongo
	ACCOUNT_DB=mongo
	TRANSACTION_DB=mongo
	INITIAL_ACCOUNT_BALANCE=750

## Quick Start

Prerequisites:
- Node.js >= 18
- npm or yarn
- MongoDB instance (only if DB_TYPE=mongo)

Installation:
1. Clone the repository: git clone <repo-url> && cd bank_project
2. Install dependencies: npm install
3. Build the project: npm run build
4. Start the server: npm start
5. Development mode (hot reload): npm run dev

## API Endpoints

Public:
- POST /register — Register a new user
- POST /login — Authenticate and receive JWT

Account (requires authentication):
- POST /account — Create a new account
- GET /account/:id — Get account details
- POST /account/:id/deposit — Deposit funds
- POST /account/:id/withdraw — Withdraw funds
- POST /account/:id/transfer — Transfer funds to another account
- GET /account/:id/transactions — View transaction history

## API Documentation

Swagger is integrated and served automatically.
Once the server is running, open:
http://localhost:<PORT>/docs

swagger.ts -> Maintained source definition

swagger-generate.ts -> Generate swagger.yaml file

swagger.yaml -> Generated output (can be regenerated anytime)
    
## Testing

- Run unit tests: npm test
- Run integration tests: npm run test:integration
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

