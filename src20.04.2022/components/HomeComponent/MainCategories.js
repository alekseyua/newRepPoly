import React from 'react';
import MainCategoriesLayout from '../../Views/MainCategoriesLayout';

const MainCategories = ({ banners, front_admin }) => {
  return <MainCategoriesLayout banners={banners} front_admin={front_admin} />;
};

export default React.memo(MainCategories);
