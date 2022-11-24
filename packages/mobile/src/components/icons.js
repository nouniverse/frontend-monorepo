import Svg, { Path } from "react-native-svg";

export const Camera = (props) => (
  <Svg width="15" height="15" viewBox="0 0 15 15" fill="none" {...props}>
    <Path
      d="M2 3C1.44772 3 1 3.44772 1 4V11C1 11.5523 1.44772 12 2 12H13C13.5523 12 14 11.5523 14 11V4C14 3.44772 13.5523 3 13 3H2ZM0 4C0 2.89543 0.895431 2 2 2H13C14.1046 2 15 2.89543 15 4V11C15 12.1046 14.1046 13 13 13H2C0.895431 13 0 12.1046 0 11V4ZM2 4.25C2 4.11193 2.11193 4 2.25 4H4.75C4.88807 4 5 4.11193 5 4.25V5.75454C5 5.89261 4.88807 6.00454 4.75 6.00454H2.25C2.11193 6.00454 2 5.89261 2 5.75454V4.25ZM12.101 7.58421C12.101 9.02073 10.9365 10.1853 9.49998 10.1853C8.06346 10.1853 6.89893 9.02073 6.89893 7.58421C6.89893 6.14769 8.06346 4.98315 9.49998 4.98315C10.9365 4.98315 12.101 6.14769 12.101 7.58421ZM13.101 7.58421C13.101 9.57302 11.4888 11.1853 9.49998 11.1853C7.51117 11.1853 5.89893 9.57302 5.89893 7.58421C5.89893 5.5954 7.51117 3.98315 9.49998 3.98315C11.4888 3.98315 13.101 5.5954 13.101 7.58421Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </Svg>
  // <Svg width="64" height="64" viewBox="0 0 64 64" {...props}>
  //   <Path
  //     fillRule="evenodd"
  //     d="M10.02 18v0c-1.11 0-2-.9-2-2 0-1.11.89-2 2-2h8v0c1.1 0 2 .89 2 2 0 1.1-.9 2-2 2Zm14-4h28v0c2.2 0 4 1.79 4 4v28 0c0 2.2-1.8 4-4 4h-40v0c-2.21 0-4-1.8-4-4V22v0c0-1.11.89-2 2-2h10v0c1.1 0 2-.9 2-2v-2 0c-.01-1.11.89-2 2-2 0-.001 0 0 0 0Zm13 30v0c6.07 0 11-4.93 11-11 0-6.08-4.93-11-11-11 -6.08 0-11 4.92-11 11v0c-.01 6.07 4.92 11 10.99 11 0 0 0 0 0 0Zm0-20v0c4.97 0 9 4.02 9 9 0 4.97-4.03 9-9 9 -4.98 0-9-4.03-9-9v0c-.001-4.98 4.02-9 9-9 0 0 0 0 0 0Z"
  //     fill="currentColor"
  //   />
  // </Svg>
);

export const CrossCircle = (props) => (
  <Svg width="24" height="24" viewBox="0 0 14 14" {...props}>
    <Path
      fill="currentColor"
      d="M7.02799 0.333252C3.346 0.333252 0.361328 3.31792 0.361328 6.99992C0.361328 10.6819 3.346 13.6666 7.02799 13.6666C10.71 13.6666 13.6947 10.6819 13.6947 6.99992C13.6947 3.31792 10.7093 0.333252 7.02799 0.333252ZM10.166 9.19525L9.22333 10.1379L7.02799 7.94325L4.83266 10.1379L3.89 9.19525L6.08466 6.99992L3.88933 4.80459L4.832 3.86259L7.02733 6.05792L9.22266 3.86259L10.1653 4.80459L7.97066 6.99992L10.166 9.19525Z"
    />
  </Svg>
);

export const Emoji = (props) => (
  <Svg width="20" height="20" viewBox="0 0 20 20" {...props}>
    <Path
      fill="currentColor"
      fillRule="evenodd"
      d="M2.5 10a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0ZM10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM7.5 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM14 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-6.385 3.766a.75.75 0 1 0-1.425.468C6.796 14.08 8.428 15 10.027 15c1.599 0 3.23-.92 3.838-2.766a.75.75 0 1 0-1.425-.468c-.38 1.155-1.38 1.734-2.413 1.734s-2.032-.58-2.412-1.734Z"
      clipRule="evenodd"
    />
  </Svg>
);

