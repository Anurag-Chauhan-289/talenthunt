// import jwt from 'jsonwebtoken';
// import Mock from '../mock';

const JWT_SECRET = 'jwt_secret_key';
const JWT_VALIDITY = '7 days';

const userList = [
  {
    id: 1,
    role: 'SA',
    name: 'Jason Alexander',
    username: 'jason_alexander',
    email: 'jason@ui-lib.com',
    avatar: '/assets/images/face-6.jpg',
    age: 25,
    adminUserId: '',
    isActive: false,
    roleId: '',
    whenEntered: '',
    whenModified: ''
  },
  {
    id: 3,
    role: 'SA',
    name: 'Ajinkya Bhaskar',
    username: 'ajinkya_bhaskar',
    email: 'ajinkya.bhaskar@ifi.tech',
    avatar: '/assets/images/face-6.jpg',
    age: 25,
    adminUserId: '',
    isActive: true,
    roleId: '',
    whenEntered: '',
    whenModified: ''
  },
];

// FOLLOWING CODES ARE MOCK SERVER IMPLEMENTATION
// YOU NEED TO BUILD YOUR OWN SERVER
// IF YOU NEED HELP ABOUT SERVER SIDE IMPLEMENTATION
// CONTACT US AT support@ui-lib.com

// Mock.onPost('/api/auth/login').reply(async (config) => {
//   try {
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     const { email } = JSON.parse(config.data);
//     const user = userList.find((u) => u.email === email);

//     if (!user) {
//       return [400, { message: 'Invalid email or password' }];
//     }
//     // const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
//     //   expiresIn: JWT_VALIDITY,
//     // });
//     const accessToken = "eyJleHAiOjE2NzE3MTc3NjcsIm5iZiI6MTY3MTcxNDE2NywidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly90YWxlbnRodW50YjJjLmIyY2xvZ2luLmNvbS9mNjQzMjM1Ny05ZTc2LTRmNzYtYmUxMS01MGQ3ZGUwZjQ4MGUvdjIuMC8iLCJzdWIiOiJiNGUwNzkyNy04MDg4LTQ5M2UtYTYwZC05NzIyNjE3YzAwYjAiLCJhdWQiOiJlZjlmNzJmYi0wZDJjLTRkYzQtYTc4Yy0wY2Y4ZGMyN2YzMTgiLCJub25jZSI6IjA1YzQ5NDRlLTM4YmEtNGEyNC1hMWE4LWVmMDMwYWE5NjE4MyIsImlhdCI6MTY3MTcxNDE2NywiYXV0aF90aW1lIjoxNjcxNzE0MTYwLCJlbWFpbHMiOlsiYWppbmt5YS5iaGFza2FyQGlmaS50ZWNoIl0sInRmcCI6IkIyQ18xX1RhbGVudEh1bnQifQ==";

//     return [
//       200,
//       {
//         accessToken,
//         user: {
//           id: user.id,
//           avatar: user.avatar,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//         },
//       },
//     ];
//   } catch (err) {
//     console.error(err);
//     return [500, { message: 'Internal server error' }];
//   }
// });

// Mock.onPost('/api/auth/register').reply((config) => {
//   try {
//     const { email, username } = JSON.parse(config.data);
//     const user = userList.find((u) => u.email === email);

//     if (user) {
//       return [400, { message: 'User already exists!' }];
//     }
//     const newUser = {
//       id: 2,
//       role: 'GUEST',
//       name: '',
//       username: username,
//       email: email,
//       avatar: '/assets/images/face-6.jpg',
//       age: 25,
//     };
//     userList.push(newUser);

//     const accessToken = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
//       expiresIn: JWT_VALIDITY,
//     });

//     return [
//       200,
//       {
//         accessToken,
//         user: {
//           id: newUser.id,
//           avatar: newUser.avatar,
//           email: newUser.email,
//           name: newUser.name,
//           username: newUser.username,
//           role: newUser.role,
//         },
//       },
//     ];
//   } catch (err) {
//     console.error(err);
//     return [500, { message: 'Internal server error' }];
//   }
// });

// Mock.onGet('/api/auth/profile').reply((config) => {
//   try {
//     const { Authorization } = config.headers;
//     if (!Authorization) {
//       return [401, { message: 'Invalid Authorization token' }];
//     }

//     const accessToken = Authorization.split(' ')[1];
//     const { userId } = jwt.verify(accessToken, JWT_SECRET);
//     const user = userList.find((u) => u.id === userId);

//     if (!user) {
//       return [401, { message: 'Invalid authorization token' }];
//     }

//     return [
//       200,
//       {
//         user: {
//           id: user.id,
//           avatar: user.avatar,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//         },
//       },
//     ];
//   } catch (err) {
//     console.error(err);
//     return [500, { message: 'Internal server error' }];
//   }
// });
