import React from "react";

class DataTableContent extends React.Component {
    constructor(props) {
      super(props);
      this.props = props;
    }
  
    render() {
      return (
        <>
          <tr>
            <td>COV Hash : </td>
            <td>{this.props.hash}</td>
          </tr>
          <tr>
            <td>Timestamp : </td>
            <td>{this.props.timestamp}</td>
          </tr>
        </>
      );
    }
  }

export default DataTableContent;