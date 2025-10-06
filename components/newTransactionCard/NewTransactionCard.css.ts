import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingBottom: 16,
  },
  separator: {
    backgroundColor: '#FFFFFF',
    margin: 'auto',
  },
  ammount: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#CBCBCB',
    height: 600,
    marginTop: 24,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 16,
    borderColor: 'transparent'
  },
  navbar: {
    zIndex: 1,
  },
  mainContent: {
    width: '80%',
    margin: 'auto',
  },
  ammountDisplay: {
    marginTop: 16,
  },
  select: {
    width: 300,
    height: 45,
    fontSize: 50,
    backgroundColor: 'white',
    color: 'red'
  },
  selectOptions: {
    width: 300,
    
  },
  button: {
    backgroundColor: '#004D61',
    width: 200,
    margin: 'auto',
    marginTop: 16,
    marginBottom: 16,
    height: 80,
    textAlign: 'center'
  },
  ammountInput: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fakeInput: {
    flexDirection: 'row',
    backgroundColor: 'white',
    color: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: '#000',
    borderStyle: 'solid',
    borderWidth: 1,
    height: 60,
    width: 200,
    paddingLeft: 8
  },
  currencyInput: {
    width: '100%',
    marginBottom: -3,
  }
});