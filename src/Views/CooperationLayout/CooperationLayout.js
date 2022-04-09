import React from 'react';
import style from './cooperation.module.scss';
import { cooperationCard1 } from '../../images/index';
import Text from '../../components/Text';
import CooperationCard from '../../Views/CooperationCard';
import Title from '../Title';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
// ? структура одного элемента карточки
// banner_type: "main_page_for_partner"
// content: "Покупайте выгодно от 1 шт. ↵ Отправляйте напрямую своим покупателям*"
// created_at: "2021-02-15T10:53:33.621102"
// css_class: ""
// footnote: "*При наличии действующего интренет-магазина / точки продаж"
// image: null
// image_thumb: null
// is_active: true
// ordering: 1
// target_blank: false
// thumb_size: ""
// title: "Дропшипперам"
// updated_at: "2021-02-15T10:53:33.621126"
// url: "/"
const CooperationLayout = (props) => {
  const { partner_banners } = props;
  return (
    <div className={style['cooperation']}>
      <div className={style['cooperation-bgi']} 
        style={{backgroundImage: `url(${cooperationCard1})`}}
      >  
        <div className={style['cooperation__inner-title']}>
          <Title type={'h2'} variant={'cooperation-title'}>
            <Text text={'cooperation_1'} />
            <br></br>
            <Text text={'cooperation_2'} />
          </Title>
        </div>

        <div className={style['container']}>
          <div
            className={classNames({
              [style['cooperation-main-wrap']]: true,
            })}
          >
                <div className={style['cooperation-wrap']}>
                  {partner_banners.map((el, i) => {
                  return (
                      <div className={style['cooperation-wrap-box']} key={el.created_at}>
                        <div className={style['cooperation-wrap-box-inner']} key={el.created_at}>
                          <div className={style['cooperation-wrap-box-title']}>{el.title}</div>
                          <div className={style['cooperation-wrap-box-context']} dangerouslySetInnerHTML={{ __html: el.content }}></div>
                          <div className={style['cooperation-wrap-box-footnote']}>{el.footnote}</div>
                          <Link 
                            to={el.url}
                            className={style["content-about-info__btn"]}
                            >Подробнее
                          </Link>
                        </div>
                      </div>
                  );
                })}
              </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default React.memo(CooperationLayout);


{/* <div className={style['cooperation-bg']}></div>
      <Title type={'h2'} variant={'cooperation-title'}>
        <Text text={'cooperation'} />
      </Title>



      <span className={style['cooperation__subtitle']}>
        <Text text={'onFavorableTerms'} />
      </span>
      <div className={'container'}>
        <div
          className={classNames({
            [style['cooperation-wrap']]: true,
            [style['cooperation-main-wrap']]: true,
          })}
        >
          <div className={style['cooperation-wrap']}>
          {partner_banners.map((el, i) => {
            return (
              <CooperationCard
                key={el.created_at}
                img={el.image ? el.image : cooperationCard1}
                title={el.title}
                url={el.url}
                footnote={el.footnote}
              >
                <div dangerouslySetInnerHTML={{ __html: el.content }}></div>
              </CooperationCard>
            );
          })}
        </div>
      </div> */}