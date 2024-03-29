import { Helmet } from "react-helmet";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Chip,
  Button
} from "@material-ui/core";
import { v4 as uuid } from "uuid";
import moment from "moment";

const invoices = [
  {
    id: uuid(),
    ref: "CDD1049",
    amount: 30.5,
    customer: {
      name: "Ekaterina Tankova",
    },
    createdAt: 1555016400000,
    status: "Pending",
    color: ""
  },
  {
    id: uuid(),
    ref: "CDD1048",
    amount: 25.1,
    customer: {
      name: "Cao Yu",
    },
    createdAt: 1555016400000,
    status: "Delivered",
    color: "success"
  },
  {
    id: uuid(),
    ref: "CDD1047",
    amount: 10.99,
    customer: {
      name: "Alexa Richardson",
    },
    createdAt: 1554930000000,
    status: "Refunded",
    color: "error"
  },
  {
    id: uuid(),
    ref: "CDD1046",
    amount: 96.43,
    customer: {
      name: "Anje Keizer",
    },
    createdAt: 1554757200000,
    status: "Pending",
    color: ""
  },
  {
    id: uuid(),
    ref: "CDD1045",
    amount: 32.54,
    customer: {
      name: "Clarke Gillebert",
    },
    createdAt: 1554670800000,
    status: "Delivered",
    color: "success"
  },
  {
    id: uuid(),
    ref: "CDD1044",
    amount: 16.76,
    customer: {
      name: "Adam Denisov",
    },
    createdAt: 1554670800000,
    status: "Delivered",
    color: "success"
  },
];

const Invoices = () => (
  <>
    <Helmet>
      <title>Customers | Client Portal</title>
    </Helmet>
    <Box sx={{ p: 10 }}>
      <Button style={{ float: 'right', marginBottom: '10px' }} size="small" variant="contained" sx={{ p: "9px" }}>
        Add Invoices
      </Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>INVOICE</TableCell>
              <TableCell>DATE</TableCell>
              <TableCell>TOTAL</TableCell>
              <TableCell align="center">STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices?.map((inv) => (
              <TableRow hover key={inv.id}>
                <TableCell style={{ color: "#007bff" }}>{inv.ref}</TableCell>
                <TableCell>
                  {moment(inv.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>1,000 ₹</TableCell>
                <TableCell align="center">
                  {
                    inv.color === "" ? (
                      <Chip label={inv.status} size="small" />
                    ) : (
                      <Chip style={{ color: '#ffffff' }} color={inv.color} label={inv.status} size="small" />
                    )
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  </>
);

export default Invoices;
