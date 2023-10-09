export const getError = (error) => {
 return error !== undefined && error.message ? error.message : "Error Occured";
};


