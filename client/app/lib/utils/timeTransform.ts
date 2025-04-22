export default function timeTransform(
  time: string | number,
  isMore: boolean = true
): string {
  let datetime = new Date(time);
  let year = datetime.getFullYear();
  let month = datetime.getMonth();
  let date = datetime.getDate();

  if (!isMore) {
    return (
      year +
      "-" +
      (month + 1 >= 10 ? month + 1 : "0" + (month + 1)) +
      "-" +
      (date + 1 < 10 ? "0" + date : date)
    );
  }

  let hour = datetime.getHours();
  let minute = datetime.getMinutes();
  let second = datetime.getSeconds();

  return (
    year +
    "-" +
    (month + 1 >= 10 ? month + 1 : "0" + (month + 1)) +
    "-" +
    (date + 1 < 10 ? "0" + date : date) +
    " " +
    (hour + 1 < 10 ? "0" + hour : hour) +
    ":" +
    (minute + 1 < 10 ? "0" + minute : minute) +
    ":" +
    (second + 1 < 10 ? "0" + second : second)
  );
}
