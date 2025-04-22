import { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Item/Item";

const NewCollections = () => {
  const [new_collection, setNew_Collection] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/newcollections")
      .then((res) => res.json()) // ✅ Call .json() correctly
      .then((data) => {
        if (Array.isArray(data)) { // ✅ Ensure the response is an array
          setNew_Collection(data);
        } else {
          console.error("Invalid data format:", data);
          setNew_Collection([]); // Prevent .map() error
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.length > 0 ? (
          new_collection.map((item, i) => (
            <div className="collection-item" key={i}>
              <Item
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            </div>
          ))
        ) : (
          <p>No collections available.</p> // ✅ Handle empty state
        )}
      </div>
    </div>
  );
};

export default NewCollections;
