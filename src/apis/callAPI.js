import { useState, useEffect } from "react";
import { BASE_URL } from "./apiList";

export const getAPIPayload = (method, bodyData) => {
    if (method == 'GET') {
        let payloadObj = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
        return payloadObj;
    } else {
        let payloadObj = {
            method: method,
            body: JSON.stringify(bodyData),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        return payloadObj;
    }
}

export const CallAPI = (route, method, bodyData) => {
    try {
        console.log("Final API URL ==> ", route)
        console.log("Final Body ==> ", JSON.stringify(bodyData))
        let payloadObj = getAPIPayload(method, bodyData);

        return fetch(BASE_URL + route, payloadObj)
            .then((response) => response.json())
            .then((json) => {
                return json;
            })
            .catch((error) => {
                console.log("Error in callAPI ==> ", error);
                return 'error';
            });
    } catch (error) {
        return error
    }
}