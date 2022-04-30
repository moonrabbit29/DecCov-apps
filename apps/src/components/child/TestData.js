import React from "react";

class TestData extends React.Component {
    constructor(props) {
      super(props);
      this.props = props;
    }
    render() {
      return (
        <>
          <tr>
            <td>Jenis tes: </td>
            <td>{this.props.data.name}</td>
          </tr>
          <tr>
            <td> Hasil tes : </td>
            <td>{this.props.data.result}</td>
          </tr>
        </>
      );
    }
  }
export default TestData;