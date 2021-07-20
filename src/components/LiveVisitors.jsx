import React, { useEffect, useState } from "react";
import { Table, Container, Row } from "reactstrap";
import axios from "axios";
import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:5000/live");

function LiveVisitors() {
  const [visitors, setvisitors] = useState([]);

  useEffect(() => {
    axios.get("http://geoplugin.net/json.gp").then((res) => {
      const {
        geoplugin_request,
        geoplugin_countryCode,
        geoplugin_city,
        geoplugin_region,
        geoplugin_countryName,
      } = res.data;
      const visitor = {
        ip: geoplugin_request,
        country: geoplugin_countryName,
        state: geoplugin_region,
        city: geoplugin_city,
        flag: geoplugin_countryCode,
      };
      socket.emit("new_visiter", visitor);

      socket.on("visitors", (v) => {
        setvisitors(v);
      });
    });
  }, []);
  const countrycode = (cn) => `https://www.countryflags.io/${cn}/flat/64.png`;
  return (
    <>
      <Container>
        <Row>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Ip Address</th>
                <th>Flag</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length > 0 &&
                visitors.map((v, i) => {
                  if (v.ip) {
                    return (
                      <tr key={i}>
                        <td>1</td>
                        <td>{v.ip}</td>
                        <td>
                          <img src={countrycode(v.flag)} alt={v.country}></img>
                        </td>
                        <td>{v.city}</td>
                        <td>{v.state}</td>
                        <td>{v.country}</td>
                      </tr>
                    );
                  } else {
                    return <div />;
                  }
                })}
            </tbody>
          </Table>
        </Row>
      </Container>
    </>
  );
}

export default LiveVisitors;
