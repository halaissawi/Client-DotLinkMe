import Hero from "../components/home/Hero";
import WhatIs from "../components/home/WhatIs";
import HowItWorks from "../components/home/HowItWorks";
import WhyChoose from "../components/home/WhyChoose";
import FinalCTA from "../components/home/FinalCTA";
import ProductsShowcase from "../components/home/ProductsShowcase";

const Home = () => {
  return (
    <div className=" bg-white">
      <Hero />
      {/* <WhatIs /> */}
      <ProductsShowcase />
      <HowItWorks />
      <WhyChoose />
      <FinalCTA />
    </div>
  );
};

export default Home;
