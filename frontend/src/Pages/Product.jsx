/* eslint-disable no-unused-vars */
import React, { useContext } from 'react'
import "../Pages/CSS/Product.css"
import { ShopContext } from '../Context/ShopContext'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProduct from '../Components/RelatedProducts/RelatedProduct';

const Product = () => {
  const {all_product} =useContext(ShopContext);
  const {productId} = useParams();
  // const product = all_product.find((e)=> e.id === Number(productId));
  const product = all_product ? all_product.find((e) => e.id === Number(productId)) : null;
  return (
    <div>
      {/* <Breadcrum product={product}/> */}
      {product ? <Breadcrum product={product} /> : <p>Product not found</p>}
      {product ? <ProductDisplay product={product} /> : <p>Product not found</p>}
      <DescriptionBox/>
      <RelatedProduct/>
    </div>
  )
}

export default Product
