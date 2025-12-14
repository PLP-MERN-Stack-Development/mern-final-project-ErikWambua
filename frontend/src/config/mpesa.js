// M-Pesa configuration for Lipa Na M-Pesa Online (STK Push)

// M-Pesa Credentials
export const MPESA_CREDENTIALS = {
  businessShortCode: process.env.REACT_APP_MPESA_SHORTCODE || '174379',
  passkey: process.env.REACT_APP_MPESA_PASSKEY || '',
  consumerKey: process.env.REACT_APP_MPESA_CONSUMER_KEY || '',
  consumerSecret: process.env.REACT_APP_MPESA_CONSUMER_SECRET || '',
};

// M-Pesa API Configuration
export const MPESA_API = {
  baseURL: process.env.REACT_APP_MPESA_API_URL || 'https://sandbox.safaricom.co.ke',
  timeout: 60000, // 60 seconds
  endpoints: {
    stkPush: '/mpesa/stkpush/v1/processrequest',
    stkQuery: '/mpesa/stkpushquery/v1/query',
    b2c: '/mpesa/b2c/v1/paymentrequest',
    accountBalance: '/mpesa/accountbalance/v1/query',
    transactionStatus: '/mpesa/transactionstatus/v1/query',
    reversal: '/mpesa/reversal/v1/request',
  },
};

// Callback URLs
export const MPESA_CALLBACKS = {
  stkPush: process.env.REACT_APP_MPESA_CALLBACK_URL || 'http://localhost:5000/api/payments/mpesa/callback',
  b2c: process.env.REACT_APP_MPESA_B2C_CALLBACK_URL || 'http://localhost:5000/api/payments/mpesa/b2c-callback',
  timeout: process.env.REACT_APP_MPESA_TIMEOUT_URL || 'http://localhost:5000/api/payments/mpesa/timeout',
  result: process.env.REACT_APP_MPESA_RESULT_URL || 'http://localhost:5000/api/payments/mpesa/result',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  CUSTOMER_PAYBILL_ONLINE: 'CustomerPayBillOnline',
  CUSTOMER_BUYGOODS_ONLINE: 'CustomerBuyGoodsOnline',
  BUSINESS_PAYBILL: 'BusinessPayBill',
  BUSINESS_BUYGOODS: 'BusinessBuyGoods',
  SALARY_PAYMENT: 'SalaryPayment',
  BUSINESS_PAYMENT: 'BusinessPayment',
  PROMOTION_PAYMENT: 'PromotionPayment',
};

// Command IDs
export const COMMAND_IDS = {
  TRANSACTION_STATUS: 'TransactionStatusQuery',
  ACCOUNT_BALANCE: 'AccountBalance',
  REVERSAL: 'TransactionReversal',
  B2C_PAYMENT: 'BusinessPayment',
};

// Payment Limits
export const PAYMENT_LIMITS = {
  min: 1, // KES 1
  max: 150000, // KES 150,000 per transaction
  dailyLimit: 300000, // KES 300,000 per day
};

// Result Codes
export const RESULT_CODES = {
  SUCCESS: 0,
  INSUFFICIENT_FUNDS: 1,
  LESS_THAN_MINIMUM: 2,
  MORE_THAN_MAXIMUM: 3,
  INVALID_TRANSACTION: 4,
  CANCELLED_BY_USER: 1032,
  TIMEOUT: 1037,
  SYSTEM_ERROR: 1,
};

// Result Messages
export const RESULT_MESSAGES = {
  [RESULT_CODES.SUCCESS]: 'Payment successful',
  [RESULT_CODES.INSUFFICIENT_FUNDS]: 'Insufficient funds',
  [RESULT_CODES.LESS_THAN_MINIMUM]: 'Amount is less than minimum',
  [RESULT_CODES.MORE_THAN_MAXIMUM]: 'Amount exceeds maximum limit',
  [RESULT_CODES.INVALID_TRANSACTION]: 'Invalid transaction',
  [RESULT_CODES.CANCELLED_BY_USER]: 'Payment cancelled by user',
  [RESULT_CODES.TIMEOUT]: 'Request timeout',
  [RESULT_CODES.SYSTEM_ERROR]: 'System error occurred',
};

// Payment Methods
export const PAYMENT_METHODS = {
  MPESA: {
    id: 'mpesa',
    name: 'M-Pesa',
    description: 'Pay with M-Pesa mobile money',
    icon: '📱',
    enabled: true,
  },
  CASH: {
    id: 'cash',
    name: 'Cash',
    description: 'Pay with cash to the driver',
    icon: '💵',
    enabled: true,
  },
};

// Phone Number Validation
export const PHONE_VALIDATION = {
  regex: /^(?:254|\+254|0)?([17]\d{8})$/,
  format: '254XXXXXXXXX',
  example: '254712345678',
  maxLength: 12,
  minLength: 10,
};

// STK Push Configuration
export const STK_PUSH_CONFIG = {
  timeout: 60, // seconds
  accountReference: 'MatPulse254',
  transactionDesc: 'Payment for MatPulse254 Trip',
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

// Environment
export const MPESA_ENVIRONMENT = {
  isSandbox: process.env.REACT_APP_MPESA_ENV === 'sandbox',
  isProduction: process.env.REACT_APP_MPESA_ENV === 'production',
};

// Main M-Pesa Configuration Object
export const mpesaConfig = {
  credentials: MPESA_CREDENTIALS,
  api: MPESA_API,
  callbacks: MPESA_CALLBACKS,
  transactionTypes: TRANSACTION_TYPES,
  commandIds: COMMAND_IDS,
  limits: PAYMENT_LIMITS,
  resultCodes: RESULT_CODES,
  resultMessages: RESULT_MESSAGES,
  paymentMethods: PAYMENT_METHODS,
  phoneValidation: PHONE_VALIDATION,
  stkPush: STK_PUSH_CONFIG,
  paymentStatus: PAYMENT_STATUS,
  environment: MPESA_ENVIRONMENT,
};

// Helper Functions
export const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (cleaned.startsWith('254')) {
    return cleaned;
  } else if (cleaned.startsWith('0')) {
    return '254' + cleaned.substring(1);
  } else if (cleaned.length === 9) {
    return '254' + cleaned;
  }
  
  return cleaned;
};

export const validatePhoneNumber = (phone) => {
  const formatted = formatPhoneNumber(phone);
  return PHONE_VALIDATION.regex.test(formatted);
};

export const validateAmount = (amount) => {
  const numAmount = parseFloat(amount);
  return (
    !isNaN(numAmount) &&
    numAmount >= PAYMENT_LIMITS.min &&
    numAmount <= PAYMENT_LIMITS.max
  );
};

export default mpesaConfig;
