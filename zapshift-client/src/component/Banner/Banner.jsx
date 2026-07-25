import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ban1 from "../../assets/banner/banner1.png";
import ban2 from "../../assets/banner/banner2.png";
import ban3 from "../../assets/banner/banner3.png";

const Banner = () => {
  return (
    <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} className="my-5 rounded-lg overflow-hidden">
      <div><img src={ban1} alt="Fast reliable delivery" /></div>
      <div><img src={ban2} alt="Nationwide coverage" /></div>
      <div><img src={ban3} alt="Cash on delivery" /></div>
    </Carousel>
  );
};

export default Banner;
