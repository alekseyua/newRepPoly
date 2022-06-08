import React, {
  useEffect,
  useState
} from 'react';
import {
  change
} from '../../images';
import PersonalPageViews from '../../Views/PersonalPageViews';
import {
  Formik
} from 'formik';
import api from '../../api';
import {
  useHistory
} from 'react-router-dom';
import {
  useStoreon
} from 'storeon/react';
import CheckBox from '../../Views/CheckBox';
import {
  checkLocalStorage
} from '../../utils';
import introJs from 'intro.js';


const SidebarPersonalPage = ({
  create_shop,
  is_has_shop,
  cabinet_menu,
  cabinet_site_menu,
  username,
  role,
  setModalStates,
  currentCurrcensies,
  shop,
}) => {
  const {
    stateValuePoly,
    dispatch
  } = useStoreon('stateValuePoly');
  const history = useHistory();
  const [valueIn, setValueIn] = useState(null);
  const [stateTour, setStateTour] = useState(false);

  const changeValue = (e) => {
    setValueIn(e.target.value)
  }
  const onHandleChangeTour = (e) => {
    setStateTour(prev => !prev)
    localStorage.setItem('tour', !stateTour)

  }

  useEffect(() => {
    if (checkLocalStorage('tour')) {
      setStateTour(localStorage.getItem('tour'))
    }
  }, [])

  return ( <
    PersonalPageViews.Container >
    <
    PersonalPageViews.UserRoutingPanel username = {
      username
    }
    cabinet_menu = {
      cabinet_menu
    }
    role = {
      role
    }
    setModalStates = {
      setModalStates
    }
    /> {
      !is_has_shop ? ( <
        PersonalPageViews.CreateStore className = {
          'desktop'
        }
        role = {
          role
        }
        create_shop = {
          'motivacionnaya-strannica-im'
        }
        />
      ) : ( <
        PersonalPageViews.StoreRoutingPanel shop = {
          shop
        }
        cabinet_site_menu = {
          cabinet_site_menu
        }
        />
      )
    } 
    </PersonalPageViews.Container>
  );
};

export default React.memo(SidebarPersonalPage);
