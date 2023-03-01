import {useEffect} from 'react';
import {productProps} from '../utils/products';
import events from '../utils/events';

interface useProductsEventEffectProps {
  refreshProduct: () => Promise<void>;
  removeProduct: (p_id: string, querymode: string | null) => void | Promise<void>;
  updateProduct: (p_id: string, productInfo: productProps) => void;
  enabled: boolean;
}

export default function useProductsEventEffect({refreshProduct, removeProduct, updateProduct, enabled}: useProductsEventEffectProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    events.addListener('refreshProduct', refreshProduct);
    events.addListener('removeProduct', removeProduct);
    events.addListener('updateProduct', updateProduct);
    return () => {
      events.removeListener('refreshProduct', refreshProduct);
      events.removeListener('removeProduct', removeProduct);
      events.removeListener('updateProduct', updateProduct);
    };
  }, [refreshProduct, removeProduct, updateProduct, enabled]);
}
