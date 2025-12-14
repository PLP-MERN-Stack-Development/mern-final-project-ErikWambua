import api from './api';
import toast from 'react-hot-toast';

class MpesaService {
  constructor() {
    this.pollingIntervals = new Map();
  }

  // Initiate STK Push
  async initiateSTKPush(phoneNumber, amount, reference, description) {
    try {
      const response = await api.post('/mpesa/stk-push', {
        phoneNumber: this.formatPhoneNumber(phoneNumber),
        amount,
        reference,
        description,
        callbackUrl: `${window.location.origin}/api/mpesa/callback`
      });

      if (response.data.ResponseCode === '0') {
        const { CheckoutRequestID, MerchantRequestID } = response.data;
        
        // Start polling for payment status
        return this.pollPaymentStatus(CheckoutRequestID, MerchantRequestID);
      } else {
        throw new Error(response.data.ResponseDescription);
      }
    } catch (error) {
      console.error('STK Push failed:', error);
      throw this.getErrorMessage(error);
    }
  }

  // Poll for payment status
  async pollPaymentStatus(checkoutRequestId, merchantRequestId, maxAttempts = 30) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const interval = 3000; // 3 seconds

      const poll = async () => {
        attempts++;
        
        try {
          const response = await api.post('/mpesa/query', {
            checkoutRequestId,
            merchantRequestId
          });

          const result = response.data;

          if (result.ResultCode === '0') {
            // Payment successful
            clearInterval(this.pollingIntervals.get(checkoutRequestId));
            this.pollingIntervals.delete(checkoutRequestId);
            
            resolve({
              success: true,
              transaction: this.formatTransaction(result),
              message: 'Payment confirmed successfully'
            });
          } else if (result.ResultCode !== '1037') {
            // Payment failed (not "request cancelled")
            clearInterval(this.pollingIntervals.get(checkoutRequestId));
            this.pollingIntervals.delete(checkoutRequestId);
            
            reject({
              success: false,
              message: this.getResultMessage(result.ResultCode)
            });
          }

          if (attempts >= maxAttempts) {
            clearInterval(this.pollingIntervals.get(checkoutRequestId));
            this.pollingIntervals.delete(checkoutRequestId);
            
            reject({
              success: false,
              message: 'Payment timeout. Please check your M-Pesa'
            });
          }
        } catch (error) {
          if (attempts >= maxAttempts) {
            clearInterval(this.pollingIntervals.get(checkoutRequestId));
            this.pollingIntervals.delete(checkoutRequestId);
            
            reject({
              success: false,
              message: 'Error checking payment status'
            });
          }
        }
      };

      // Start polling
      const intervalId = setInterval(poll, interval);
      this.pollingIntervals.set(checkoutRequestId, intervalId);
      
