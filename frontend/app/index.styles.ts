import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  topicItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  topicDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  audioControls: {
    marginLeft: 12,
    minWidth: 70,
    alignItems: 'flex-end',
  },
  audioButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  generateButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
  buttonContainer: {
    marginTop: 16,
    paddingBottom: 8,
  },
});
