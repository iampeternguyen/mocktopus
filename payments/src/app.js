const express = require("express");
const { faker } = require("@faker-js/faker"); // Correct import
const app = express();
app.use(express.json());

const ibanList = [
  "DE89370400440532013000",
  "DE12345678901234567890",
  "DE09876543210987654321",
  "DE30400400010000000201",
  "DE29500105170648489890",
];

// Utility functions to generate random data
const generatePaymentId = () => `pay_${faker.string.uuid()}`; // Updated UUID generation
const randomAmount = () => faker.finance.amount(100, 10000, 2);
const randomIBAN = () => faker.helpers.arrayElement(ibanList);
const randomBIC = () => faker.finance.bic();
const randomStatus = () =>
  faker.helpers.arrayElement(["pending", "completed", "failed"]);
const randomCurrency = () => faker.helpers.arrayElement(["EUR", "USD", "GBP"]);
const randomDate = () =>
  faker.date
    .between({ from: "2023-01-01", to: "2024-12-31" })
    .toISOString()
    .split("T")[0];
const randomPaymentType = () => faker.helpers.arrayElement(["SEPA", "SWIFT"]);

// Sample payments data store with random payments
let payments = Array.from({ length: 10 }, () => ({
  paymentId: generatePaymentId(),
  status: randomStatus(),
  paymentType: randomPaymentType(),
  creditorAccount: randomIBAN(),
  debtorAccount: randomIBAN(),
  amount: randomAmount(),
  currency: randomCurrency(),
  paymentReference: `Invoice #${faker.number.int(9999)}`,
  executionDate: randomDate(),
}));

// POST /payments - Create a new payment
app.post("/payments", (req, res) => {
  const {
    paymentType,
    creditorName,
    creditorAccount,
    debtorName,
    debtorAccount,
    amount,
    currency,
    paymentReference,
    executionDate,
  } = req.body;

  // Validation (minimal for the sake of example)
  if (
    !paymentType ||
    !creditorName ||
    !creditorAccount ||
    !debtorName ||
    !debtorAccount ||
    !amount ||
    !currency ||
    !paymentReference
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  // Simulate random payment ID and status
  const newPayment = {
    paymentId: generatePaymentId(),
    status: "pending",
    paymentType,
    creditorAccount,
    debtorAccount,
    amount,
    currency,
    paymentReference,
    executionDate: executionDate || randomDate(),
  };

  payments.push(newPayment);

  res.status(201).json({
    paymentId: newPayment.paymentId,
    status: newPayment.status,
  });
});

// GET /payments/:paymentId - Retrieve the status of a specific payment
app.get("/payments/:paymentId", (req, res) => {
  const { paymentId } = req.params;
  const payment = payments.find((p) => p.paymentId === paymentId);

  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }

  res.status(200).json(payment);
});

// GET /payments - List all payments with optional filters
app.get("/payments", (req, res) => {
  const { paymentType, status, fromDate, toDate } = req.query;

  let filteredPayments = payments;

  // Apply filters
  if (paymentType) {
    filteredPayments = filteredPayments.filter(
      (p) => p.paymentType === paymentType
    );
  }
  if (status) {
    filteredPayments = filteredPayments.filter((p) => p.status === status);
  }
  if (fromDate) {
    filteredPayments = filteredPayments.filter(
      (p) => new Date(p.executionDate) >= new Date(fromDate)
    );
  }
  if (toDate) {
    filteredPayments = filteredPayments.filter(
      (p) => new Date(p.executionDate) <= new Date(toDate)
    );
  }

  res.status(200).json(filteredPayments);
});

// GET /accounts/:iban/payments - List payments for a specific IBAN
app.get("/accounts/:iban/payments", (req, res) => {
  const { iban } = req.params;
  const { paymentType, fromDate, toDate, status } = req.query;

  let filteredPayments = payments.filter(
    (p) => p.creditorAccount === iban || p.debtorAccount === iban
  );

  // Apply filters
  if (paymentType) {
    filteredPayments = filteredPayments.filter(
      (p) => p.paymentType === paymentType
    );
  }
  if (status) {
    filteredPayments = filteredPayments.filter((p) => p.status === status);
  }
  if (fromDate) {
    filteredPayments = filteredPayments.filter(
      (p) => new Date(p.executionDate) >= new Date(fromDate)
    );
  }
  if (toDate) {
    filteredPayments = filteredPayments.filter(
      (p) => new Date(p.executionDate) <= new Date(toDate)
    );
  }

  if (filteredPayments.length === 0) {
    return res
      .status(404)
      .json({ error: "No payments found for the specified account" });
  }

  res.status(200).json(filteredPayments);
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Payments API server is running on port ${PORT}`);
});
