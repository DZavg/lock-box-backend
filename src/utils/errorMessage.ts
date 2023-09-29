export const errorMessage = {
  IsNotEmpty: 'Поле обязательно для заполнения',
  IsString: 'Поле должно быть строкой',
  IsEmail: 'Неверный формат почты',
  ServerError: 'Сервер не отвечает',
  LoginError: 'Почта или пароль неверный',
  UserWithEmailExist: 'Пользователь с таким email уже существует',
  Length: (min, max) => `Поле должно быть от ${min} до ${max} символов`,
};
