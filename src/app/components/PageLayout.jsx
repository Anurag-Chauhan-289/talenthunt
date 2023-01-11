
import { useEffect, useReducer, createContext } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { NavigationBar } from "./NavigationBar";
import { loginRequest, b2cPolicies } from '../../authConfig';
import { AuthProvider } from '../contexts/JWTAuthContext';
import { EventType } from '@azure/msal-browser';
import axios from 'axios.js'
import { Button } from 'react-bootstrap';

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
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

export const PageLayout = (props) => {
    // debugger
    const { instance, inProgress } = useMsal();
    const [state, dispatch] = useReducer(reducer, initialState);

    // (function () {
    //     const activeAccount = instance.getActiveAccount();
    //     if (!activeAccount) {
    //         instance.loginRedirect(loginRequest).catch((error) => console.log(error))
    //     } else {
    //         // instance.logoutRedirect();
    //     }
    // })();

    useEffect(() => {
        const activeAccount = instance.getActiveAccount();
        if (!activeAccount) {
            instance.loginRedirect(loginRequest).catch((error) => console.log(error))
        } else {
            // instance.logoutRedirect();
        }
    }, [])

    useEffect(() => {
        const callbackId = instance.addEventCallback(async (event) => {
            if (
                (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
                event.payload.account
            ) {
                /**
                 * For the purpose of setting an active account for UI update, we want to consider only the auth
                 * response resulting from SUSI flow. "tfp" claim in the id token tells us the policy (NOTE: legacy
                 * policies may use "acr" instead of "tfp"). To learn more about B2C tokens, visit:
                 * https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
                 */
                // debugger
                console.log("Instance ==> ", instance)
                let activeAccount = instance.getActiveAccount();


                if (activeAccount) {

                    try {

                        let userData = {
                            id: activeAccount.localAccountId,
                            role: 'SA',
                            name: activeAccount.name,
                            userName: activeAccount.username,
                            email: activeAccount.username,
                            avatar: '/assets/images/face-6.jpg',
                            age: 25,
                            adminUserId: '',
                            isActive: true,
                            roleId: '',
                            whenEntered: '',
                            whenModified: ''
                        };

                        // call api 
                        // https://talenthunt-dev.azurewebsites.net/api/UserData/Authorize/ajinkya.bhaskar@ifi.tech

                        let idTokenClaims = activeAccount.idTokenClaims;
                        let encodedString = window.btoa(JSON.stringify(idTokenClaims));
                        setSession(encodedString);

                        // const response = await axios.post('https://talenthunt-dev.azurewebsites.net/api/UserData/Authorize/' + activeAccount.username, "")
                        // const { data } = response
                        // console.log("Response ==> ", response)
                        // userData.name = data.userName;
                        // userData.adminUserId = data.adminUserId;
                        // userData.email = data.emailId;
                        // userData.isActive = data.isActive;
                        // userData.roleId = data.roleId;
                        // userData.whenEntered = data.whenEntered;
                        // userData.whenModified = data.whenModified;

                        // dispatch({
                        //     type: 'LOGIN',
                        //     payload: {
                        //         user: userData,
                        //     },
                        // })

                        // dispatch({
                        //     type: 'INIT',
                        //     payload: {
                        //         isAuthenticated: true,
                        //         user: userData,
                        //     },
                        // })

                    } catch (error) {
                        console.log("Error ==> ", error)
                    }

                }

                if (event.payload.idTokenClaims['tfp'] === b2cPolicies.names.editProfile) {
                    // retrieve the account from initial sing-in to the app
                    const originalSignInAccount = instance
                        .getAllAccounts()
                        .find(
                            (account) =>
                                account.idTokenClaims.oid === event.payload.idTokenClaims.oid &&
                                account.idTokenClaims.sub === event.payload.idTokenClaims.sub &&
                                account.idTokenClaims['tfp'] === b2cPolicies.names.signUpSignIn
                        );

                    let signUpSignInFlowRequest = {
                        authority: b2cPolicies.authorities.signUpSignIn.authority,
                        account: originalSignInAccount,
                    };

                    // silently login again with the signUpSignIn policy
                    instance.ssoSilent(signUpSignInFlowRequest);

                }

                /**
                 * Below we are checking if the user is returning from the reset password flow.
                 * If so, we will ask the user to reauthenticate with their new password.
                 * If you do not want this behavior and prefer your users to stay signed in instead,
                 * you can replace the code below with the same pattern used for handling the return from
                 * profile edit flow
                 */
                // if (event.payload.idTokenClaims['tfp'] === b2cPolicies.names.forgotPassword) {
                //     let signUpSignInFlowRequest = {
                //         authority: b2cPolicies.authorities.signUpSignIn.authority,
                //         scopes: [
                //             ...protectedResources.apiTodoList.scopes.read,
                //             ...protectedResources.apiTodoList.scopes.write,
                //         ],
                //     };
                //     instance.loginRedirect(signUpSignInFlowRequest);
                // }
            }

            if (event.eventType === EventType.LOGIN_FAILURE) {
                // Check for forgot password error
                // Learn more about AAD error codes at https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
                if (event.error && event.error.errorMessage.includes('AADB2C90118')) {
                    const resetPasswordRequest = {
                        authority: b2cPolicies.authorities.forgotPassword.authority,
                        scopes: [],
                    };
                    instance.loginRedirect(resetPasswordRequest);
                }
            }
            if (event.eventType === EventType.LOGOUT_SUCCESS) {
                // debugger
                // instance.loginRedirect(loginRequest);
            }
        });

        return () => {
            if (callbackId) {
                instance.removeEventCallback(callbackId);
            }
        };
        // eslint-disable-next-line
    }, [instance]);

    // const AuthContext = createContext({
    //     ...initialState,
    //     method: 'JWT',
    //     login: () => Promise.resolve(),
    //     logout: () => { },
    //     register: () => Promise.resolve(),
    // })

    const handleLoginRedirect = () => {
        instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    };

    const handleLogoutRedirect = () => {
        instance.logoutRedirect();
    };

    return (
        <>
            {/* <NavigationBar />
            <br />
            {props.children} */}
            {/* <br /> */}
            <UnauthenticatedTemplate>
                <Button variant="info" onClick={handleLoginRedirect} className="profileButton">
                    Login
                </Button>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <AuthProvider>{props.children}</AuthProvider>
            </AuthenticatedTemplate>
        </>
    );
}