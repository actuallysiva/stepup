import { useNavigate } from 'react-router-dom';
import { ImageOff } from "lucide-react";

import "./styles/product-card.css";

export default function ProductCard(props) {
  const navigate = useNavigate();

  return (
  <div
    className="productCard"
    onClick={() => navigate(`/details/${props.id}`)}
  >
    <div className="productImage">
      {props.image ? (
        <img src={props.image} 
             alt={props.name} />
) : ( <div className="imagePlaceholder">
        <ImageOff size={46}/>
        <span>No Image</span>
      </div>
)}
    </div>

    <div className="productInfo">

      <h2 className="productName">
        {props.name}
      </h2>

      <p className="productColor">
        {props.color}
      </p>

      <div className="productFooter">

        { props.price ?( <span className="productPrice">
          ₹ {Number(props.price).toLocaleString()}
        </span>) : (
          <span className="productUnavailable">
            Coming Soon
          </span> ) }

        

        {
    props.size && (

        <span className="productSize">

            UK {props.size}

        </span>

    )
}

      </div>

    </div>

  </div>
);
}
