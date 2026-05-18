import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaMobileAlt,
  FaCheckCircle,
  FaSpinner,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";
import { Context } from "../../utils/context";
import "./Checkout.scss";

const Checkout = () => {
  const { cartItems, cartSubTotal, setCartItems } = useContext(Context);
  const navigate = useNavigate();

  // Billing Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  // Payment Mode State
  const [paymentMode, setPaymentMode] = useState("upi"); // 'upi' or 'card'
  const [upiId, setUpiId] = useState("");
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  // Checkout Phase States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [showUpiOverlay, setShowUpiOverlay] = useState(false);
  const [showOtpOverlay, setShowOtpOverlay] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Generated Invoice Details
  const [invoice, setInvoice] = useState(null);

  // Timer for UPI flow
  const [timer, setTimer] = useState(300); // 5 minutes in seconds

  // If cart is empty and we are NOT showing success screen, redirect home
  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      navigate("/");
    }
  }, [cartItems, isSuccess, navigate]);


  useEffect(() => {
    let interval = null;
    if (showUpiOverlay && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowUpiOverlay(false);
    }
    return () => clearInterval(interval);
  }, [showUpiOverlay, timer]);

  const formatTime = (timeInSecs) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = timeInSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Form input change handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  // Calculations
  const shippingFee = cartSubTotal > 1500 ? 0 : 99;
  const taxGST = Math.round(cartSubTotal * 0.18);
  const grandTotal = cartSubTotal + shippingFee + taxGST;

  // Process Payments
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert("Please fill in all mandatory Shipping Details first!");
      return;
    }

    setIsProcessing(true);

    if (paymentMode === "upi") {
      if (!upiId.includes("@")) {
        alert("Please enter a valid UPI VPA ID (e.g. user@okaxis)!");
        setIsProcessing(false);
        return;
      }
      setProcessingStatus("Initializing Secure Razorpay UPI Gateway...");
      setTimeout(() => {
        setProcessingStatus("Generating payment collect request on UPI server...");
        setTimeout(() => {
          setIsProcessing(false);
          setTimer(300); // Reset timer
          setShowUpiOverlay(true); // Open UPI approval dialog
        }, 1200);
      }, 1000);
    } else {
      if (cardData.number.length < 15 || cardData.cvv.length < 3) {
        alert("Please enter valid Credit/Debit card details!");
        setIsProcessing(false);
        return;
      }
      setProcessingStatus("Connecting to card processing network...");
      setTimeout(() => {
        setProcessingStatus("Initiating Razorpay 3D Secure verification...");
        setTimeout(() => {
          setIsProcessing(false);
          setShowOtpOverlay(true); // Open OTP verification dialog
        }, 1200);
      }, 1000);
    }
  };

  // Simulate Payment Approval & Invoice Generation
  const handlePaymentSuccess = () => {
    setIsProcessing(true);
    setShowUpiOverlay(false);
    setShowOtpOverlay(false);
    setProcessingStatus("Receiving callback confirmation from bank...");

    setTimeout(() => {
      setProcessingStatus("Generating invoice & securing order details...");
      setTimeout(() => {
        const orderId = "ORD_" + Math.floor(100000 + Math.random() * 900000);
        const txnId = "TXN_" + Math.random().toString(36).substr(2, 9).toUpperCase();

        setInvoice({
          orderId,
          txnId,
          date: new Date().toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          items: [...cartItems],
          subtotal: cartSubTotal,
          shipping: shippingFee,
          gst: taxGST,
          total: grandTotal,
          address: formData.address,
          name: formData.name,
          phone: formData.phone,
          payment: paymentMode === "upi" ? `UPI (${upiId})` : "Credit/Debit Card",
        });

        setIsProcessing(false);
        setIsSuccess(true);
        setCartItems([]); // Programmatically empty the user's cart!
      }, 1500);
    }, 1200);
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (!otpInput) {
      alert("Please enter the 6-digit OTP!");
      return;
    }
    handlePaymentSuccess();
  };

  return (
    <div className="checkout-container">
      {/* 1. Processing Loading Screen */}
      {isProcessing && (
        <div className="processing-overlay">
          <div className="loading-content">
            <FaSpinner className="spinner" />
            <div className="razorpay-header">
              <span className="bold">Razorpay</span>
              <span className="badge">TEST MODE</span>
            </div>
            <span className="status-text">{processingStatus}</span>
          </div>
        </div>
      )}

      {/* 2. UPI App collect notification screen */}
      {showUpiOverlay && (
        <div className="modal-overlay">
          <div className="upi-modal">
            <div className="modal-header">
              <div className="razorpay-logo">
                <span>Razorpay</span>
                <span className="badge">Collect</span>
              </div>
              <span className="amount">&#8377;{grandTotal}</span>
            </div>
            <div className="modal-body">
              <FaMobileAlt className="phone-icon" />
              <h3>Approve Payment on UPI App</h3>
              <p className="description">
                A collect request of <strong>&#8377;{grandTotal}</strong> has been
                sent to your UPI ID: <strong>{upiId}</strong>.
              </p>
              <p className="instruction">
                Please open your UPI app (Google Pay, PhonePe, Paytm, or BHIM) and
                approve the payment request to complete the order.
              </p>

              {/* Countdown Timer */}
              <div className="timer-box">
                <span className="label">Time remaining to approve</span>
                <span className="time">{formatTime(timer)}</span>
              </div>

              {/* Simulator trigger button */}
              <button className="simulate-btn" onClick={handlePaymentSuccess}>
                <FaCheckCircle />
                <span>Simulate Successful UPI Approval (Tap to Pay)</span>
              </button>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowUpiOverlay(false)}
              >
                Cancel Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Card Bank 3D Secure OTP Overlay */}
      {showOtpOverlay && (
        <div className="modal-overlay">
          <div className="otp-modal">
            <div className="bank-header">
              <span className="bank-title">SECURE MERCHANT BANKING</span>
              <span className="secure-badge">VERIFIED BY VISA / MASTERCARD</span>
            </div>
            <div className="otp-body">
              <h3>Enter One-Time Password (OTP)</h3>
              <p>
                An OTP has been sent to your registered mobile ending in{" "}
                <strong>{formData.phone.slice(-4) || "XXXX"}</strong> for the purchase
                of <strong>&#8377;{grandTotal}</strong>.
              </p>

              <form onSubmit={handleOtpVerify} className="otp-form">
                <div className="input-group">
                  <input
                    type="password"
                    maxLength="6"
                    placeholder="Enter 6-Digit OTP"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    required
                  />
                  <span className="helper">Demo OTP: Enter any digits (e.g. 123456)</span>
                </div>

                <div className="otp-buttons">
                  <button type="submit" className="submit-otp-btn">
                    Submit OTP
                  </button>
                  <button
                    type="button"
                    className="cancel-otp-btn"
                    onClick={() => setShowOtpOverlay(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 4. Invoice Success Page */}
      {isSuccess && invoice && (
        <div className="invoice-success-container">
          <div className="success-badge-card">
            <FaCheckCircle className="check-success" />
            <h1>Order Confirmed!</h1>
            <p>Thank you for shopping. Your payment was processed successfully.</p>
          </div>

          <div className="invoice-receipt">
            <div className="receipt-header">
              <div className="logo">SearchStore</div>
              <div className="meta">
                <span>
                  <strong>Date:</strong> {invoice.date}
                </span>
                <span>
                  <strong>Order ID:</strong> {invoice.orderId}
                </span>
                <span>
                  <strong>Transaction ID:</strong> {invoice.txnId}
                </span>
              </div>
            </div>

            <div className="receipt-body">
              <div className="section">
                <h3>Delivery Summary</h3>
                <div className="summary-grid">
                  <div>
                    <strong>Customer:</strong> {invoice.name}
                  </div>
                  <div>
                    <strong>Contact:</strong> {invoice.phone}
                  </div>
                  <div className="span-2">
                    <strong>Shipping Address:</strong> {invoice.address}
                  </div>
                  <div>
                    <strong>Payment Method:</strong> {invoice.payment}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span className="success-tag">PAID (Razorpay Collect)</span>
                  </div>
                </div>
              </div>

              <div className="section">
                <h3>Purchased Items</h3>
                <div className="receipt-items">
                  {invoice.items.map((item) => (
                    <div className="receipt-item" key={item.id}>
                      <span className="item-name">
                        {item.attributes.title} x {item.attributes.quantity}
                      </span>
                      <span className="item-price">
                        &#8377;{item.attributes.price * item.attributes.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section total-section">
                <div className="row">
                  <span>Cart Subtotal</span>
                  <span>&#8377;{invoice.subtotal}</span>
                </div>
                <div className="row">
                  <span>Taxes (GST 18%)</span>
                  <span>&#8377;{invoice.gst}</span>
                </div>
                <div className="row">
                  <span>Delivery Charges</span>
                  <span>
                    {invoice.shipping === 0 ? "FREE" : `\u20B9${invoice.shipping}`}
                  </span>
                </div>
                <div className="row grand-row">
                  <span>Total Amount Paid</span>
                  <span>&#8377;{invoice.total}</span>
                </div>
              </div>
            </div>

            <div className="receipt-footer">
              <p>This is a simulated Razorpay Sandbox sandbox transaction receipt.</p>
              <button className="continue-btn" onClick={() => navigate("/")}>
                <FaRegArrowAltCircleRight />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Main Checkout Form Layout */}
      {!isSuccess && (
        <>
          <div className="checkout-title">
            <h1>Secured Checkout</h1>
            <p>Complete your purchase securely via Razorpay Test Sandbox.</p>
          </div>

          <div className="checkout-layout">
            {/* Left: Forms */}
            <div className="checkout-form-panel">
              <form onSubmit={handlePaymentSubmit}>
                {/* Section A: Shipping */}
                <div className="form-section">
                  <h2>
                    <span className="num">1</span>
                    <span>Shipping & Delivery Details</span>
                  </h2>

                  <div className="input-row">
                    <div className="input-group">
                      <label>Full Name *</label>
                      <div className="input-wrapper">
                        <FaUser className="field-icon" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Aman Kumar"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Email Address *</label>
                      <div className="input-wrapper">
                        <FaEnvelope className="field-icon" />
                        <input
                          type="email"
                          name="email"
                          placeholder="aman@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label>Contact Phone *</label>
                      <div className="input-wrapper">
                        <FaPhone className="field-icon" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>ZIP/Postal Code *</label>
                      <div className="input-wrapper">
                        <FaMapMarkerAlt className="field-icon" />
                        <input
                          type="text"
                          name="zip"
                          placeholder="110001"
                          value={formData.zip}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="input-group full-width">
                    <label>Street Address *</label>
                    <div className="input-wrapper">
                      <FaMapMarkerAlt className="field-icon" />
                      <input
                        type="text"
                        name="address"
                        placeholder="House No, Building, Street, Area"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Payments */}
                <div className="form-section">
                  <h2>
                    <span className="num">2</span>
                    <span>Select Payment Option (Razorpay Test Gateway)</span>
                  </h2>

                  {/* Payment Mode Selector Tabs */}
                  <div className="payment-tabs">
                    <div
                      className={`payment-tab ${paymentMode === "upi" ? "active" : ""}`}
                      onClick={() => setPaymentMode("upi")}
                    >
                      <FaMobileAlt className="tab-icon" />
                      <div className="text-box">
                        <span className="title">UPI Instant Collect</span>
                        <span className="desc">GPay, PhonePe, Paytm, BHIM</span>
                      </div>
                    </div>
                    <div
                      className={`payment-tab ${paymentMode === "card" ? "active" : ""}`}
                      onClick={() => setPaymentMode("card")}
                    >
                      <FaCreditCard className="tab-icon" />
                      <div className="text-box">
                        <span className="title">Credit / Debit Card</span>
                        <span className="desc">Visa, Mastercard, RuPay</span>
                      </div>
                    </div>
                  </div>

                  {/* Tab Body: UPI */}
                  {paymentMode === "upi" && (
                    <div className="payment-tab-content">
                      <label>Enter UPI VPA ID *</label>
                      <div className="input-wrapper">
                        <FaMobileAlt className="field-icon" />
                        <input
                          type="text"
                          placeholder="e.g. aman@okaxis or aman@paytm"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          required={paymentMode === "upi"}
                        />
                      </div>
                      <span className="hint">
                        We will send a payment collect alert to your UPI app for sandbox simulation.
                      </span>
                    </div>
                  )}

                  {/* Tab Body: Card */}
                  {paymentMode === "card" && (
                    <div className="payment-tab-content card-fields">
                      <div className="input-group full-width">
                        <label>Card Number *</label>
                        <div className="input-wrapper">
                          <FaCreditCard className="field-icon" />
                          <input
                            type="text"
                            name="number"
                            maxLength="16"
                            placeholder="4111 2222 3333 4444"
                            value={cardData.number}
                            onChange={handleCardChange}
                            required={paymentMode === "card"}
                          />
                        </div>
                      </div>

                      <div className="input-row">
                        <div className="input-group">
                          <label>Expiry Date *</label>
                          <input
                            type="text"
                            name="expiry"
                            maxLength="5"
                            placeholder="MM/YY"
                            value={cardData.expiry}
                            onChange={handleCardChange}
                            required={paymentMode === "card"}
                          />
                        </div>
                        <div className="input-group">
                          <label>CVV/CVC *</label>
                          <input
                            type="password"
                            name="cvv"
                            maxLength="3"
                            placeholder="123"
                            value={cardData.cvv}
                            onChange={handleCardChange}
                            required={paymentMode === "card"}
                          />
                        </div>
                      </div>

                      <div className="input-group full-width">
                        <label>Name on Card *</label>
                        <input
                          type="text"
                          name="nameOnCard"
                          placeholder="Aman Kumar"
                          value={cardData.nameOnCard}
                          onChange={handleCardChange}
                          required={paymentMode === "card"}
                        />
                      </div>
                    </div>
                  )}

                  <button type="submit" className="pay-now-btn">
                    <span>Pay Securely &#8377;{grandTotal}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Order summary */}
            <div className="checkout-summary-panel">
              <h2>Order Summary</h2>
              
              <div className="summary-products">
                {cartItems.map((item) => (
                  <div className="product-row" key={item.id}>
                    <div className="img-box">
                      <img
                        src={
                          process.env.REACT_APP_DEV_URL +
                          item.attributes.img.data[0].attributes.url
                        }
                        alt={item.attributes.title}
                      />
                      <span className="qty-badge">{item.attributes.quantity}</span>
                    </div>
                    <div className="details">
                      <span className="title">{item.attributes.title}</span>
                      <span className="price-item">
                        &#8377;{item.attributes.price} each
                      </span>
                    </div>
                    <div className="item-subtotal">
                      &#8377;{item.attributes.price * item.attributes.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-breakdowns">
                <div className="breakdown-row">
                  <span>Cart Subtotal</span>
                  <span>&#8377;{cartSubTotal}</span>
                </div>
                <div className="breakdown-row">
                  <span>Taxes (GST 18%)</span>
                  <span>&#8377;{taxGST}</span>
                </div>
                <div className="breakdown-row">
                  <span>Delivery Charges</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="free">FREE</span>
                    ) : (
                      `\u20B9${shippingFee}`
                    )}
                  </span>
                </div>

                {shippingFee > 0 && (
                  <span className="shipping-hint">
                    Add &#8377;{1500 - cartSubTotal} more to unlock FREE shipping!
                  </span>
                )}

                <div className="breakdown-row grand-total-row">
                  <span>Grand Total</span>
                  <span>&#8377;{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
