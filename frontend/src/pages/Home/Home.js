import "./Home.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import jsonData from "../../services/data.json";
import SwiperImage1 from "../../assets/images/swiper-1.webp";
import categoryImage1 from "../../assets/images/category-1.webp";

export default function Home() {
  const { categoryHighlights } = jsonData;

  return (
    <section className="home">
      <div className="swiper-cntnr">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
        >
          <SwiperSlide>
            <img src={SwiperImage1} alt="slide1" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={SwiperImage1} alt="slide2" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={SwiperImage1} alt="slide3" />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="category-highlts-main">
        <h1>Category highlights</h1>
        <p>
          Enhance your taste with our authentic collection—tradition meets
          flavor
        </p>
        <div className="category-highlts-main__row">
          {categoryHighlights.map((category) => (
            <div className="category-highlts-main__row__col" key={category.id}>
              <img src={categoryImage1} alt="category" />
              <h4>{category.title}</h4>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="videos-highlights-main">
        <h1>From The Hands Of Ayra</h1>
        <div className="videos-highlights-main__row">
          {categoryHighlights.map((category) => (
            <div className="videos-highlights-main__row__col" key={category.id}>
              <video width="100%" autoPlay muted loop>
                <source
                  src="/assets/videos/HOW_FLOUR_IS_MADE.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="videos-highlights-main__row__col__content">
                <strong>Flours</strong>
                <p>Rs. 299.00</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
