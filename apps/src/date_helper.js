const convert_unix_date = (unix_date) => {
  return new Date(parseInt(unix_date) * 1000).toDateString();
};

const unix_datetime_add_day = (current, next) => {
  const day_in_seconds = parseInt(next) * 86400;
  const next_date = parseInt(current) + day_in_seconds;
  // console.log(
  //   `current -> ${current} Next date -> ${next_date} -> next -> ${next} day_in_seconds -> ${day_in_seconds}`
  // );
  return next_date;
};

const get_today = () => {
  return Math.round(new Date().getTime() / 1000).toString();
};

export { unix_datetime_add_day };
export { convert_unix_date };
export { get_today };
