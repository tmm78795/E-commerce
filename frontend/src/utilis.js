export const getError = (error) => {
  if (error !== undefined ) {return error.message ? error.message : 'Error Occured'}
  else {
    return 'Error Occured';
  }
};


