import {useEffect} from 'react';
import {informationProps} from '../utils/informations';
import events from '../utils/events';

interface useInformationEventEffectProps {
  refreshInformation: () => Promise<void>;
  removeInformation: (i_id: string, querymode: string | null) => void | Promise<void>;
  updateInformation: (i_id: string, informationInfo: informationProps) => void;
  enabled: boolean;
}

export default function useInformationEventEffect({refreshInformation, removeInformation, updateInformation, enabled}: useInformationEventEffectProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    events.addListener('refreshInformation', refreshInformation);
    events.addListener('removeInformation', removeInformation);
    events.addListener('updateInformation', updateInformation);
    return () => {
      events.removeListener('refreshInformation', refreshInformation);
      events.removeListener('removeInformation', removeInformation);
      events.removeListener('updateInformation', updateInformation);
    };
  }, [refreshInformation, removeInformation, updateInformation, enabled]);
}
