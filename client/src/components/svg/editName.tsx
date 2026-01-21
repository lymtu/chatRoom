export default function EditNameSvg({ size = 24 }: { size?: number }) {
  return (
    <span>
      <svg
        className="text-inherit"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="24"
          cy="11"
          r="7"
          fill="none"
          className="stroke-current"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 41C4 32.1634 12.0589 25 22 25"
          className="stroke-current"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M31 42L41 32L37 28L27 38V42H31Z"
          fill="none"
          className="stroke-current"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
