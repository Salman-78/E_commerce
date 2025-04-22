/* eslint-disable no-unused-vars */
// import React from "react";
// import "./Popular.css";
// import data from "../Assets/data";
// import Item from "../Item/Item";
// const Popular = () => {
//   return (
//     <div className="popular">
//       <h1>POPULAR IN WOMEN</h1>
//       <hr />
//       <div className="popular-item">
//         {data.map((item, i) => {
//           return (
//             <Item
//               key={i}
//               id={item.id}
//               name={item.name}
//               image={item.image}
//               new_price={item.new_price}
//               old_price={item.old_price}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Popular;

import React, { useEffect, useState } from "react";
import "./Popular.css";
import Item from "../Item/Item";
import { apiUrl } from "../../../client";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  useEffect(() => {
    fetch(`${apiUrl}/popularinwomen`)
      .then((res) => res.json())
      .then((data) => setPopularProducts(data));
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-container">
        {popularProducts.map((item, i) => (
          <div className="popular-item" key={i}>
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

export default Popular;
