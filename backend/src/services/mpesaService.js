const axios = require('axios');
const crypto = require('crypto');
const moment = require('moment');

class MpesaService {
  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
    
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
  }

  // Generate access token
  async generateAccessToken() {
    try {
      const auth = Buffer.from(
        `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
      ).toString('base64');

      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('M-Pesa access token generation failed:', error.response?.data || error.message);
      throw new Error('Failed to generate M-Pesa access token');
    }
  }

  // Generate password for STK Push
  generatePassword() {
    const timestamp = this.generateTimestamp();
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    return { password, timestamp };
  }

  // Generate timestamp in yyyyMMddHHmmss format
  generateTimestamp() {
    return moment().format('YYYYMMDDHHmmss');
  }

  // Format phone number to M-Pesa format (2547XXXXXXXX)
  formatPhoneNumber(phone) {
    let formatted = phone.replace(/\D/g, '');
    
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    } else if (formatted.startsWith('7')) {
      formatted = '254' + formatted;
    } else if (formatted.startsWith('254') && formatted.length === 12) {
      // Already in correct format
    } else {
      throw new Error('Invalid phone number format');
    }

    return formatted;
  }

  // Initiate STK Push (Lipa Na M-Pesa Online)
  async initiateSTKPush(phone, amount, accountReference, transactionDesc) {
    try {
      const accessToken = await this.generateAccessToken();
      const { password, timestamp } = this.generatePassword();
      const formattedPhone = this.formatPhoneNumber(phone);

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL || `${process.env.BASE_URL}/api/payments/mpesa/callback`,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: {
          checkoutRequestId: response.data.CheckoutRequestID,
          merchantRequestId: response.data.MerchantRequestID,
          responseCode: response.data.ResponseCode,
          responseDescription: response.data.ResponseDescription,
          customerMessage: response.data.CustomerMessage
        }
      };
    } catch (error) {
      console.error('STK Push failed:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to initiate payment'
      };
    }
  }

  // Query STK Push status
  async querySTKStatus(checkoutRequestId) {
    try {
      const accessToken = await this.generateAccessToken();
      const { password, timestamp } = this.generatePassword();

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: {
          resultCode: response.data.ResultCode,
          resultDesc: response.data.ResultDesc,
          checkoutRequestId: response.data.CheckoutRequestID,
          merchantRequestId: response.data.MerchantRequestID
        }
      };
    } catch (error) {
      console.error('STK Query failed:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to query payment status'
      };
    }
  }

  // Process M-Pesa callback
  processCallback(callbackData) {
    try {
      const stkCallback = callbackData.Body?.stkCallback;
      
      if (!stkCallback) {
        throw new Error('Invalid callback data');
      }

      const resultCode = parseInt(stkCallback.ResultCode);
      const resultDesc = stkCallback.ResultDesc;
      const checkoutRequestId = stkCallback.CheckoutRequestID;
      const merchantRequestId = stkCallback.MerchantRequestID;

      if (resultCode === 0) {
        // Success - extract metadata
        const metadata = stkCallback.CallbackMetadata?.Item || [];
        const extractedData = {};

        metadata.forEach(item => {
          extractedData[item.Name] = item.Value;
        });

        return {
          success: true,
          data: {
            resultCode,
            resultDesc,
            checkoutRequestId,
            merchantRequestId,
            mpesaReceiptNumber: extractedData.MpesaReceiptNumber,
            amount: extractedData.Amount,
            phoneNumber: extractedData.PhoneNumber,
            transactionDate: extractedData.TransactionDate,
            rawData: extractedData
          }
        };
      } else {
        // Failure
        return {
          success: false,
          data: {
            resultCode,
            resultDesc,
            checkoutRequestId,
            merchantRequestId
          }
        };
      }
    } catch (error) {
      console.error('Callback processing failed:', error);
      
      return {
        success: false,
        error: error.message,
        message: 'Failed to process callback'
      };
    }
  }

  // Register C2B URLs (for production)
  async registerC2BUrls() {
    try {
      const accessToken = await this.generateAccessToken();

      const requestBody = {
        ShortCode: this.shortcode,
        ResponseType: 'Completed',
        ConfirmationURL: `${process.env.BASE_URL}/api/payments/mpesa/confirmation`,
        ValidationURL: `${process.env.BASE_URL}/api/payments/mpesa/validation`
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/c2b/v1/registerurl`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('C2B URL registration failed:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to register C2B URLs'
      };
    }
  }

  // Simulate C2B payment (for sandbox testing)
  async simulateC2BPayment(phone, amount, billRefNumber) {
    try {
      const accessToken = await this.generateAccessToken();
      const formattedPhone = this.formatPhoneNumber(phone);

      const requestBody = {
        ShortCode: this.shortcode,
        CommandID: 'CustomerPayBillOnline',
        Amount: amount,
        Msisdn: formattedPhone,
        BillRefNumber: billRefNumber
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/c2b/v1/simulate`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('C2B simulation failed:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to simulate payment'
      };
    }
  }

  // Generate QR Code for payment
  async generateQRCode(amount, transactionRef) {
    try {
      const accessToken = await this.generateAccessToken();

      const requestBody = {
        MerchantName: 'MatPulse254',
        RefNo: transactionRef,
        Amount: amount,
        TrxCode: 'PB',
        CPI: this.shortcode,
        Size: '300'
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/qrcode/v1/generate`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: {
          qrCode: response.data.QRCode,
          responseDescription: response.data.ResponseDescription
        }
      };
    } catch (error) {
      console.error('QR Code generation failed:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to generate QR code'
      };
    }
  }

  // Check account balance
  async checkAccountBalance() {
    try {
      const accessToken = await this.generateAccessToken();
      const { password, timestamp } = this.generatePassword();

      const requestBody = {
        Initiator: process.env.MPESA_INITIATOR_NAME,
        SecurityCredential: this.generateSecurityCredential(),
        CommandID: 'AccountBalance',
        PartyA: this.shortcode,
        IdentifierType: '4',
        Remarks: 'Balance check',
        QueueTimeOutURL: `${process.env.BASE_URL}/api/payments/mpesa/timeout`,
        ResultURL: `${process.env.BASE_URL}/api/payments/mpesa/result`
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/accountbalance/v1/query`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Account balance check failed:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to check account balance'
      };
    }
  }

  // Generate security credential (for production)
  generateSecurityCredential() {
    const initiatorPassword = process.env.MPESA_INITIATOR_PASSWORD;
    const certificate = process.env.MPESA_CERTIFICATE;
    
    // In production, you would use the actual certificate
    // This is a simplified version for development
    if (process.env.NODE_ENV === 'production') {
      // Implement actual certificate-based encryption
      throw new Error('Production security credential generation not implemented');
    }
    
    // For sandbox, use plain password
    return initiatorPassword;
  }

  // Validate payment callback signature
  validateCallbackSignature(signature, data) {
    try {
      // In production, validate the signature from Safaricom
      // This is a simplified validation for development
      const expectedSignature = crypto
        .createHash('sha256')
        .update(JSON.stringify(data) + process.env.MPESA_CALLBACK_SECRET)
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      console.error('Signature validation failed:', error);
      return false;
    }
  }

  // Parse transaction date from M-Pesa format
  parseTransactionDate(mpesaDate) {
    // M-Pesa date format: YYYYMMDDHHmmss
    const year = mpesaDate.substring(0, 4);
    const month = mpesaDate.substring(4, 6);
    const day = mpesaDate.substring(6, 8);
    const hour = mpesaDate.substring(8, 10);
    const minute = mpesaDate.substring(10, 12);
    const second = mpesaDate.substring(12, 14);

    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
  }

  // Calculate commission (if applicable)
  calculateCommission(amount, commissionRate = 0.015) {
    const commission = amount * commissionRate;
    const netAmount = amount - commission;
    
    return {
      amount,
      commission,
      netAmount,
      commissionRate
    };
  }
}

module.exports = new MpesaService();