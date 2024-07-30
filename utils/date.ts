export const mongoDateToString = (date: Date) => {

  // convert mongoDB date to string
  return date.toString().split('T')[0] + ' ' + date.toString().split('T')[1].split('.')[0];
  

  }