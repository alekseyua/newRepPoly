import React, { useState, useEffect } from 'react';
import { GxRow } from '@garpix/garpix-web-components-react';
import AuthorizationAndRegViews from '../../Views/AuthorizationAndRegViews';
import RegistrationFormFirst from './RegistrationFormFirst';
import RegistrationFormBaseInfo from './RegistrationFormBaseInfo';
import SocialMediaCompanyData from './SocialMediaCompanyData';
import ModalContentViews from '../../Views/ModalContentViews';
import ModalPreviewFile from '../../Views/ModalContentViews/ModalPreviewFile';
import { ROLE } from '../../const';
import { withRouter } from 'react-router-dom';
import { serializeDataRegistration} from '../../utils/serializers';
import api from '../../api';
import Grid from '../../Views/Grid';
import Coll from '../../Views/Coll';
import Text from '../Text';
import { useStoreon } from 'storeon/react';
import ModalSubmitCode from './ModalSubmitCode';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

const apiUser = api.userApi;
const initialState = {
  step: 0,
  role: ROLE.UNREGISTRED,
  allSteps: 2,
};
const initialValuesFirstStep = {
  lastname: '',
  firstname: '',
  patronymic: '',
  username: '',
  iAgreeDataProcessing: true,
};
const initialValuesMiddleStep = {
  email: '',
  phone: '',
  password: '',
  whereDidYouHearAboutService: '',
  otherWhereDidHearAbout: '',
  receiveNewsletters: true,
};
const initialValuesLastStep = {
  companyName: '',
  inn: '',
  vk: '',
  instagram: '',
  facebook: '',
};
const initialValues = {
  lastname: '',
  firstname: '',
  patronymic: '',
  username: '',
  iAgreeDataProcessing: true,
  email: '',
  phone: '',
  password: '',
  whereDidYouHearAboutService: '',
  otherWhereDidHearAbout: '',
  receiveNewsletters: false,
  companyName: '',
  inn: '',
  vk: '',
  instagram: '',
  other: '',
};

