import { Table } from 'react-bootstrap';
import { createClaimsTable } from '../utils/claimUtils';
import { CallAPI } from '../apis/callAPI';
import { endPointName } from '../apis/apiList';
import { useEffect } from 'react';

export const IdTokenData = (props) => {

    const apiCallTable = async () => {
        // const response = await CallAPI(endPointName.getAllData, "Get");
        const response = await CallAPI(endPointName.addEditRequest, "Get");
        console.log('response ==>', response);
    }

    useEffect(() => {
        apiCallTable()
    }, [])

    // const tokenClaims = createClaimsTable(props.idTokenClaims);

    // const tableRow = Object.keys(tokenClaims).map((key, index) => {
    //     return (
    //         <tr key={key}>
    //             {tokenClaims[key].map((claimItem) => (
    //                 <td key={claimItem}>{claimItem}</td>
    //             ))}
    //         </tr>
    //     );
    // });
    return (
        <>
            <div className="data-area-div">
                {/* <p>
                    See below the claims in your <strong> ID token </strong>. For more information, visit:{' '}
                    <span>
                        <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token">
                            docs.microsoft.com
                        </a>
                    </span>
                </p>
                <div className="data-area-div">
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th>Claim</th>
                                <th>Value</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>{tableRow}</tbody>
                    </Table>
                </div> */}
            </div>
        </>
    );
};
