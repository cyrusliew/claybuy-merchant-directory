import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {
  Button,
  Card,
  Col,
  Layout,
  Row,
  Skeleton,
} from 'antd';
import logo from './logo';
import 'antd/dist/antd.css';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Meta } = Card;

const Logo = styled(logo)`
  max-width: 9rem;
`;

const Intro = styled.div`
  background: #786dff;
  margin-bottom: 1rem;
  padding: 2rem 4rem;
`;

const Filters = styled.div`
  background: #f0f2f5;
  padding: 1rem;
  position: sticky;
  top: 3.85rem;
  z-index: 1;

  > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

function App() {
  const [tiles, setTiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [currentFilter, setcurrentFilter] = useState('all');
  
  useEffect(() => {
    if (tiles === null && !isLoading) {
      setIsLoading(true);
      axios({
        url: 'https://claybuy-merchant-graphql.netlify.app/',
        method: 'post',
        data: {
          query: `
            {
              tiles: getTiles {
                id
                name
                tileImage
                url
                online
                instore
              }
            }
          `
        }
      }).then((response) => {
        setTiles(response.data.data.tiles);
        setIsLoading(false);
      })
    }
  }, [isLoading, tiles])

  const filters = {
    all: 'All',
    online: 'Online',
    instore: 'In Store',
  };

  return (
    <Layout className="App">
      <Header
        style={{
          padding: '1rem',
          position: 'sticky',
          top: '0',
          zIndex: 1,
        }}
      >
        <a href="https://www.laybuy.com/nz/" target="_blank" rel="noreferrer noopener">
          <Logo />
        </a>
      </Header>
      <Content>
        <Intro>
          <h1>Welcome to Laybuy's merchant directory.</h1>
          <p>Here you can view all of our awesome partner.</p>
        </Intro>

        <Filters>
          {
            Object.keys(filters).map((filter, index) => (
              <Button
                key={`filter-${filter}`}
                shape="round"
                size="large"
                type={currentFilter === filter ? 'primary' : ''}
                onClick={() => setcurrentFilter(filter)}>
                  {filters[filter]}
              </Button>
            ))
          }
        </Filters>

        <Row
          gutter={[16, 16]}
          style={{
            padding: '1rem',
          }}
        >

          {
            isLoading &&
            Array.from(Array(6), (_, index) => (
              <Col
                key={index}
                sm={12}
                md={8}
                lg={8}
                xl={6}
                xxl={4}
              >
                <Skeleton loading={isLoading} active >
                  <Card
                    cover={<Skeleton.Image />}
                  />
                </Skeleton>
              </Col>
            ))
          }

          {
            !isLoading && tiles && tiles.length > 0 && tiles.map((tile) => {
              const {
                id,
                name,
                url,
                tileImage,
              } = tile;

              if (currentFilter !== 'all' && !tile[currentFilter]) {
                return '';
              }

              return (
                <Col
                  key={id}
                  sm={12}
                  md={8}
                  lg={8}
                  xl={6}
                  xxl={4}
                  onClick={() => window.open(url)}
                >
                  <Card
                    hoverable
                    cover={<img alt={name} src={tileImage} />}
                  >
                    <Meta title={name} description={url} />
                  </Card>
                </Col>
              )
            })
          }

        </Row>
      </Content>
      <Footer>
        Demo site by <a href="https://cyrusliew.com" target="_blank" rel="noopener noreferrer">cyrusliew.com</a>
      </Footer>
    </Layout>
  );
}

export default App;
