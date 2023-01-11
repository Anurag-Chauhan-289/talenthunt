import { useState, useEffect } from "react";
import { BASE_URL } from "./apiList";

const useFetchGET = (apiName) => {
    const [data, setData] = useState(null);
    let url = BASE_URL + apiName;
    // debugger
    useEffect((url) => {
        const callAPI = async () => {
            await fetch(BASE_URL + apiName)
                .then((res) => res.json())
                .then((data) => {
                    return setData(data)
                });
        }
        callAPI()
    }, [apiName]);

    return [data];
};

export default useFetchGET;