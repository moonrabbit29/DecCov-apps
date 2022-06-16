import React from "react";
import { Table } from "react-bootstrap";
import DataTableContent from "./DataTableContent";
import VaccineData from "./VaccineData";
import TestData from "./TestData";
import { convert_unix_date } from "../../date_helper";

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    return (
      <>
        {this.props.certificates_data.map((element, index) => {
         // console.log(element)
          return (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>Certificate Data</tr>
              </thead>
              <tbody>
                <DataTableContent
                  key={index}
                  hash={element.cov_certificate_identifier}
                  timestamp={convert_unix_date(element.timestamp)}
                />
                {element.data_detail.certificate_data.type === "Vaccine" ? (
                  <VaccineData data={element.data_detail.certificate_data} />
                ) : (
                  <TestData data={element.data_detail.certificate_data} />
                )}
              </tbody>
            </Table>
          );
        })}
      </>
    );
  }
}
export default DataTable;
