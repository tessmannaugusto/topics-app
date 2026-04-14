import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  notes: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  actions: {
    marginTop: 32,
    marginBottom: 64,
  },
  spacer: {
    height: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  audioSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
});
