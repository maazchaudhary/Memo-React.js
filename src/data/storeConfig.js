export const cartKey = "memo_cart";
export const confirmationKey = "memo_last_order";
export const currencyKey = "memo_currency";
export const deliveryFee = 250;

export const currencies = {
  PKR: { label: "PKR", name: "Pakistan (PKR)", pkrPerUnit: 1, locale: "en-PK", prefix: "PKR " },
  USD: { label: "USD", name: "USA (Dollar)", pkrPerUnit: 278, locale: "en-US", prefix: "$" },
  GBP: { label: "GBP", name: "UK (Pounds)", pkrPerUnit: 352, locale: "en-GB", prefix: "£" },
  AED: { label: "AED", name: "UAE (AED)", pkrPerUnit: 76, locale: "en-AE", prefix: "AED " },
  CAD: { label: "CAD", name: "Canada (CAD)", pkrPerUnit: 204, locale: "en-CA", prefix: "CAD " }
};

export const paymentOptions = ["Cash on Delivery", "Bank Transfer", "EasyPaisa / JazzCash"];
export const sizeOptions = ["Extra Small", "Small", "Medium", "Large", "Custom"];

export const manualPaymentInstructions = {
  "Bank Transfer": "Transfer the final total to Memo by Miraal bank account and share your reference number. Account details: Memo by Miraal, IBAN PK00 MEMO 0000 0000 0000.",
  "EasyPaisa / JazzCash": "Send the final total to 0308 8844444, account title Memo by Miraal, and enter your transaction ID before submitting."
};