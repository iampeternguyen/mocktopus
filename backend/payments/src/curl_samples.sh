# 1. Initiate a Payment
curl -X POST http://localhost:3000/payments \
-H "Content-Type: application/json" \
-d '{
    "paymentType": "SEPA",
    "creditorName": "John Doe",
    "creditorAccount": "DE89370400440532013000",
    "creditorBIC": "COBADEFFXXX",
    "debtorName": "Jane Smith",
    "debtorAccount": "GB33BUKB20201555555555",
    "debtorBIC": "NWBKGB2L",
    "amount": 1000.50,
    "currency": "EUR",
    "paymentReference": "Invoice #2024-0023",
    "executionDate": "2024-09-30"
}'

# 2. Get Payment Status
curl -X GET http://localhost:3000/payments/pay_123456789

# 3. List All Payments
curl -X GET http://localhost:3000/payments

# 4. List Payments for an Account (by IBAN)
curl -X GET http://localhost:3000/accounts/DE89370400440532013000/payments

# 5. List Payments for an Account with Filters (by IBAN)
curl -X GET "http://localhost:3000/accounts/DE89370400440532013000/payments?paymentType=SEPA&status=pending&fromDate=2024-01-01&toDate=2024-12-31"
