import { Container, Row, Col, Form, InputGroup, FormControl, Dropdown, DropdownButton } from "react-bootstrap";

import { BiSearchAlt2 } from 'react-icons/bi';

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react';

import { useRouter } from 'next/router';

export default function Header({order, setOrder} = props) {

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleBusca = (e) => {
    e.preventDefault();
    router.push({ pathname: '/pesquisar', query: { term: searchTerm, order: order }});
    setSearchTerm("");
  }
  
  return (
    <header>
      <Container>
        <Form className="d-flex justify-content-lg-end" onSubmit={handleBusca}>
          <Row className="d-flex justify-content-lg-end align-items-lg-center forms">
            <Col xs="6" md="auto" lg="auto">
              <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
                Search
              </Form.Label>
              <InputGroup className="position-relative searchBox">
                <InputGroup.Text className="icon-search"><BiSearchAlt2 /></InputGroup.Text>
                <FormControl id="inlineFormInputGroup" placeholder="Search" value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value) }}/>
              </InputGroup>
            </Col>

            <Col xs="6" md="auto" lg="auto">
              <InputGroup>
                <DropdownButton
                  variant="outline-secondary"
                  title={`Ordenando: ${order == "ASC" ? 'Mais Antigas' : 'Mais Novas'}`}
                  id="input-group-dropdown-1"
                >
                  <Dropdown.Item onClick={() => setOrder('ASC')}>Mais Antigas</Dropdown.Item>
                  <Dropdown.Item onClick={() => setOrder('DESC')}>Mais Novas</Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </Col>

          </Row>
        </Form>
        <Row>
          <Col md="12" className="d-flex justify-content-center">
            <Link href={order == 'ASC' ? `/?order=ASC` : `/`} ><a><Image src="/logo.svg" width="300" height="150" alt="logo space flight news" /></a></Link>
          </Col>
        </Row>
      </Container>
    </header>
  );
}

