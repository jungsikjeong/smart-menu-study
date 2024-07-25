import { Accounts } from 'meteor/accounts-base';

// fixtures파일은 서버가 시작할 때 설정값들을 db에입력하는 역할을 함
// 즉, 저장된 유저가 없으면 자동으로 어드민 계정을 만들어줌!

Meteor.setTimeout(() => {
  const userCount = Meteor.users.find().count();
  if (userCount === 0) {
    // 사용자 등록
    console.log('user create');

    const userValues = {
      email: 'admin@admin.com',
      // password: process.env.ADMIN_PASSWORD,
      password: '1234',
    };

    Accounts.createUser(userValues);
  } else {
    // 이미 등록된 사용자 있음, 상태기록
    console.log(`user count: ${userCount}`);
  }
}, 3000);
