import {
  Box,
  Button,
  IconButton,
  styled
} from "@mui/material";
import DataTable from 'react-data-table-component';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const PaginationTable = ({ users, location, columns, handleRowSelected }) => {

  const customStyles = {
    rows: {
      style: {
        // minHeight: '72px', // override the row height
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px', // override the cell padding for head cells
        paddingRight: '8px'
      },
    },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
      },
    },
  };

  const rowClicked = (row, event) => {

    let tempWindow = window.open("/users/UserDetails", '_blank')
    tempWindow.userId = row.userId
    /**
     * Navigate to detail page and open it in a new tab
     */
    // console.log("Row : ", row)
  }

  const selectedOption = (option) => {
    // alert(option.label)
    console.log(option.label)
  }

  return (
    <>
      <Box width="100%" >
        {
          location == 'postDetailScreen' ?
            <DataTable
              columns={columns}
              data={users}
              // selectableRowsComponentProps={selectProps}
              onSelectedRowsChange={handleRowSelected}
              highlightOnHover
              // dense
              pagination
              responsive
              // progressPending={''}
              customStyles={customStyles}
              onRowClicked={rowClicked}
            />
            :
            <DataTable
              columns={columns}
              data={users}
              // selectableRowsComponentProps={selectProps}
              onSelectedRowsChange={handleRowSelected}
              highlightOnHover
              // dense
              pagination
              responsive
              // progressPending={''}
              customStyles={customStyles}
              onRowClicked={rowClicked}
              selectableRows
            />
        }
      </Box>

    </>
  );
};

export default PaginationTable;