export const Globe = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z"
      fill="currentColor"
    />
  </Svg>
);

export const Lock = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6 22C5.45 22 4.97933 21.8043 4.588 21.413C4.196 21.021 4 20.55 4 20V10C4 9.45 4.196 8.979 4.588 8.587C4.97933 8.19567 5.45 8 6 8H7V6C7 4.61667 7.48767 3.43733 8.463 2.462C9.43767 1.48733 10.6167 1 12 1C13.3833 1 14.5627 1.48733 15.538 2.462C16.5127 3.43733 17 4.61667 17 6V8H18C18.55 8 19.021 8.19567 19.413 8.587C19.8043 8.979 20 9.45 20 10V20C20 20.55 19.8043 21.021 19.413 21.413C19.021 21.8043 18.55 22 18 22H6ZM6 20H18V10H6V20ZM12 17C12.55 17 13.021 16.8043 13.413 16.413C13.8043 16.021 14 15.55 14 15C14 14.45 13.8043 13.979 13.413 13.587C13.021 13.1957 12.55 13 12 13C11.45 13 10.9793 13.1957 10.588 13.587C10.196 13.979 10 14.45 10 15C10 15.55 10.196 16.021 10.588 16.413C10.9793 16.8043 11.45 17 12 17ZM9 8H15V6C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.1667 3 10.4583 3.29167 9.875 3.875C9.29167 4.45833 9 5.16667 9 6V8ZM6 20V10V20Z"
      fill="currentColor"
    />
  </Svg>
);

export const Photo = (props) => (
  <Svg width="32" height="32" viewBox="0 0 32 32" {...props}>
    <Path
      fill="currentColor"
      fillRule="evenodd"
      d="M51.99 51h-40l-.01-.001c-2.21-.01-4-1.8-4-4 0 0 0 0 0 0v-30l0 0c-.01-2.21 1.79-4 4-4h40l-.01 0c2.2-.01 4 1.79 4 4v30l-.001 0c0 2.2-1.8 4-4 4Zm-.01-5.52l0-27.49v0c0-.56-.45-1-1-1h-38 -.01c-.56 0-1 .44-1 1 0 0 0 0 0 0v27.53l-.01-.01c0 .25.2.45.46.45 .14-.01.28-.08.37-.2l4.41-6.28 -.01 0c.23-.34.61-.54 1.02-.54h2.35l5.25-7.47 0-.01c.23-.34.61-.54 1.02-.54h1.45l0-.001c.4-.01.78.19 1.02.53l10.65 15.14 -.01-.01c.14.2.37.32.62.32h.58l0-.001c.42-.01.76-.35.76-.77 -.01-.16-.05-.32-.14-.44l-2.61-3.71 0 0c-.33-.46-.32-1.08.02-1.53l2.34-3.08 0-.01c.23-.32.6-.5.99-.5h1.13l-.01-.001c.39 0 .75.18.99.49l6.32 8.3 -.01-.01c.17.22.49.26.71.09 .12-.1.2-.25.2-.41Zm-11-14.49l-.01-.001c-2.77-.01-5-2.24-5-5 0-2.77 2.23-5 5-5 2.76 0 5 2.23 5 5l0-.01c0 2.76-2.24 5-5 5Z"
      transform="scale(0.5,0.5)"
    />
  </Svg>
);

