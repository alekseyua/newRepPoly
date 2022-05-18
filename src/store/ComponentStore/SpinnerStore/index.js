import { GxSpinner } from '@garpix/garpix-web-components-react';
import { Spinner } from '../../../components/Spinner';
import CatalogViews from '../../../Views/CatalogViews'; //'../../Views/CatalogViews';
import ModalContentViews from '../../../Views/ModalContentViews';



export const spinner = store => {

    store.on('spinner', ()=>{
 
        return (
            store.dispatch('modal/update', {
                content: (
                    <>
                      <Spinner />

                     {/*    <CatalogViews.SpinnerWrapperPopup> */}
                            {/* <h4>Обработка данных</h4>
                           <GxSpinner 
                           className="spiner" 

                           //     "size": 'small' | 'medium' | 'large';
                           /> */}
                         {/* </CatalogViews.SpinnerWrapperPopup>*/}
                    </>
                ), 
                show: true,
                addClass: '',        
                })
           
        )
    })
}
                        