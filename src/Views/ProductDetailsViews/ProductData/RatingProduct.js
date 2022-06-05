import React, { useState, useEffect, useRef } from 'react';
import { GxIcon, GxRating } from '@garpix/garpix-web-components-react';
import { shareIcon, favoriteIcon, favoriteFilledIcon } from '../../../images';
import { fbIcon, igIcon, vkIcon, waIcon, vIcon, telIcon } from '../../../images';
import Button from '../../Button';
import Sharing from '../../../components/Sharing';
import style from '../styles/index.module.scss';
import classNames from 'classnames';

const RatingProduct = ({
  reviews_statistic = { all_count: 0, all_count_percent: 0, max_stars_count: 0, stars_count: 0 },
  addWishlistProduct,
  productId,
  profileId,
  is_liked,
  title,
  shereRef,
  setStyleSocialItems,
  styleSocialItems,
}) => {
  const [favorite, setfavorite] = useState(is_liked);
  const pathPageProduct =window.location.href;
  
  const handleFavorite = () => {
    setfavorite(!favorite);
    addWishlistProduct(productId, profileId);
  };

  useEffect(() => {
    setfavorite(is_liked);
  }, [is_liked]);

  const social_links = [
    {
      icon: fbIcon,
      url: `https://www.facebook.com/sharer/sharer.php?u=`
    },
    {
      icon: igIcon,
      url: `http://instagram.com/###?direct/inbox&text=`,
    },
    {
      icon: vkIcon,
      url: 'https://vk.com/share.php?url=',
    },
    {
      icon: waIcon,
      url: `https://api.whatsapp.com/send/?phone&text=`,
    },
    {
      icon: vIcon,
      url: `viber://forward?text=`,
    },
    {
      icon: telIcon,
      url:  'https://telegram.me/share/url?url=',
    },
  ];
    

  const henderClickSocial = () =>{
    setStyleSocialItems(!styleSocialItems)
  };

  const henderShare = (social)=>{
    window.open(`${social}${pathPageProduct}`,"",'_blank','height=500','width=600')
  }
  return (
    <div className={style['prodpage__rating']}>
      <div>
        
        <GxRating
          className={style['prodpage__rating-indicator']}
          precision="1"
          disabled
          value={reviews_statistic.all_count_percent}
        ></GxRating>
        <span className={style['prodpage__rating-counter']}>
          {`${reviews_statistic.all_count}`} отзыв(ов)
        </span>
      </div>
      <div className={style['prodpage__button_group']}>
     
        <Sharing title={title}>
          {({ callbackShareClick }) => {
            return (
              <div 
              ref={shereRef}
              className={ classNames({
                [style['social']]: !styleSocialItems,
                [style['social_opened']]: styleSocialItems,
              })}
              >
                <Button
                  onClick={()=>{
                    henderClickSocial();
                  }}
                  className={style['prodpage__button_group-btn']}
                >
                  <GxIcon src={shareIcon} />
                </Button>

                <div className={style["social-list"]}>
                  <div
                   className={style["social-link"]} 
                   onClick={()=>henderShare(social_links[0].url)} 
                  >
                    <img src={social_links[0].icon} className={style["social-link__fb"]} />
                  </div>
                  <div
                   className={style["social-link"]} 
                   onClick={()=>henderShare(social_links[1].url)} 
                  >
                    <img src={social_links[1].icon} className={style["social-link__ig"]} />
                  </div>
                  <div
                  className={style["social-link"]} 
                  onClick={()=>henderShare(social_links[2].url)} 
                  >
                    <img src={social_links[2].icon} className={style["social-link__vk"]} />
                  </div>

                  <div
                  className={style["social-link"]} 
                  onClick={()=>henderShare(social_links[3].url)} 
                  >
                    <img src={social_links[3].icon} className={style["social-link__wt"]} />
                  </div>
                  <div
                  className={style["social-link"]} 
                  onClick={()=>henderShare(social_links[4].url)} 
                  >
                    <img src={social_links[4].icon} className={style["social-link__vi"]} />
                  </div>
                  <div
                  className={style["social-link"]} 
                  onClick={()=>henderShare(social_links[5].url)} 
                  >
                    <img src={social_links[5].icon} className={style["social-link__tl"]} />
                  </div>

                </div>
              </div>
            );
          }}
        </Sharing>

        <Button onClick={handleFavorite} className={style['prodpage__button_group-btn']}>
          <GxIcon src={favorite ? favoriteFilledIcon : favoriteIcon} />
        </Button>
      </div>
    </div>
  );
};
export default React.memo(RatingProduct);
