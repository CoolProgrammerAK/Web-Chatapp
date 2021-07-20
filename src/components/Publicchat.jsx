import React, {useState } from "react";
import { Button, Form, Input, Container } from "reactstrap";

export default function Publicchat({history}) {
  const [text,settext]=useState("")

  const handlesubmit = (e) => {
    e.preventDefault();
  history.push({pathname:"/chat",search:`name=${text}&room=public`})
  
  };

  return (
    <Container className="my-3">
      <Form onSubmit={handlesubmit}>
        <Input required value={text} onChange={(e)=>settext(e.target.value)} className="mb-3" placeholder="Your name" />
        <div className="text-center">
          <Button  type="submit" className="w-25" color="primary">
            Join public room
          </Button>
        </div>
      </Form>
    </Container>
  );
}
