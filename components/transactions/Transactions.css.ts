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
    backgroundColor: '#FFF',
    height: 'auto',
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
    color: 'red !important'
  },
  selectOptions: {
    width: 300,
  },
  button: {
    backgroundColor: '#004D61',
    width: 30,
    padding: 20,
    margin: 'auto',
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 20
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
    height: 50,
    width: 300
  },
  currencyInput: {
    width: '85%',
    marginBottom: -3,
  },
  cardHeader: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
   
  },
  headerContainer: {
    marginRight: 155
  },
  transactionContent: {
    flexDirection: 'column'
  },
  transactionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textHeaderTransactionInfo: {
    marginTop: 12,
    marginBottom: 16,
  },
  textAmmountTransactionInfo: {
    height: 30,
    marginLeft: -8,
    fontSize: 30,
    fontWeight: 'bold'
  },
  ammountInput: {
    marginTop: 32,
    marginBottom: 32,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
});