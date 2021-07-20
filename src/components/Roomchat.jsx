import React from "react";
import { Button, Input, Table, Form, Container, Row, Col } from "reactstrap";
export default function Roomchat({history}) {
  
  const [text, settext] = React.useState("");
  const [rooms] = React.useState([
    "Programming","Android","Web development","Machine Learning", "Artificial Learning",
  ]);
  const handlesubmit = (e,room) => {
    e.preventDefault();
    const name=prompt("Enter your name")
  history.push({pathname:"/chat",search:`name=${name}&room=${room}`})
  
  };
  return (
    <Container className="my-3">
      <Row>
        <Col>
          <Table >
            <thead>
              <tr>
                <th>Default Rooms</th>
                <th>Join</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, i) => {
                return (
                  <tr  key={i}>
                    <td>{room}</td>
                    <td>
                      <>
                        <Button onClick={(e)=>handlesubmit(e,room)} color="success">Join Room</Button>
                      </>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
        <Col>
          <Form onSubmit={(e)=>handlesubmit(e,text)} className="my-3" style={{ display: "flex" }}>
            <Input
              required
              onChange={(e) => {
                settext(e.target.value);
              }}
              
              value={text}
              className="mx-3"
              placeholder="Rooms"
            />

            <Button type="submit" color="primary">
              Join custom room{" "}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
