import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";

export default function Navegator() {
  return (
    <Navbar bg="dark" variant="dark" fixed='bottom'>
      <Container>
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/">
            sdsadsdsa
          </Nav.Link>
          <Nav.Link as={NavLink} to="login">
            Login|
          </Nav.Link>
          <Nav.Link as={NavLink} to="home_user">
            Home_user
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
