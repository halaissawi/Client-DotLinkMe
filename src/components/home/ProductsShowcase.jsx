import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const ProductsShowcase = () => {
  const products = [
    {
      id: 1,
      title: "NFC Digital Business Cards",
      image: "/images/3card.png",
      link: "/products/cards",
      badge: "Most Popular",
      badgeColor: "bg-blue-500",
    },
    {
      id: 2,
      title: "NFC Table Stands & Cards",
      image: "/images/TableStands.png",
      link: "/products/stands",
      badge: "For Business",
      badgeColor: "bg-blue-500",
    },
    {
      id: 3,
      title: "NFC Smart Rings & Accessories",
      image: "/images/SmartRings.png",
      link: "/products/rings",
      badge: "New",
      badgeColor: "bg-blue-500",
    },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#0066ff_1px,transparent_0)] bg-[size:40px_40px]"></div>
      </div>

      <div className="section-shell relative z-10">
        {/* Header */}
        <div
          data-aos="fade-up"
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-semibold mb-4">
            Our Products
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-dark mb-5">
            Multiple Ways to{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-brand-accent via-yellow-400 to-brand-accent bg-clip-text text-transparent">
                Share Your Identity
              </span>
            </span>
          </h2>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Select from our range of NFC products that suit your needs.
            <span className="block mt-2">
              All cards can be customized with your company logo and brand
              identity.
            </span>
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {products.map((product, index) => (
            <div
              key={product.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group relative"
            >
              {/* Product Card */}
              <div className="relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-20">
                    <span
                      className={`${product.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1`}
                    >
                      <Sparkles size={12} />
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Image Container - Clean background */}
                <div className="relative bg-gray-50 p-3 md:p-4 h-80 sm:h-96 md:h-[420px] flex items-center justify-center overflow-hidden">
                  {/* Product Image */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-[95%] h-[95%] object-contain transform group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-7">
                  <h3 className="text-xl md:text-2xl font-bold text-brand-dark mb-3 group-hover:text-brand-primary transition-colors">
                    {product.title}
                  </h3>

                  {/* CTA Button */}
                  <Link
                    to={product.link}
                    className="group/btn relative inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-sm md:text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="relative z-10">Order Now</span>
                    <ArrowRight
                      size={18}
                      className="relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="text-center mt-16 md:mt-20"
        >
          <p className="text-gray-600 text-base md:text-lg mb-6">
            Not sure which product is right for you?
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View All Products
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsShowcase;
