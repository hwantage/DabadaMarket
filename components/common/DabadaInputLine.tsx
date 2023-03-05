import React, {LegacyRef} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

interface DabadaInputLineProps extends TextInputProps {
  hasMarginBottom: boolean;
  autoCompleteType?: 'email';
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void | Promise<void>;
}

function DabadaInputLine({hasMarginBottom, ...rest}: DabadaInputLineProps, ref: LegacyRef<TextInput> | undefined) {
  return <TextInput style={[styles.input, hasMarginBottom && styles.margin]} ref={ref} {...rest} placeholderTextColor="#95befc" />;
}
const styles = StyleSheet.create({
  input: {
    color: '#000000',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    borderRadius: 4,
    textAlignVertical: 'top',
    paddingBottom: 2,
    height: 44,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#dfdfdf',
  },

  margin: {
    marginBottom: 12,
  },
});

export default React.forwardRef(DabadaInputLine);
