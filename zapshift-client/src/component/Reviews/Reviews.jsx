import { use } from "react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import ReviewCard from "../ReviewCard/ReviewCard";

const reviewsPromise = fetch("/reviews.json").then((res) => res.json());

const Reviews = () => {
  const reviews = use(reviewsPromise);

  return (
    <div className="my-15">
      <div className="text-center mb-24">
        <h3 className="text-4xl font-bold my-8">What Our Customers Say</h3>
        <p>Real feedback from people who trust us with their deliveries.</p>
      </div>

      <Swiper
        loop
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView={3}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        coverflowEffect={{ rotate: 30, stretch: 50, depth: 200, modifier: 1, scale: 0.75, slideShadows: true }}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
      >
        {reviews.map((r) => (
          <SwiperSlide key={r.id} className="flex justify-center">
            <ReviewCard review={r} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Reviews;
