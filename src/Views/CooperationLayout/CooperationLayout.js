import React from 'react';
import style from './cooperation.module.scss';
import { cooperationCard1 } from '../../images/index';
import Text from '../../components/Text';
import Title from '../Title';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Settings from '../../#lifehack/Settings/Settings';
// ? структура одного элемента карточки

const CooperationLayout = (props) => {
  const { partner_banners, front_admin } = props;
  return (
    <div className={style['cooperation']}>
      {front_admin?<Settings nameComponent={'CooperationLayout'} /> : null }

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