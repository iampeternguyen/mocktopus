# 1. Create a New Account
curl -X POST http://localhost:3000/accounts \
-H "Content-Type: application/json" \
-d '{
    "name": "John Doe",
    "iban": "DE89370400440532013000",
    "balance": 1000.50,
    "currency": "EUR"
}'

# 2. Create a New Account with Random Data
curl -X POST http://localhost:3000/accounts \
-H "Content-Type: application/json" \
-d '{}'

# 3. Retrieve All Accounts
curl -X GET http://localhost:3000/accounts

# 4. Retrieve Accounts with Specific IBAN (if filtering is implemented)
curl -X GET "http://localhost:3000/accounts?iban=DE89370400440532013000"

# 5. Delete an Account by Account ID
# Replace <accountId> with the actual account ID of the account you want to delete
curl -X DELETE http://localhost:3000/accounts/<accountId>
