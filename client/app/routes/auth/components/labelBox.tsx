import { useState } from "react";

const LabelBox = ({
  name,
  type,
  content,
  children,
}: {
  name: string;
  type: HTMLInputElement["type"];
  content: string;
  children?: React.ReactNode;
}) => {
  const [isVoid, setIsVoid] = useState<boolean>(true);
  let isShowPwd: boolean = false,
    setIsShowPwd: React.Dispatch<React.SetStateAction<boolean>>;
  if (type == "password") {
    [isShowPwd, setIsShowPwd] = useState<boolean>(false);
  }
  return (
    <label className="relative group">
      <input
        type={type != "password" ? type : isShowPwd ? "text" : "password"}
        name={name}
        onChange={(e) => setIsVoid(e.target.value == "")}
        className="w-64 duration-150 p-2 border-b-2 outline-0 peer focus:border-blue-500"
      />
      <span
        className={
          "pointer-events-none absolute left-2 top-1/2 origin-left -translate-y-1/2 text-gray-400 transition-all duration-150 " +
          (isVoid
            ? "peer-focus:text-blue-500 peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:-translate-x-2"
            : "scale-75 -translate-y-8 -translate-x-2")
        }
      >
        {content}
      </span>

      {type == "password" && (
        <div
          className="hidden group-hover:block absolute right-2 top-1/2 -translate-y-1/2 dark:text-white"
          onMouseEnter={() => setIsShowPwd(true)}
          onMouseLeave={() => setIsShowPwd(false)}
        >
          {isShowPwd ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 36C35.0457 36 44 24 44 24C44 24 35.0457 12 24 12C12.9543 12 4 24 4 24C4 24 12.9543 36 24 36Z"
                fill="none"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <path
                d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z"
                fill="none"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.85786 18C6.23858 21 4 24 4 24C4 24 12.9543 36 24 36C25.3699 36 26.7076 35.8154 28 35.4921M20.0318 12.5C21.3144 12.1816 22.6414 12 24 12C35.0457 12 44 24 44 24C44 24 41.7614 27 38.1421 30"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.3142 20.6211C19.4981 21.5109 19 22.6972 19 23.9998C19 26.7612 21.2386 28.9998 24 28.9998C25.3627 28.9998 26.5981 28.4546 27.5 27.5705"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M42 42L6 6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      )}
      {children}
    </label>
  );
};

export default LabelBox;
