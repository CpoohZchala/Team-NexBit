import "./Payment.css";
import Image1 from "../assets/photos/payment.png";
import { useParams } from "react-router-dom";

export default function Payment() {
  const { bookingId } = useParams(); // Retrieve the bookingId from the URL
  console.log({ idddd: bookingId });

  return (
    <div className="Payment-container">
      <div className="logo"></div>

      <form className="Payment-form">
        <div className="main">
          <h1>
            Payment <span> Details</span>{" "}
          </h1>
          <div className="table-layout">
            <label htmlFor="cardNumber">CARD NUMBER</label>
            <input
              type="text"
              id="cardNumber"
              placeholder="Enter the Card Number"
            />

            <label htmlFor="cardName">NAME ON CARD</label>
            <input type="text" id="cardName" placeholder="Enter the name" />

            <label htmlFor="expiration">EXPIRATION</label>
            <div className="expiration-group">
              <input type="text" id="expirationMM" placeholder="MM" />
              <span>/</span>
              <input type="text" id="expirationYY" placeholder="YY" />
            </div>

            <label htmlFor="cvv">CVV</label>
            <input type="text" id="cvv" placeholder="Enter CVV" />
          </div>

          <div className="payment-methods ">
            <img
              className="image1"
              src={Image1}
              style={{ width: "600px", height: "auto" }}
            />
          </div>
        </div>

        <button type="submit">
          <b>PAY NOW</b>
        </button>
      </form>
    </div>
  );
}
