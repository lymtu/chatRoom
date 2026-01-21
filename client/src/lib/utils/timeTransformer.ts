export const timeTransformer = (
    timeStamp: number,
    format: string = "YYYY-MM-DD HH:mm:ss"
  ) => {
    const date = new Date(timeStamp);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
  
    return format
      .replace("YYYY", year)
      .replace("MM", month)
      .replace("DD", day)
      .replace("HH", hour)
      .replace("mm", minute)
      .replace("ss", second);
  };