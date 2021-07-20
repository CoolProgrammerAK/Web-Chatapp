import React, { useState, useEffect } from "react";
import { Button, Input, Form, Alert, Container, Row, Col } from "reactstrap";
import { useLocation } from "react-router";
import queryString from "query-string";
import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:5000/public");

export default function PublicchatContainer() {
  const [text, settext] = useState("");
  const [typing, setyping] = useState("");
  const location = useLocation();
  const [messages, setmessages] = React.useState([]);
  const [arrivalmessage, setarrivalmessage] = React.useState([]);
  const [users, setusers] = React.useState([]);

  const scrollref = React.useRef();
  const { name, room } = queryString.parse(decodeURIComponent(location.search));

  useEffect(() => {
    socket.emit("new_user", { name: name,room:room });
    socket.on("users", (users) => {
      setusers(users);
    });
  }, [name]);

  React.useEffect(() => {
    scrollref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    socket.emit('join_room',room)
    socket.on("server_message", (message) => {
      setarrivalmessage({
        name: message.name,
        message: message.message,
      });
    });
    socket.on("message", (message) => {
      setarrivalmessage({
        name: message.name,
        message: message.message,
      });
    });
    socket.on("typing", (mes) => {
      setyping(mes);
    });
    socket.on("stopped_typing", () => {
      setyping("");
    });
    return () => {
    socket.disconnect()
  }
  }, []);

  useEffect(() => {
    arrivalmessage && setmessages([...messages, arrivalmessage]);
  }, [arrivalmessage]);

  const handlesubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message: text,room:room,name:name });
    setmessages([...messages, { name: "You", message: text }]);
    settext("");
  };
  return (
    <Container className="my-3">
      <p>Typing status: {typing} </p>

      <Row sm="1">
        <Col xs="8">
          <Container
            fluid
            className="px-0 py-2"
            style={{ overflowY: "scroll", height: 450, position: "relative" }}
          >
            <div style={{ paddingRight: 10 }}>
              {messages.length > 0 &&
                messages.map((m) => {
                  if (m.name) {
                    return (
                      <div ref={scrollref} key={m.id}>
                        <Alert
                          color={
                            m.name === "You"
                              ? "light"
                              : m.name === "TimeChat"
                              ? "danger"
                              : "success"
                          }
                        >
                          {m.name} : {m.message}
                        </Alert>
                      </div>
                    );
                  } else {
                    return <div />;
                  }
                })}
            </div>
          </Container>

          <Form
            onSubmit={handlesubmit}
            className="my-3"
            style={{ display: "flex" }}
          >
            <Input
              required
              value={text}
              onFocus={() => socket.emit("typing",room)}
              onBlur={() => socket.emit("stopped_typing",room)}
              onChange={(e) => {
                settext(e.target.value);
              }}
              className="me-3"
              placeholder="Message"
            />

            <Button type="submit" color="primary">
              Send{" "}
            </Button>
          </Form>
        </Col>
        {room=="public" && <Col xs="4">
          <h5>Online users</h5>
          <ul>
            {users.length > 0 &&
              users.map((user) => {
                if (user.name) {
                  return <li key={user.id}>{user.name}</li>;
                } else {
                  return <div></div>;
                }
              })}
          </ul>
        </Col>}
      </Row>
    </Container>
  );
}
