import React from 'react';
import Layout from '../Views';
import Breadcrumbs from '../Views/Breadcrumbs';
import Container from '../Views/Container';
import AboutViews from '../Views/AboutViews';
import Modal from '../Views/ModalCreator';
import AboutUs from '../Views/AboutUs';
import style from '../Views/AboutUs/style/style.module.scss';
import {
  aboutbox,
  aboutcheck,
  aboutShopping,
  aboutwoman1,
  aboutwoman2,
  mainAboutImg,

  pic1,
} from '../images';
import Title from '../Views/Title';
 
const AboutPage = (props) => {

  const { breadcrumbs, components, site_configuration } = props;
  const firstSection = components.filter((el) => el.id === 9)[0];
  const platformSection = components.filter((el) => el.id === 10)[0];
  const platformListSection = components.filter((el) => el.id === 11)[0];
  const techSection = components.filter((el) => el.id === 12)[0];
  const cardFeatures = components.filter((el) => el.id === 13)[0];
  const cardFeaturesTwo = components.filter((el) => el.id === 14)[0];
  const footerSection = components.filter((el) => el.id === 15)[0];
  const listPlantformDesc = platformListSection.children.map((el) => {
    return {
      icon: el.image,
      content: el.content,
    };
  });

  console.log('platformSection.children',platformSection.children);
  return (
    <Layout {...props}>
      <Modal.StorControllerModal />
      <Container>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </Container>

      <AboutUs 
        site_configuration={site_configuration}
        title={firstSection.title}
        dangerouslySetInnerHTML={{ __html: firstSection.content }}
        platformSection={platformSection.children}
      />


    </Layout>
  );
};

export default React.memo(AboutPage);
