import React, {LegacyRef} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

interface DabadaInputProps extends TextInputProps {
  hasMarginBottom: boolean;
  autoCompleteType?: 'email';
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void | Promise<void>;
}

function DabadaInput({hasMarginBottom, ...rest}: DabadaInputProps, ref: LegacyRef<TextInput> | undefined) {
  return <TextInput style={[styles.input, hasMarginBottom && styles.margin]} ref={ref} {...rest} placeholderTextColor="#95befc" />;
}
const styles = StyleSheet.create({
  input: {
    borderColor: '#bdbdbd',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    paddingBottom: 2,
  },
  margin: {
    marginBottom: 16,
  },
});

export default React.forwardRef(DabadaInput);
