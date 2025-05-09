import { useContext, useState, useEffect, useRef } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    selectedNGO,
    setSelectedNGO,
    selectedPromo,
    setSelectedPromo,
  } = useContext(StoreContext);

 
  const navigate = useNavigate();
  // Add state for NGO dropdown
  const [showNGODialog, setShowNGODialog] = useState(false);
  const [showPromoDialog, setShowPromoDialog] = useState(false);

  const dialogRef = useRef(null);
  // Updated to use context function
  const selectNGO = (ngo) => {
    setSelectedNGO(ngo.name);
    setShowNGODialog(false);
  };
  const selectPromo = (promo) => {
    setSelectedPromo(promo.name);
    setShowPromoDialog(false);
  };
  const salad = food_list
  .filter((item) => (item.category === "Salad" ) && cartItems[item._id] > 0)
  .reduce((count, item) => count + cartItems[item._id], 0);
  const pureveg = food_list
  .filter((item) => (item.category === "Pure Veg" ) && cartItems[item._id] > 0)
  .reduce((count, item) => count + cartItems[item._id], 0);
  
    
  // Sample NGO data - replace with your actual data source
  const ngoList = [
    {
      id: 1,
      name: "Feeding India",
      details: "Fighting hunger across the India",
    },
    {
      id: 2,
      name: "Food for Life",
      details: "Providing plant-based meals globally",
    },
    {
      id: 3,
      name: "World Food Program",
      details: "Largest humanitarian organization fighting hunger",
    },
    { id: 4, name: "No Kid Hungry", details: "Ending child hunger in America" },
  ];

  const promoList = [
    {
      id: 1,
      name: `Salad#${salad}`,
        details: `Get $2 off on ${salad} items`,
       
    },
    {
      id: 2,
      name: `PureVeg#${pureveg}`,
      details: `Get $5 off on ${pureveg} items`,
    },
  ];
  // Function to handle NGO selection

  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowNGODialog(false);
      }
    };

    if (showNGODialog) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNGODialog]);
    const promodiscount = () => {
    if (selectedPromo === `Salad#${salad}`) {
      return 2 * salad;
    } else if (selectedPromo === `PureVeg#${pureveg}`) {
      return 5 * pureveg;
    }
    return 0;
  };
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            //console.log(salad);
            
            return (
              <div key={item._id}>
                {" "}
                {/* ✅ Added a unique key here */}
                <div className="cart-items-title cart-items-item">
                  <img src={`${url}/images/${item.image}`} alt="" />
                 
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Promo Discount</p>
              
              <p>${getTotalCartAmount() === 0 ? 0 :  promodiscount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2 - promodiscount()}
              </b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="promo-ngo">
          <div className="cart-promocode">
            <div>
              <p>If you have a promo code, enter it here</p>
              <div className="cart-promocode-input">
                <input type="text" 
                placeholder="Promo-code" 
                value={selectedPromo}
                    onClick={() => setShowPromoDialog(true)}
                   
                />
                <button>Submit</button>
              </div>
            </div>
            {showPromoDialog && (
              <div className="ngo-dialog-overlay">
                <div className="ngo-dialog" ref={dialogRef}>
                  <div className="ngo-dialog-header">
                    <h3>Select the promo-code</h3>
                    <button
                      className="ngo-dialog-close"
                      onClick={() => setShowPromoDialog(false)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="ngo-dialog-content">
                    {promoList.map((promo) => (
                      <div
                        key={promo.id}
                        className="ngo-option"
                        onClick={() => selectPromo(promo)}
                      >
                        <h4>{promo.name}</h4>
                        <p>{promo.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="cart-promocode">
            <div>
              <p>Donate NGOs: One who feed gets feeded</p>
              <div className="cart-promocode-input">
                <div className="ngo-dropdown-container">
                  <input
                    type="text"
                    placeholder="Select NGOs"
                    value={selectedNGO}
                    onClick={() => setShowNGODialog(true)}
                   
                  />
                </div>
                <button>Select</button>
              </div>
            </div>
            {showNGODialog && (
              <div className="ngo-dialog-overlay">
                <div className="ngo-dialog" ref={dialogRef}>
                  <div className="ngo-dialog-header">
                    <h3>Select an NGO to Donate</h3>
                    <button
                      className="ngo-dialog-close"
                      onClick={() => setShowNGODialog(false)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="ngo-dialog-content">
                    {ngoList.map((ngo) => (
                      <div
                        key={ngo.id}
                        className="ngo-option"
                        onClick={() => selectNGO(ngo)}
                      >
                        <h4>{ngo.name}</h4>
                        <p>{ngo.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
