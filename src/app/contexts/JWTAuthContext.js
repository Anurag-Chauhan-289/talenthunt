import React, { createContext, useEffect, useReducer } from 'react'
import axios from 'axios.js'
import { MatxLoading } from 'app/components'
import { EventType } from '@azure/msal-browser';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest, b2cPolicies, protectedResources } from '../../authConfig';
import { BASE_URL, endPointName } from 'apis/apiList';
import { CallAPI } from 'apis/callAPI';

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}

const isValidToken = (accessToken) => {
    // debugger
    if (!accessToken) {
        return false
    }

    const decodedToken = JSON.parse(window.atob(accessToken));
    const currentTime = Date.now() / 1000
    return decodedToken.exp > currentTime
}

const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
        localStorage.removeItem('accessToken')
        delete axios.defaults.headers.common.Authorization
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated, user } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'REGISTER': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => { },
    register: () => Promise.resolve(),
})

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { instance, inProgress, accounts } = useMsal();

    const login = async (email, password) => {
        // debugger
        // const response = await axios.post('/api/auth/login', {
        //     email,
        //     password,
        // })
        // // instance.loginRedirect(loginRequest).catch((error) => console.log(error));
        // console.log("instance ==> ", instance);
        // instance.logoutRedirect();
        const res = await axios.post('https://talenthunt-dev.azurewebsites.net/api/UserData/Authorize/' + email, "")
        setTimeout(() => { }, 1000)
        // const { accessToken, user } = response.data
        const { data } = res
        console.log("Response ==> ", res)
        let userData = {
            id: '1',
            role: 'SA',
            name: data.userName,
            userName: data.userName,
            email: data.emailId,
            avatar: '/assets/images/face-6.jpg',
            age: 25,
            adminUserId: data.adminUserId,
            isActive: data.isActive,
            roleId: data.roleId,
            whenEntered: data.whenEntered,
            whenModified: data.whenModified
        };

        setSession("eyJleHAiOjE2NzE3MTc3NjcsIm5iZiI6MTY3MTcxNDE2NywidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly90YWxlbnRodW50YjJjLmIyY2xvZ2luLmNvbS9mNjQzMjM1Ny05ZTc2LTRmNzYtYmUxMS01MGQ3ZGUwZjQ4MGUvdjIuMC8iLCJzdWIiOiJiNGUwNzkyNy04MDg4LTQ5M2UtYTYwZC05NzIyNjE3YzAwYjAiLCJhdWQiOiJlZjlmNzJmYi0wZDJjLTRkYzQtYTc4Yy0wY2Y4ZGMyN2YzMTgiLCJub25jZSI6IjA1YzQ5NDRlLTM4YmEtNGEyNC1hMWE4LWVmMDMwYWE5NjE4MyIsImlhdCI6MTY3MTcxNDE2NywiYXV0aF90aW1lIjoxNjcxNzE0MTYwLCJlbWFpbHMiOlsiYWppbmt5YS5iaGFza2FyQGlmaS50ZWNoIl0sInRmcCI6IkIyQ18xX1RhbGVudEh1bnQifQ==");
        dispatch({
            type: 'LOGIN',
            payload: {
                user: userData,
            },
        })
    }

    const register = async (email, username, password) => {
        // const response = await axios.post('/api/auth/register', {
        //     email,
        //     username,
        //     password,
        // })

        // const { accessToken, user } = response.data

        // setSession(accessToken)

        // dispatch({
        //     type: 'REGISTER',
        //     payload: {
        //         user,
        //     },
        // })
    }

    const logout = () => {
        setSession(null)
        // instance.logoutRedirect();
        instance.logout();
        dispatch({ type: 'LOGOUT' })
        // instance.loginRedirect(loginRequest).catch((error) => console.log(error));
        sessionStorage.clear();
    }

    // useEffect(() => {
    //     const callbackId = instance.addEventCallback(async (event) => {
    //         if (
    //             (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
    //             event.payload.account
    //         ) {
    //             /**
    //              * For the purpose of setting an active account for UI update, we want to consider only the auth
    //              * response resulting from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy
    //              * policies may use "acr" instead of "tfp"). To learn more about B2C tokens, visit:
    //              * https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
    //              */
    //             debugger
    //             console.log("Instance ==> ", instance)
    //             let activeAccount = instance.getActiveAccount();


    //             if (activeAccount) {

    //                 try {

    //                     let userData = {
    //                         id: activeAccount.localAccountId,
    //                         role: 'SA',
    //                         name: activeAccount.name,
    //                         userName: activeAccount.username,
    //                         email: activeAccount.username,
    //                         avatar: '/assets/images/face-6.jpg',
    //                         age: 25,
    //                         adminUserId: '',
    //                         isActive: true,
    //                         roleId: '',
    //                         whenEntered: '',
    //                         whenModified: ''
    //                     };

    //                     // call api 
    //                     // https://talenthunt-dev.azurewebsites.net/api/UserData/Authorize/ajinkya.bhaskar@ifi.tech

    //                     let idTokenClaims = activeAccount.idTokenClaims;
    //                     let encodedString = window.btoa(JSON.stringify(idTokenClaims));
    //                     setSession(encodedString);

    //                     const response = await axios.post('https://talenthunt-dev.azurewebsites.net/api/UserData/Authorize/' + activeAccount.username, "")
    //                     const { data } = response
    //                     console.log("Response ==> ", response)
    //                     userData.name = data.userName;
    //                     userData.adminUserId = data.adminUserId;
    //                     userData.email = data.emailId;
    //                     userData.isActive = data.isActive;
    //                     userData.roleId = data.roleId;
    //                     userData.whenEntered = data.whenEntered;
    //                     userData.whenModified = data.whenModified;

    //                     dispatch({
    //                         type: 'LOGIN',
    //                         payload: {
    //                             user: userData,
    //                         },
    //                     })

    //                     dispatch({
    //                         type: 'INIT',
    //                         payload: {
    //                             isAuthenticated: true,
    //                             user: userData,
    //                         },
    //                     })

    //                 } catch (error) {
    //                     console.log("Error ==> ", error)
    //                 }

    //             }

    //             if (event.payload.idTokenClaims['tfp'] === b2cPolicies.names.editProfile) {
    //                 // retrieve the account from initial sing-in to the app
    //                 const originalSignInAccount = instance
    //                     .getAllAccounts()
    //                     .find(
    //                         (account) =>
    //                             account.idTokenClaims.oid === event.payload.idTokenClaims.oid &&
    //                             account.idTokenClaims.sub === event.payload.idTokenClaims.sub &&
    //                             account.idTokenClaims['tfp'] === b2cPolicies.names.signUpSignIn
    //                     );

    //                 let signUpSignInFlowRequest = {
    //                     authority: b2cPolicies.authorities.signUpSignIn.authority,
    //                     account: originalSignInAccount,
    //                 };

    //                 // silently login again with the signUpSignIn policy
    //                 instance.ssoSilent(signUpSignInFlowRequest);

    //             }

    //             /**
    //              * Below we are checking if the user is returning from the reset password flow.
    //              * If so, we will ask the user to reauthenticate with their new password.
    //              * If you do not want this behavior and prefer your users to stay signed in instead,
    //              * you can replace the code below with the same pattern used for handling the return from
    //              * profile edit flow
    //              */
    //             if (event.payload.idTokenClaims['tfp'] === b2cPolicies.names.forgotPassword) {
    //                 let signUpSignInFlowRequest = {
    //                     authority: b2cPolicies.authorities.signUpSignIn.authority,
    //                     scopes: [
    //                         ...protectedResources.apiTodoList.scopes.read,
    //                         ...protectedResources.apiTodoList.scopes.write,
    //                     ],
    //                 };
    //                 instance.loginRedirect(signUpSignInFlowRequest);
    //             }
    //         }

    //         if (event.eventType === EventType.LOGIN_FAILURE) {
    //             // Check for forgot password error
    //             // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
    //             if (event.error && event.error.errorMessage.includes('AADB2C90118')) {
    //                 const resetPasswordRequest = {
    //                     authority: b2cPolicies.authorities.forgotPassword.authority,
    //                     scopes: [],
    //                 };
    //                 instance.loginRedirect(resetPasswordRequest);
    //             }
    //         }
    //     });

    //     return () => {
    //         if (callbackId) {
    //             instance.removeEventCallback(callbackId);
    //         }
    //     };
    //     // eslint-disable-next-line
    // }, [instance]);


    useEffect(() => {
        ; (async () => {
            try {
                // debugger
                if (instance) {
                    console.log('active ==< ', instance.getActiveAccount())
                    let activeAccount = instance.getActiveAccount();
                    if (activeAccount) {

                        const response = await axios.post(BASE_URL + endPointName.authorizeUser + activeAccount.username, "")
                        const { data } = response
                        console.log("Response ==> ", response)

                        let user = {
                            id: activeAccount.localAccountId,
                            role: 'SA',
                            name: data.userName,
                            userName: data.userName,
                            email: data.emailId,
                            avatar: '/assets/images/face-6.jpg',
                            age: 25,
                            adminUserId: data.adminUserId,
                            isActive: data.isActive,
                            roleId: data.roleId,
                            whenEntered: data.whenEntered,
                            whenModified: data.whenModified,
                            organizationId: data.organizationId
                        };
                        dispatch({
                            type: 'INIT',
                            payload: {
                                isAuthenticated: true,
                                user,
                            },
                        })
                        sessionStorage.setItem('userJSON', JSON.stringify(user))
                        let orgResponse = await CallAPI(endPointName.OrganizationMaster + data.organizationId, "post");
                        sessionStorage.setItem('organizationData', JSON.stringify(orgResponse))
                    } else {
                        dispatch({
                            type: 'INIT',
                            payload: {
                                isAuthenticated: false,
                                user: null,
                            },
                        })
                    }

                }
                const accessToken = window.localStorage.getItem('accessToken')

                // if (accessToken && isValidToken(accessToken)) {
                // if (accessToken) {
                //     setSession(accessToken)

                //     let activeAccount = instance.getActiveAccount();
                //     if (activeAccount) {

                //         let user = {
                //             id: activeAccount.localAccountId,
                //             role: 'SA',
                //             name: activeAccount.name,
                //             userName: activeAccount.name,
                //             email: activeAccount.username,
                //             avatar: '/assets/images/face-6.jpg',
                //             age: 25,
                //             adminUserId: '',
                //             isActive: true,
                //             roleId: '',
                //             whenEntered: '',
                //             whenModified: ''
                //         };
                //         dispatch({
                //             type: 'INIT',
                //             payload: {
                //                 isAuthenticated: true,
                //                 user,
                //             },
                //         })
                //     } else {
                //         dispatch({
                //             type: 'INIT',
                //             payload: {
                //                 isAuthenticated: false,
                //                 user: null,
                //             },
                //         })
                //     }
                // } else {
                //     dispatch({
                //         type: 'INIT',
                //         payload: {
                //             isAuthenticated: false,
                //             user: null,
                //         },
                //     })

                // }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading />
    }

    // debugger
    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
