/* eslint-disable no-unused-vars */
import React from "react";
import "./RelatedProduct.css";
import data_product from "../Assets/data";
import Item from "../Item/Item";

const RelatedProduct = () => {
  return (
    <div className="relatedproduct">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproduct-container">
        {data_product.map((item, i) => (
          <div className="relatedproduct-item" key={i}>
            <Item
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;
