export const apiEndpoints = [
    {
        requestType: "POST",
        url: "/payments",
        summary: "Initiate a payment",
        sampleRequestBody: {
            paymentType: "SEPA",
            creditorName: "John Doe",
            creditorAccount: "DE89370400440532013000",
            creditorBIC: "COBADEFFXXX",
            debtorName: "Jane Smith",
            debtorAccount: "GB33BUKB20201555555555",
            debtorBIC: "NWBKGB2L",
            amount: 1000.50,
            currency: "EUR",
            paymentReference: "Invoice #2024-0023",
            executionDate: "2024-09-30",
        },
    },
    {
        requestType: "GET",
        url: "/payments",
        summary: "List all payments",
        sampleRequestBody: null,
    },
    {
        requestType: "GET",
        url: "/payments/{paymentId}",
        summary: "Get payment status",
        sampleRequestBody: null,
    },
    {
        requestType: "GET",
        url: "/accounts/{iban}/payments",
        summary: "List payments for an account",
        sampleRequestBody: null,
    },
];