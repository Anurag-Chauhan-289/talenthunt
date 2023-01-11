import { useEffect, useReducer } from 'react';
import useAuth from 'app/hooks/useAuth';
// import { flat } from 'app/utils/utils';
import { Navigate, useLocation } from 'react-router-dom';
// import { AuthenticatedTemplate } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
// import { EventType } from '@azure/msal-browser';
// import axios from 'axios.js'
// import { loginRequest, b2cPolicies, protectedResources } from '../../authConfig';


// import AllPages from '../routes';

// const userHasPermission = (pathname, user, routes) => {
//   if (!user) {
//     return false;
//   }
//   const matched = routes.find((r) => r.path === pathname);

//   const authenticated =
//     matched && matched.auth && matched.auth.length ? matched.auth.includes(user.role) : true;
//   return authenticated;
// };


// const setSession = (accessToken) => {
//   if (accessToken) {
//     localStorage.setItem('accessToken', accessToken)
//     axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
//   } else {
//     localStorage.removeItem('accessToken')
//     delete axios.defaults.headers.common.Authorization
//   }
// }

// const initialState = {
//   isAuthenticated: false,
//   isInitialised: false,
//   user: null,
// }


// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'INIT': {
//       const { isAuthenticated, user } = action.payload

//       return {
//         ...state,
//         isAuthenticated,
//         isInitialised: true,
//         user,
//       }
//     }
//     case 'LOGIN': {
//       const { user } = action.payload

//       return {
//         ...state,
//         isAuthenticated: true,
//         user,
//       }
//     }
//     case 'LOGOUT': {
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null,
//       }
//     }
//     case 'REGISTER': {
//       const { user } = action.payload

//       return {
//         ...state,
//         isAuthenticated: true,
//         user,
//       }
//     }
//     default: {
//       return { ...state }
//     }
//   }
// }

const AuthGuard = ({ children }) => {
  let {
    isAuthenticated,
    // user
  } = useAuth();
  const { pathname } = useLocation();
  // const [state, dispatch] = useReducer(reducer, initialState)
  //   const routes = flat(AllPages);

  //   const hasPermission = userHasPermission(pathname, user, routes);
  //   let authenticated = isAuthenticated && hasPermission;

  // // IF YOU NEED ROLE BASED AUTHENTICATION,
  // // UNCOMMENT ABOVE LINES
  // // AND COMMENT OUT BELOW authenticated VARIABLE

  let authenticated = isAuthenticated;
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  // debugger


  // useEffect(() => {
  //   const callbackId = instance.addEventCallback((event) => {
  //     if (
  //       (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
  //       event.payload.account
  //     ) {
  //       debugger
  //       console.log("Instance ==> ", instance)
  //       let activeAccount = instance.getActiveAccount();
  //       let userData = {
  //         id: activeAccount.localAccountId,
  //         role: 'SA',
  //         name: 'Ajinkya Bhaskar',
  //         username: activeAccount.name,
  //         email: activeAccount.username,
  //         avatar: '/assets/images/face-6.jpg',
  //         age: 25,
  //       };

  //       if (activeAccount) {
  //         dispatch({
  //           type: 'LOGIN',
  //           payload: {
  //             user: userData,
  //           },
  //         })

  //         let idTokenClaims = activeAccount.idTokenClaims;
  //         let encodedString = window.btoa(JSON.stringify(idTokenClaims));
  //         setSession(encodedString);

  //         dispatch({
  //           type: 'INIT',
  //           payload: {
  //             isAuthenticated: true,
  //             user: userData,
  //           },
  //         })

  //       }

  //       if (event.payload.idTokenClaims['tfp'] === b2cPolicies.names.forgotPassword) {
  //         let signUpSignInFlowRequest = {
  //           authority: b2cPolicies.authorities.signUpSignIn.authority,
  //           scopes: [
  //             ...protectedResources.apiTodoList.scopes.read,
  //             ...protectedResources.apiTodoList.scopes.write,
  //           ],
  //         };
  //         instance.loginRedirect(signUpSignInFlowRequest);
  //       }
  //     }

  //     if (event.eventType === EventType.LOGIN_FAILURE) {
  //       // Check for forgot password error
  //       if (event.error && event.error.errorMessage.includes('AADB2C90118')) {
  //         const resetPasswordRequest = {
  //           authority: b2cPolicies.authorities.forgotPassword.authority,
  //           scopes: [],
  //         };
  //         instance.loginRedirect(resetPasswordRequest);
  //       }
  //     }
  //   });

  //   return () => {
  //     if (callbackId) {
  //       instance.removeEventCallback(callbackId);
  //     }
  //   };
  //   // eslint-disable-next-line
  // }, [instance]);





  return (
    <>
      {authenticated ? (
        children
      ) : (
        // <Navigate replace to="/session/signin" state={{ from: pathname }} />
        <Navigate replace to="/session/signin" state={{ from: pathname }} />
      )}
      {/* <AuthenticatedTemplate>
        {
          activeAccount ?
            // <Container>
            //   <IdTokenData idTokenClaims={activeAccount.idTokenClaims} />
            // </Container>
            children
            :
            <Navigate replace to="/session/signin" state={{ from: pathname }} />
        }
      </AuthenticatedTemplate> */}
    </>
  );
};

export default AuthGuard;
