import React from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import style from './socialLinks.module.scss';
import { GxIcon } from '@garpix/garpix-web-components-react';
import { v4 } from 'uuid';
import { fbIcon, igIcon, vkIcon, waIcon, vIcon, fbmIcon } from '../../images';

const SocialLinks = ({site_configuration}) => {
  const social_links = [
    {
      icon: fbIcon,
      url: site_configuration?.fb_link ? site_configuration.fb_link : '#',
    },
    {
      icon: igIcon,
      url: site_configuration?.insta_link ? site_configuration.insta_link : '#',
    },
    {
      icon: vkIcon,
      url: site_configuration?.vk_link ? site_configuration.vk_link : '#',
    },
    {
      icon: waIcon,
      url: site_configuration?.whatsapp_link ? site_configuration.whatsapp_link : '#',
    },
    {
      icon: vIcon,
      url: site_configuration?.viber_link ? site_configuration.viber_link : '#',
    },
    {
      icon: fbmIcon,
      url: site_configuration?.twitter_link ? site_configuration.twitter_link : '#',
    },
  ];
  const redirectURL = (path)=> window.location.href = (path) 
  return (
    <div className={style['social-links']}>
      <nav className={style['social-links__list']}>
        {social_links.map((el, key) => {
          return (
            <li key={v4()} className={style['social-links__list-item']}>
              <div onClick={()=>redirectURL(el.url)}>
                <GxIcon className={style['social-links__list-item-icon']} src={el.icon} alt="" />
              </div>
            </li>
          );
        })}
      </nav>
    </div>
  );
};

export default React.memo(SocialLinks);
 