const Registration = ({ history, site_configuration, setModalStates }) => {
  console.log('history:', history)
  const { page_type_auth, page_type_catalog } = site_configuration;
  const [serverError, setServerError] = useState([]);
  const [state, setState] = useState(initialState);
  const [values, setValues] = useState(initialValues);
  const {dispatch} = useStoreon();
  const [key, setKey] = useState("");

  const registration = (newValues, setFieldError, step) => {
    let params = serializeDataRegistration(newValues, state.role);
    //! нужно сделать попап для ключа
    apiUser
      .registration(params)
      .then((res) => {
        openModalFinallyRegistration(true, newValues);
      })
      .catch((err) => {
        if (err.response) {
          const data = err.response.data;
          let error = false;
          for (const key in data) {
            const element = Array.isArray(data[key]) ? data[key][0] : data[key];
            if (step === 1) {
              if (initialValuesFirstStep.hasOwnProperty(key)) {
                setFieldError(key, element);
                error = true;
              }
            } else if (step === 2) {
              if (initialValuesMiddleStep.hasOwnProperty(key)) {
                setFieldError(key, element);
                error = true;
              }
            } else {
              setFieldError(key, element);
              error = true;
              openModalFinallyRegistration(false);
            }
          }
          if (!error && step !== state.allSteps) setNextStep();
        }
      });
  };

  const nextStepOrSubmitRegData = (newValues, setFieldError) => {
    const { role, step, allSteps } = state;
    if (step >= 0) {
      registration(newValues, setFieldError, step);
    } else {
      setNextStep();
    }
  };

  const onSaveFormData = (data, callbacks = {}) => {
    const { setFieldError = () => {} } = callbacks;
    setValues(data);
    nextStepOrSubmitRegData(data, setFieldError);
  };

  const setNextStep = () => {
    setState({
      ...state,
      step: step + 1,
    });
  };

  const setPrevStep = () => {
    setState({
      ...state,
      step: step - 1,
    });
  };
  const closeModal = (success, userValues = null) => {
    setModalStates({
      content: null,
      show: false,
    });
    if (success) {
      console.log('userValues',userValues)
      apiUser
        // .login(
        //   {
        //     phone: userValues.phone,
        //     password: userValues.password,
        //   },
        //   false,
        // )
        .loginByUsername(
          {
            username: userValues.username,
            password: userValues.password,
          },
          //userValues.remember,
        )
        .then(res => {
          if (role === ROLE.RETAIL){
            openModalKeyRegistration();
          }else{
            window.location.href = page_type_catalog;
          }
        })
        .catch((err) => {
          if (err.response) {
            const data = err.response.data;
            let error = false;
            for (const key in data) {
              const element = Array.isArray(data[key]) ? data[key][0] : data[key];
              setFieldError(key, element);
              error = true;
              openModalFinallyRegistration(false);
            }
          }
        });
    }
  };
  const openModalKeyRegistration = () => {
    const closeModal = () => { 
      dispatch('modal/update', {
        show: false,
        content: null,
        addClass: false,
      });
      window.location.href = page_type_catalog;
    };
    return  dispatch('modal/update', {
      content: (
        <ModalContentViews.ModalWrapper>
        <ModalContentViews.CloseBtn closeModal={closeModal} />
        <ModalContentViews.CenterPosition>
          <ModalContentViews.ContentBlock>
                <ModalSubmitCode initialValues={initialValues} />
          </ModalContentViews.ContentBlock>
        </ModalContentViews.CenterPosition>
      </ModalContentViews.ModalWrapper>
      ),
      show: true,
      addClass: 'modal-success_error',
    });
  };



  const openModalFinallyRegistration = (data, userValues = null) => {
    console.log({userValues})
    console.log('data в попапе:', data)

    return setModalStates({
      content: (
        <ModalContentViews.ModalWrapper>
          <ModalContentViews.CloseBtn closeModal={() => closeModal(data, userValues)} />
          <ModalContentViews.ContentBlock>
            <ModalContentViews.CenterPosition>
              <ModalContentViews.SuccessOrError
                closeModal={() => closeModal(data, userValues)}
                success={data}
                content={!!data? (
                  <div>
                    Регистрация прошла успешно                  
                  </div>
                  ) : 'Ошибка при регистрации'}
              />
            </ModalContentViews.CenterPosition>
          </ModalContentViews.ContentBlock>
        </ModalContentViews.ModalWrapper>
      ),
      show: true,
      addClass: 'modal-success_error',
    });
  };




      const openModalFeedbackReedFile = (file) => { 
        const closeModal = () => { 
          dispatch('modal/update', {
            show: false,
            content: null,
            addClass: false,
          });
        history.push('catalog');
        };
        const renderPage = (props) => {
            console.log('props:', props)
            return (
                <>
                    {props.canvasLayer.children}
                    <div style={{ userSelect: 'none' }}>{props.textLayer.children}</div>
                    {props.annotationLayer.children}
                </>
            );
        };
    
        dispatch('modal/update', {
          show: true,
          addClass: 'modal-file_views',
          content: (
                  <ModalPreviewFile closeModal={closeModal}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456 /build/pdf.worker.min.js">
                        <div id="pdfviewer">
                          <Viewer 
                            fileUrl={`https://cors-anywhere.herokuapp.com/${file}`}
                            renderPage={renderPage}
                            theme={{
                              theme: 'dark',
                            }}
                            // httpHeaders={{
                            //     key: value,
                            // }}
                            // withCredentials={true}
                          />
                        </div>
                    </Worker>
    
                  </ModalPreviewFile>
            )
        })
      }
    

  useEffect(() => {
    if (role === ROLE.RETAIL) {
      setState({
        ...state,
        allSteps: 2,
      });
    } else {
      setState({
        ...state,
        allSteps: 3,
      });
    }
    setValues(initialValues);
  }, [state.role]);
  const { role, step, allSteps } = state;

  return (
    <Grid>
      <GxRow>
        <Coll sizeLg={6} sizeMd={12} sizeSm={12} sizeXl={6} sizeXs={12}>
          <AuthorizationAndRegViews.LeftSide />
        </Coll>
        <Coll sizeLg={6} sizeMd={12} sizeSm={12} sizeXl={6} sizeXs={12}>
          <AuthorizationAndRegViews.RightSide 
            role={role}
            site_configuration={site_configuration}
            openModalFeedbackReedFile={openModalFeedbackReedFile}
          >
            {step !== 0 ? (
              <AuthorizationAndRegViews.StepsBreadcrumbs
                setPrevStep={setPrevStep}
                step={step}
                allSteps={allSteps}
              />
            ) : (
              <AuthorizationAndRegViews.AuthorizationBlock to={page_type_auth} />
            )}
            <AuthorizationAndRegViews.FormSingnUp role={role} step={step}>
              {{
                0: (
                  <AuthorizationAndRegViews.RegistrationSelectRole
                    state={state}
                    setState={setState}
                  />
                ),
                1: (
                  <RegistrationFormFirst
                    initialValues={values}
                    onSaveFormData={onSaveFormData}
                    setPrevStep={setPrevStep}
                    setNextStep={setNextStep}
                  />
                ),
                2: (
                  <RegistrationFormBaseInfo
                    initialValues={values}
                    serverError={serverError}
                    role={role}
                    onSaveFormData={onSaveFormData}
                    setPrevStep={setPrevStep}
                    setNextStep={setNextStep}
                  />
                ),
                3: (
                  <SocialMediaCompanyData
                    initialValues={values}
                    serverError={serverError}
                    role={role}
                    onSaveFormData={onSaveFormData}
                    setPrevStep={setPrevStep}
                    setNextStep={setNextStep}
                  />
                ),
              }[step] || (
                <div>
                  <Text text={'incorrectFormConfiguration'} />
                </div>
              )}
            </AuthorizationAndRegViews.FormSingnUp>
          </AuthorizationAndRegViews.RightSide>
        </Coll>
      </GxRow>
    </Grid>
  );
};

export default React.memo(withRouter(Registration));
