import React from 'react';
import { Star, ShoppingCart, Heart, ChevronRight } from 'lucide-react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-[1.02] cursor-pointer">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110">
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-full text-sm font-semibold text-gray-900">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold bg-gray-100 px-2 py-1 rounded-full">
              {product.category}
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-2 leading-tight">
              {product.name}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${product.price}
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {product.features.slice(0, 3).map((feature, index) => (
              <span 
                key={index}
                className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {feature}
              </span>
            ))}
            {product.features.length > 3 && (
              <span className="text-gray-500 text-xs px-3 py-1 bg-gray-100 rounded-full font-medium">
                +{product.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>

        {/* Add to Cart Button */}
        <button 
          className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all flex items-center justify-center space-x-2 ${
            product.inStock
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          {product.inStock && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;