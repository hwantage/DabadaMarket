import React, {LegacyRef} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

interface type_BorderedInput extends TextInputProps {
  hasMarginBottom: boolean;
  autoCompleteType?: 'email';
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void | Promise<void>;
}

function DabadaInput({hasMarginBottom, ...rest}: type_BorderedInput, ref: LegacyRef<TextInput> | undefined) {
  return <TextInput style={[styles.input, hasMarginBottom && styles.margin]} ref={ref} {...rest} />;
}
const styles = StyleSheet.create({
  input: {
    borderColor: '#bdbdbd',
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 4,
    height: 48,
    backgroundColor: 'white',
  },
  margin: {
    marginBottom: 16,
  },
});

export default React.forwardRef(DabadaInput);
