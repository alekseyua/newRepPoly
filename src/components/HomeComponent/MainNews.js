import React from 'react';
import MainNewsLayout from '../../Views/MainNewsLayout';

const MainNews = ({ news = [], news_url = '', front_admin }) => {
  return <MainNewsLayout news={news} news_url={news_url}  front_admin={front_admin} />;
};
export default React.memo(MainNews);
