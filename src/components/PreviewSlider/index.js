import React, { useState, useRef, useEffect } from 'react';
import SliderViews from '../../Views/SliderViews';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Player, BigPlayButton, Video, ControlBar } from 'video-react';
import SwiperCore, { Navigation, Pagination, Controller, Thumbs } from 'swiper';
import { v4 } from 'uuid';

SwiperCore.use([Navigation, Pagination, Controller, Thumbs]);

const FancyButton = React.forwardRef(({ className, ...props }, ref) => (
  <div {...props} ref={ref} className={className}>
    {props.children}
  </div>
));
  
const PreviewSlider = ({ 
  imageOrVideoSet = [], 
  defaultImage,
  colorId,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [controlledSwiper, setControlledSwiper] = useState(null);
  const [controlledTwoSwiper, setControlledTwoSwiper] = useState(null);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  useEffect(()=>{
    controlledSwiper? controlledSwiper.slideTo(0,800) : null   
  },[imageOrVideoSet])
  return (
    <SliderViews.Wrapper>
       <SliderViews.FirstSliderWrapper>
        <FancyButton className={'swiper-button-prev'} ref={navigationPrevRef}></FancyButton>
        <Swiper
          id="main"
          thumbs={{ swiper: thumbsSwiper }}
          controller={{ control: controlledSwiper }}
          onSwiper={setControlledTwoSwiper}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          resizeObserver
          resistance
          observer={true}
          observeSlideChildren
          direction={'vertical'}
          spaceBetween={10}
          slidesPerView={1}
          freeMode={false}
          longSwipesRatio={0.1}
          // size={100}
          className={'swipper_container-vertical'}
        >
          {!imageOrVideoSet.length && defaultImage ? (
            <SwiperSlide key={v4()}>
              <SliderViews.Slide image={defaultImage}></SliderViews.Slide>
            </SwiperSlide>
          ) : null}
          {imageOrVideoSet.map((el, i) => {
            if(el.type === 'video'){
              <SwiperSlide key={v4()}>
                  <Video
                    autoPlay
                    className="news-details-page__slider_item"
                    fluid={true}
                    poster={el.video}
                    src={el.preview}
                  >
                    {/* <BigPlayButton position="center"></BigPlayButton> */}
                  </Video>
                </SwiperSlide>
            }else{
              return (
                <SwiperSlide key={v4()}>
                  <SliderViews.Slide
                    image={ !!el.image? el.image : defaultImage}
                  ></SliderViews.Slide>
                </SwiperSlide>
            );
          }
          })}
        </Swiper>
        <FancyButton className={'swiper-button-next'} ref={navigationNextRef}></FancyButton>
      </SliderViews.FirstSliderWrapper>
      <SliderViews.LastSliderWrapper>
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          id="controller"
          onSwiper={setControlledSwiper}
          thumbs={{ swiper: thumbsSwiper }}
          controller={{ control: controlledTwoSwiper }}
          watchSlidesVisibility
          resistance
          observer
          resizeObserver
          observeSlideChildren
        >
          {!imageOrVideoSet.length && defaultImage ? (
            <SwiperSlide key={v4()}>
              <SliderViews.Slide image={defaultImage}></SliderViews.Slide>
            </SwiperSlide>
          ) : null}
          {imageOrVideoSet.map((el, i) => {
            if (el.type === 'video') {
              return (
                <SwiperSlide key={v4()}>
                  <Player
                    className="news-details-page__slider_item"
                    fluid={true}
                    poster={el.preview}
                    src={el.preview}
                  >
                    <BigPlayButton position="center"></BigPlayButton>
                  </Player>
                </SwiperSlide>
              );
            } else {
              return (
                <SwiperSlide key={v4()}>
                  <SliderViews.Slide image={el.image}>
                  </SliderViews.Slide>
                </SwiperSlide>
              );
            }
          })}
        </Swiper>
      </SliderViews.LastSliderWrapper>
    </SliderViews.Wrapper>
  );
};

export default React.memo(PreviewSlider);
