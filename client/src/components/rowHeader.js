import React from "react";
import { Row } from "react-bootstrap";

export default class RowHeader extends React.Component {
  render() {
    return <Row style={{ fontWeight: "bold" }}>{this.props.children}</Row>;
  }
}
