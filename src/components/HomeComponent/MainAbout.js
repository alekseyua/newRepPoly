import React from 'react';
import MainAboutLayout from '../../Views/MainAboutLayout';

const MainAbout = ({ about_banner, front_admin }) => {
  return <MainAboutLayout about_banner={about_banner} front_admin={front_admin} />;
};
export default React.memo(MainAbout);
