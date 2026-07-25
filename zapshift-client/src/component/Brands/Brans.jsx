import React from "react";
import Marquee from "react-fast-marquee";
import amazon from "../../assets/brands/amazon.png";
import amazonVector from "../../assets/brands/amazon_vector.png";
import casio from "../../assets/brands/casio.png";
import moonstar from "../../assets/brands/moonstar.png";
import randstad from "../../assets/brands/randstad.png";
import star from "../../assets/brands/star.png";
import startPeople from "../../assets/brands/start_people.png";

const brands = [amazon, amazonVector, casio, moonstar, randstad, star, startPeople];

const Brans = () => {
  return (
    <Marquee className="my-10" pauseOnHover speed={100} gradient={false}>
      {brands.map((b, i) => (
        <div className="mx-10" key={i}>
          <img src={b} alt="brand logo" />
        </div>
      ))}
    </Marquee>
  );
};

export default Brans;