export const EyeOff = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M22.0828 11.3953C21.2589 9.65954 20.2785 8.24391 19.1414 7.14844L17.9489 8.34094C18.9213 9.27024 19.7684 10.4859 20.5008 12C18.5508 16.0359 15.7828 17.9531 12 17.9531C10.8645 17.9531 9.81869 17.7783 8.86244 17.4286L7.57033 18.7207C8.89845 19.334 10.375 19.6406 12 19.6406C16.5047 19.6406 19.8656 17.2945 22.0828 12.6023C22.172 12.4136 22.2182 12.2075 22.2182 11.9988C22.2182 11.7901 22.172 11.584 22.0828 11.3953ZM20.5929 3.88032L19.5938 2.88C19.5763 2.86257 19.5557 2.84874 19.5329 2.8393C19.5101 2.82987 19.4857 2.82501 19.4611 2.82501C19.4365 2.82501 19.4121 2.82987 19.3893 2.8393C19.3665 2.84874 19.3459 2.86257 19.3285 2.88L16.7651 5.44219C15.3518 4.72032 13.7635 4.35938 12 4.35938C7.49533 4.35938 4.13439 6.70547 1.9172 11.3977C1.82808 11.5864 1.78186 11.7925 1.78186 12.0012C1.78186 12.2099 1.82808 12.416 1.9172 12.6047C2.80298 14.4703 3.86939 15.9657 5.11642 17.0909L2.63626 19.5703C2.60113 19.6055 2.58139 19.6531 2.58139 19.7029C2.58139 19.7526 2.60113 19.8002 2.63626 19.8354L3.63681 20.8359C3.67197 20.8711 3.71964 20.8908 3.76935 20.8908C3.81906 20.8908 3.86673 20.8711 3.90189 20.8359L20.5929 4.14563C20.6103 4.12821 20.6242 4.10754 20.6336 4.08477C20.643 4.06201 20.6479 4.03761 20.6479 4.01297C20.6479 3.98833 20.643 3.96393 20.6336 3.94117C20.6242 3.91841 20.6103 3.89773 20.5929 3.88032ZM3.49923 12C5.45158 7.96407 8.21954 6.04688 12 6.04688C13.2783 6.04688 14.4406 6.26625 15.495 6.71227L13.8474 8.35993C13.067 7.94359 12.1736 7.78907 11.2988 7.91917C10.424 8.04927 9.61413 8.4571 8.98874 9.08248C8.36336 9.70787 7.95553 10.5177 7.82543 11.3925C7.69533 12.2673 7.84985 13.1608 8.26618 13.9411L6.31103 15.8963C5.22892 14.9412 4.29611 13.6472 3.49923 12ZM9.28126 12C9.28167 11.5867 9.37957 11.1794 9.56699 10.811C9.75442 10.4427 10.0261 10.1237 10.3599 9.8801C10.6938 9.63648 11.0804 9.47504 11.4883 9.4089C11.8963 9.34276 12.3141 9.37379 12.7078 9.49946L9.40572 12.8016C9.32295 12.5424 9.28096 12.272 9.28126 12Z"
      fill="currentColor"
    />
    <Path
      d="M11.9062 14.625C11.8251 14.625 11.7452 14.6212 11.666 14.614L10.428 15.8519C11.1726 16.1371 11.9839 16.2005 12.7637 16.0344C13.5435 15.8683 14.2586 15.4799 14.8224 14.9161C15.3862 14.3523 15.7746 13.6373 15.9406 12.8575C16.1067 12.0776 16.0433 11.2664 15.7582 10.5218L14.5202 11.7598C14.5275 11.839 14.5312 11.9189 14.5312 12C14.5314 12.3448 14.4637 12.6862 14.3318 13.0048C14.2 13.3233 14.0066 13.6128 13.7628 13.8566C13.519 14.1004 13.2296 14.2937 12.911 14.4256C12.5924 14.5574 12.251 14.6252 11.9062 14.625Z"
      fill="currentColor"
    />
  </Svg>
);

export const Star = (props) => (
  <Svg width="20" height="20" viewBox="0 0 20 20" {...props}>
    <Path
      d="M4.77321 18.0645C5.14821 18.3457 5.60915 18.252 6.1404 17.8691L10.2029 14.8848L14.2576 17.8691C14.7888 18.252 15.2498 18.3457 15.6248 18.0645C15.992 17.7832 16.0701 17.3223 15.8591 16.7051L14.2576 11.9395L18.3513 9.00195C18.8826 8.62695 19.1013 8.20508 18.9529 7.76758C18.8045 7.33008 18.3904 7.11133 17.7341 7.11914L12.7185 7.1582L11.1873 2.36133C10.9841 1.73633 10.6638 1.40039 10.2029 1.40039C9.73415 1.40039 9.41383 1.73633 9.21071 2.36133L7.68727 7.1582L2.66383 7.11914C2.00758 7.11133 1.59352 7.33008 1.44508 7.75977C1.29665 8.20508 1.52321 8.62695 2.04665 9.00195L6.1404 11.9395L4.53883 16.7051C4.3279 17.3223 4.40602 17.7832 4.77321 18.0645Z"
      fill="currentColor"
    />
  </Svg>
);
