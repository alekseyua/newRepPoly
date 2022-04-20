import React from 'react';
import style from './mainNews.module.scss';
import NewsCard from '../NewsCard';
import MoreLink from '../MoreLink';
import Text from '../../components/Text';
import Title from '../Title';
import Settings from '../../#lifehack/Settings/Settings';

const MainNewsLayout = ({ news, news_url, front_admin }) => {
  return (
    <div className={style['main-news']}>
      {front_admin?<Settings nameComponent={'MainNewsLayout'} /> : null }
      <div className={'container'}>
        <div className={style['main-news-wrap']}>
          <Title type={'h2'} variant={'news-title'}>
            <Text text={'news'} />
          </Title>
          <div className={style['main-news__list']}>
            {news.map((el, i) => {
              return (
                <NewsCard
                  key={el.id}
                  img={el.image}
                  title={el.title}
                  date={el.created_at}
                  description={el.description}
                  url={el.url}
                />
              );
            })}
          </div>
          <MoreLink url={news_url}>
            <Text text={'show_all'} />
          </MoreLink>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MainNewsLayout);
