export function convertDuration(duration : number){
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const segunds = duration % 60;

  const timeString = [hours, minutes, segunds]
  .map(unit => String(unit).padStart(2, '0'))
  .join(':')

  return timeString;
}