import { GxSpinner } from '@garpix/garpix-web-components-react';
import CatalogViews from '../../../Views/CatalogViews'; //'../../Views/CatalogViews';



export const spinner = store => {

    store.on('spinner', ()=>{

        return (
            store.dispatch('modal/update', {
                content: (
                    // <ModalContentViews.ModalWrapper>
                        <CatalogViews.SpinnerWrapperPopup>
                            <h4>Обработка данных</h4>
                           <GxSpinner className="spiner" />
                        </CatalogViews.SpinnerWrapperPopup>
                    // </ModalContentViews.ModalWrapper> 
                ), 
                show: true,
                addClass: '',        
                })
           
        )
    })
}
                        