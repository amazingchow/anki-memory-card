import Cookies from 'js-cookie';

const TOKEN_COOKIE = 'token';
const USER_ID_COOKIE = 'user_id';
const EXPIRES_DAYS = 7;

// 存储用户Token到cookies
export const setToken = (token: string) => {
  Cookies.set(TOKEN_COOKIE, token, {
    expires: EXPIRES_DAYS, // 7天后过期
    secure: process.env.NODE_ENV === 'production', // 在生产环境中只通过HTTPS发送
    sameSite: 'strict' // 防止CSRF攻击
  });
};

// 从cookies获取用户Token
export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_COOKIE);
};

// 从cookies删除用户Token
export const removeToken = () => {
  Cookies.remove(TOKEN_COOKIE);
};

// 存储用户ID到cookies
export const setUserId = (userId: string) => {
  Cookies.set(USER_ID_COOKIE, userId, {
    expires: EXPIRES_DAYS, // 7天后过期
    secure: process.env.NODE_ENV === 'production', // 在生产环境中只通过HTTPS发送
    sameSite: 'strict' // 防止CSRF攻击
  });
};

// 从cookies获取用户ID
export const getUserId = (): string | undefined => {
  return Cookies.get(USER_ID_COOKIE);
};

// 从cookies删除用户ID
export const removeUserId = () => {
  Cookies.remove(USER_ID_COOKIE);
}; 

// 删除所有cookies
export const removeAllCookies = () => {
  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(USER_ID_COOKIE);
};
