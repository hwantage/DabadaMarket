import {useEffect} from 'react';
import {productProps} from '../utils/products';
import events from '../utils/events';

interface useProductsEventEffectProps {
  refresh: () => Promise<void>;
  removeProduct: (p_id: string, querymode: string | null) => void | Promise<void>;
  updateProduct: (p_id: string, productInfo: productProps) => void;
  enabled: boolean;
}

export default function useProductsEventEffect({refresh, removeProduct, updateProduct, enabled}: useProductsEventEffectProps) {
  useEffect(() => {
    console.log('useeffect of useProductsEventEffect');
    if (!enabled) {
      return;
    }
    events.addListener('refresh', refresh);
    events.addListener('removeProduct', removeProduct);
    events.addListener('updateProduct', updateProduct);
    return () => {
      events.removeListener('refresh', refresh);
      events.removeListener('removeProduct', removeProduct);
      events.removeListener('updateProduct', updateProduct);
    };
  }, [refresh, removeProduct, updateProduct, enabled]);
}
