import React from 'react';

const Settings = (props) => {


    const defaultComponent = (component) => {
        switch (component){
            case 'TradingPlatformLayout':
                return "https://back.ftownpl.com/admin/content/mainpage/";
            case 'MainCategoriesLayout' :
                return "https://back.ftownpl.com/admin/content/banner/";
            case 'ProductsInStock' :
                return "https://back.ftownpl.com/admin/content/banner/";
            case 'CooperationLayout' :
                return "https://back.ftownpl.com/admin/content/banner/";
            case 'MainNewsLayout' :
                return "https://back.ftownpl.com/admin/content/news/";
            case 'MainAboutLayout' :
                return "https://back.ftownpl.com/admin/content/banner/6/change/";                
            case 'MainReviewsLayout' :
                return "https://back.ftownpl.com/admin/content/review/";
            case 'BottomFooter-offer' :
                return "https://back.ftownpl.com/admin/config/siteconfiguration/";
            case 'InformationJuridical' :
                return "https://back.ftownpl.com/admin/config/siteconfiguration/";
               
            default: ''
        }
    }



    const goToSetting = (event, component) => {
        event.preventDefault();
        const windowFeatures = "left=100,top=100,width=520,height=720";
        window.open( defaultComponent(component), "target='_blank'", windowFeatures)
    }

    return (
        <>
        <div
            className='setting-go-to'
            onClick={(event)=>goToSetting(event, props.nameComponent)}
         >📝</div>
        </>
    )
} 

export default Settings;
