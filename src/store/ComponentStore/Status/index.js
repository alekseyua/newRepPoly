export const statuStorage = (store) => {
    store.on('@init', () => ({ statuStorage: 0 }));
    store.on('statuStorage/set', ({ statuStorage }, status) => {
    console.log('Storage status:', status)
      return {
        statuStorage: status,
      };
    });
  };