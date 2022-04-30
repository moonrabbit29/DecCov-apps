import React from "react";

class VaccineData extends React.Component {
    constructor(props) {
      super(props);
      this.props = props;
    }
    render() {
      return (
        <>
          <tr>
            <td>Jenis Vaksin: </td>
            <td>{this.props.data.name}</td>
          </tr>
          <tr>
            <td>Dosis : </td>
            <td>{this.props.data.dose}</td>
          </tr>
        </>
      );
    }
  }

  export default VaccineData;