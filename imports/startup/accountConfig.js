import { Accounts } from 'meteor/accounts-base';
import { ADMIN, USER } from '../utils/constants';

// 유저가 등록될때 추가되는 필드를 조작
// user가 등록될 때 user.profile.role 필드가 자동으로 등록됨
// 이메일중복을 걸러내고있으니 어드민이메일이 또 중복될 걱정은 안해도됌
Accounts.onCreateUser((options, user) => {
  if (options.email === 'admin@admin.com') {
    user.profile = options.profile ? options.profile : {};
    user.profile.role = ADMIN;
  } else {
    user.profile = options.profile ? options.profile : {};
    user.profile.role = USER;
  }

  return user;
});
