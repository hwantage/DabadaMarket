import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import ChattingListScreen from './ChattingListScreen';

const Stack = createNativeStackNavigator();

function AppStackChatting() {
  const {t} = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChattingListScreen"
        component={ChattingListScreen}
        options={{
          title: t('title.chatting', '채팅'),
        }}
      />
    </Stack.Navigator>
  );
}

export default AppStackChatting;
