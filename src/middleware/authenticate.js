import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  // Перевіряємо наявність accessToken

  if (!req.cookies.accessToken) {
    next(createHttpError(401, 'Missing access token'));
    return;
  }

  //  Якщо access токен існує, шукаємо сесію

  const session = await Session.findOne({
    accessToken: req.cookies.accessToken,
  });

  // Якщо такої сесії нема, повертаємо помилку

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  // Перевіряємо термін дії access токена

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  // Якщо з токеном все добре і сесія існує, шукаємо користувача

  const user = await User.findById(session.userId);

  // Якщо користувача не знайдено

  if (!user) {
    next(createHttpError(401));
    return;
  }

  // Якщо користувач існує, додаємо його до запиту

  req.user = user;

  // Передаємо управління далі

  next();
};