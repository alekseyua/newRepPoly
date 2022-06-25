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
import { getCookie } from '../../utils';


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
  iAgreeDataProcessing: null,
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
  error: '',
};

const Registration = ({ history, site_configuration, setModalStates }) => {
  const { page_type_auth, page_type_catalog } = site_configuration;
  const [state, setState] = useState(initialState);
  const [values, setValues] = useState(initialValues);
  const {dispatch} = useStoreon();
  const [activeSpinner, setActiveSpinner] = useState('')

  const registration = (newValues, setFieldError, step) => {
    let params = serializeDataRegistration(newValues, state.role);
    //! нужно сделать попап для ключа
    apiUser
      .registration(params)
      .then((res) => {
        const params = {
          path: '/information/juridical',
          data: true,
          userValues: newValues,
          role: role,
          success: true,
          content: 'Регистрация прошла успешно'
      }
        dispatch('finallyRegistration/set',params)
      })
      .catch((err) => {
        setActiveSpinner('')
        if (err.response) {
          const data = err.response.data;
          let error = false;
          let status = true
          for (let key in data) {
            const element = Array.isArray(data[key]) ? data[key][0] : data[key];
            if (step === 1) {
              if (initialValuesFirstStep.hasOwnProperty(key)) {
                setFieldError(key, element);
                status = false
                return error = false
              }
              (key === 'email' || key === 'phone' || key === 'whereDidYouHearAboutService' || key === 'password') && status ? error = true : error = false;
              
            } else if (step === 2) {
              if (values.hasOwnProperty(key)) {
                setFieldError(key, element);
              }
              key === 'error' ? error = true : error = false;
            }else {
                setFieldError(key, element);
                error = true;
            }
          }
          let errMessage = {
            path: '/',
            success: 'Учётная запись добавлена, необходимо подтвердить почту',
            fail : data?.detail,
          };
          //data?.detail? dispatch('warrning/set',errMessage) :null;
          
          if (error && step !== state.allSteps) setNextStep();
        }
      });
  };

  const nextStepOrSubmitRegData = (newValues, setFieldError) => { 
    const { role, step, allSteps } = state;
    if (step >= 0) {
      registration(newValues, setFieldError, step);
    } else {
      setActiveSpinner('')
      setNextStep();
    }
  };

  const onSaveFormData = (data, callbacks = {}) => {
    const { setFieldError = () => {} } = callbacks;
    setValues({
      ...values,
      ...data
    });

    setActiveSpinner('spinner-line');
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
  
  
      const openModalFeedbackReedFile = (file) => { 
        const closeModal = () => { 
          dispatch('modal/update', {
            show: false,
            content: null,
            addClass: false,
          });
        };
        const renderPage = (props) => {
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
                            fileUrl={`${file}`}
                            defaultScale = {'PageWidth'}
                            renderPage={renderPage}
                            theme={{
                              theme: 'dark',
                            }}
                            httpHeaders={{
                              Authorization: `Token ${getCookie('ft_token')}`,
                            }}
                            withCredentials={true}
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
                    activeSpinner={activeSpinner}
                  />
                ),
                2: (
                  <RegistrationFormBaseInfo
                    initialValues={values}
                    role={role}
                    onSaveFormData={onSaveFormData}
                    activeSpinner={activeSpinner}
                  />
                ),
                3: (
                  <SocialMediaCompanyData
                    initialValues={values}
                    role={role}
                    onSaveFormData={onSaveFormData}
                    activeSpinner={activeSpinner}
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
