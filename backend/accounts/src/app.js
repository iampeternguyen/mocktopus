// src/app.js

const express = require("express");
const { faker } = require("@faker-js/faker");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// In-memory accounts storage
let accounts = [];

const ibanList = [
  "DE89370400440532013000",
  "DE12345678901234567890",
  "DE09876543210987654321",
  "DE30400400010000000201",
  "DE29500105170648489890",
];

// Function to generate random accounts
const generateRandomAccounts = (num = 10) => {
  const accountIban = faker.helpers.arrayElement(ibanList);

  for (let i = 0; i < num; i++) {
    accounts.push({
      accountId: faker.string.uuid(),
      name: faker.person.fullName(),
      iban: accountIban, // Generate a random IBAN
      balance: parseFloat(faker.finance.amount()), // Generate random balance,
      currency: "EUR",
      createdAt: faker.date.past(1).toISOString(),
    });
  }
};

// Generate initial random accounts
generateRandomAccounts(20);

// Route to create a new account
app.post("/accounts", (req, res) => {
  const { name, iban, balance, currency } = req.body;

  if (!name || !iban || balance === undefined || !currency) {
    return res
      .status(400)
      .json({ message: "Name, IBAN, balance, and currency are required." });
  }

  const newAccount = {
    accountId: faker.string.uuid(),
    name,
    iban,
    balance,
    currency,
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  res.status(201).json(newAccount);
});

// Route to get all accounts
app.get("/accounts", (req, res) => {
  res.status(200).json(accounts);
});

// Route to get an account by ID
app.get("/accounts/:accountId", (req, res) => {
  const { accountId } = req.params;
  const account = accounts.find((acc) => acc.accountId === accountId);

  if (!account) {
    return res.status(404).json({ message: "Account not found." });
  }

  res.status(200).json(account);
});

// Route to update an account
app.put("/accounts/:accountId", (req, res) => {
  const { accountId } = req.params;
  const { name, iban, balance, currency } = req.body;
  const accountIndex = accounts.findIndex((acc) => acc.accountId === accountId);

  if (accountIndex === -1) {
    return res.status(404).json({ message: "Account not found." });
  }

  // Update the account details
  accounts[accountIndex] = {
    ...accounts[accountIndex],
    name: name || accounts[accountIndex].name,
    iban: iban || accounts[accountIndex].iban,
    balance: balance !== undefined ? balance : accounts[accountIndex].balance,
    currency: currency || accounts[accountIndex].currency,
  };

  res.status(200).json(accounts[accountIndex]);
});

// Route to delete an account
app.delete("/accounts/:accountId", (req, res) => {
  const { accountId } = req.params;
  const accountIndex = accounts.findIndex((acc) => acc.accountId === accountId);

  if (accountIndex === -1) {
    return res.status(404).json({ message: "Account not found." });
  }

  accounts.splice(accountIndex, 1);
  res.status(204).send(); // No content
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
