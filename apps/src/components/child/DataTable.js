import React from "react";
import { Table } from "react-bootstrap";
import DataTableContent from "./DataTableContent"
import VaccineData from "./VaccineData";
import TestData from "./TestData"

class DataTable extends React.Component {
    constructor(props) {
      super(props);
      this.props = props;
    }
    render() {
      return (
        <>
          {this.props.certificates_data.map((element, index) => {
            return (
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>Certificate Data</tr>
                </thead>
                <tbody>
                  <DataTableContent
                    key={index}
                    hash={element.cov_certificate_identifier}
                    timestamp={new Date(
                      parseInt(element.timestamp) * 1000
                    ).toDateString()}
                    issuer={
                      element.data_detail.issuer_address
                        ? element.data_detail.issuer_address
                        : element.data_detail
                    }
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