      // Initial poll
      poll();
    });
  }

  // Cancel polling for a payment
  cancelPolling(checkoutRequestId) {
    const intervalId = this.pollingIntervals.get(checkoutRequestId);
    if (intervalId) {
      clearInterval(intervalId);
      this.pollingIntervals.delete(checkoutRequestId);
    }
  }

  // Format phone number for M-Pesa
  formatPhoneNumber(phone) {
    // Remove any non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // Add country code if missing
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7')) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  }

  // Format transaction data
  formatTransaction(mpesaResult) {
    const transaction = {
      id: mpesaResult.TransactionID || `MPE${Date.now()}`,
      amount: parseFloat(mpesaResult.TransactionAmount) || 0,
      phoneNumber: mpesaResult.PhoneNumber || '',
      reference: mpesaResult.BillRefNumber || mpesaResult.TransactionID || '',
      description: mpesaResult.ResultDesc || 'M-Pesa Payment',
      date: mpesaResult.TransactionDate || new Date().toISOString(),
      status: 'completed',
      raw: mpesaResult
    };

    // Try to extract more details
    if (mpesaResult.ResultParameters?.ResultParameter) {
      mpesaResult.ResultParameters.ResultParameter.forEach(param => {
        if (param.Key === 'Amount') transaction.amount = parseFloat(param.Value);
        if (param.Key === 'MpesaReceiptNumber') transaction.receiptNumber = param.Value;
        if (param.Key === 'TransactionDate') transaction.date = param.Value;
        if (param.Key === 'PhoneNumber') transaction.phoneNumber = param.Value;
      });
    }

    return transaction;
  }

  // Get user-friendly error messages
  getErrorMessage(error) {
    if (error.response?.data) {
      const mpesaError = error.response.data;
      
      if (mpesaError.errorCode) {
        return this.getResultMessage(mpesaError.errorCode);
      }
      
      return mpesaError.errorMessage || mpesaError.message || 'Payment failed';
    }
    
    return error.message || 'Payment failed. Please try again.';
  }

  // Get result message from M-Pesa result code
  getResultMessage(resultCode) {
    const messages = {
      '0': 'Transaction successful',
      '1': 'Insufficient funds',
      '2': 'Less than minimum transaction value',
      '3': 'More than maximum transaction value',
      '4': 'Would exceed daily transfer limit',
      '5': 'Would exceed minimum balance',
      '6': 'Unresolved primary party',
      '7': 'Unresolved receiver party',
      '8': 'Would exceed maximum balance',
      '11': 'Debit account invalid',
      '12': 'Credit account invalid',
      '13': 'Unresolved debit account',
      '14': 'Unresolved credit account',
      '15': 'Duplicate transaction',
      '16': 'Internal failure',
      '17': 'Unreconciled transaction',
      '20': 'Response timeout',
      '26': 'Transaction in progress',
      '1037': 'Request cancelled by user',
      '1032': 'Request cancelled by user',
      '1014': 'Invalid shortcode',
      '1013': 'Invalid reference',
      '1012': 'Invalid amount',
      '1011': 'Invalid phone number',
      '2001': 'Rejected by user',
      '2009': 'Transaction failed',
      '2010': 'Transaction failed',
      '2011': 'Transaction failed',
    };

    return messages[resultCode] || `Transaction failed (Code: ${resultCode})`;
  }

  // Validate M-Pesa PIN (client-side basic validation)
  validatePIN(pin) {
    if (!pin || pin.length !== 4) {
      return false;
    }
    
    // Check if all characters are digits
    return /^\d{4}$/.test(pin);
  }

  // Generate payment summary
  getPaymentSummary(amount, tripDetails) {
    const fare = amount;
    const convenienceFee = Math.max(5, fare * 0.02); // 2% or KES 5 minimum
    const total = fare + convenienceFee;

    return {
      fare,
      convenienceFee,
      total,
      breakdown: [
        { label: 'Matatu Fare', amount: fare, type: 'fare' },
        { label: 'Service Fee', amount: convenienceFee, type: 'fee' },
        { label: 'Total', amount: total, type: 'total', isTotal: true }
      ],
      formatted: {
        fare: this.formatCurrency(fare),
        convenienceFee: this.formatCurrency(convenienceFee),
        total: this.formatCurrency(total)
      }
    };
  }

  // Format currency for display
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Get transaction history
  async getTransactionHistory(params = {}) {
    try {
      const response = await api.get('/mpesa/transactions', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  // Simulate payment for demo/development
  async simulatePayment(phoneNumber, amount, reference, description) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transaction: {
            id: `MPE${Date.now()}`,
            amount,
            phoneNumber,
            reference,
            description,
            date: new Date().toISOString(),
            status: 'completed',
            receiptNumber: `REC${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          },
          message: 'Payment simulated successfully'
        });
      }, 2000);
    });
  }

  // Check if we're in demo mode
  isDemoMode() {
    return process.env.REACT_APP_MPESA_ENV === 'sandbox' || 
           process.env.NODE_ENV === 'development';
  }
}

// Create singleton instance
const mpesaService = new MpesaService();

export default mpesaService;