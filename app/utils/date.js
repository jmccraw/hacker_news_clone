function getLocaleTime( date ) {
  return new Date( date ).toLocaleTimeString();
}

function getLocaleString( date ) {
  return new Date( date ).toLocaleDateString();
}

export function getFormattedDate( timestamp ) {
  const milliseconds = timestamp * 1000;

  return `${getLocaleString( milliseconds )}, ${getLocaleTime( milliseconds )}`;
}