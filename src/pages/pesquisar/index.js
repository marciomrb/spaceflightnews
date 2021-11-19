import { Container, Row, Col } from "react-bootstrap";
import { useRouter } from 'next/router'
import Head from 'next/head';

import { useState, useEffect, useRef } from 'react';
import moment from 'moment';

export default function Pesquisa({ postsInitial, order, term } = props) {
  const router = useRouter();
  const [item, setItem] = useState(null);

  const [posts, setPosts] = useState(postsInitial);
  const [loading, setLoading] = useState(false);
  const [acabou, setAcabou] = useState(false);

  const firstUpdate = useRef(true);
  const start = useRef(0);

  const getPosts = () => {
    setLoading(true);
    fetch(`https://api.spaceflightnewsapi.net/v3/articles?_limit=10&_start=${start.current}&_sort=id:${order}&title_contains=${term}`)
      .then(res => res.json())
      .then(res => {
        setPosts(oldPosts => [...oldPosts, ...res]);
        setLoading(false);
        if (res.length < 1) setAcabou(true);
      });
  }

  const handleCarregarMais = () => {
    start.current += 10;
    getPosts();
  }

  useEffect(() => {
    router.replace({ pathname: '/pesquisar', query: { term: term, order: order }});
  }, [order]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    setPosts([]);
    start.current = 0;
    getPosts();
  }, [order]);

  useEffect(() => setPosts(postsInitial), [postsInitial]);

  return (
    <>
      <Head>
        <title>Search: {term}</title>
      </Head>
      <Container>
          {posts.length >= 1 ?    
        <>        
        <ul className="content">
          <div className="alert alert-info mt-3 text-center">Exibindo resultados para: <strong>{term}</strong></div>
        {posts
          .map((item, i) => (
            <li key={i}>
              {item?.imageUrl ?
              <img src={item?.imageUrl} alt={item?.title} className="imgCard" />
              : 
              <img src="/placeholder.png" alt={item?.title} className="imgCard" />
              }
              <div className="boxInfo">
                <div className="infos">
                  <h2>{item?.title}</h2>
                  <div className="authorDate">
                    <h6>{moment(item?.publishedAt).format('DD/M/Y')}</h6>
                    <span>{item?.newsSite}</span>
                  </div>
                  <p>{item?.summary}</p>
                </div>
                <button className="btn btn-success" onClick={() => setItem(item)}>Ver Mais</button>
              </div>
            </li>
          ))}
      </ul> 
      <Row>
        <Col md={12} className="d-flex justify-content-center align-items-center my-3">
          {!acabou ? <button className="btn btn-loadmore" onClick={handleCarregarMais}>{loading ? 'Carregando...' : 'Carregar Mais'}</button>
          : <div className="alert alert-warning">Não há mais resultados para esta pesquisa</div>}
        </Col>
      </Row>
      </>
        : <>
            { loading ? 'Carregando...' :
            <div className="alert alert-danger text-center mt-3"><p className="m-0">Você buscou por <strong>{term}</strong></p><p className="m-0">Resultado não encontrado</p></div>}
          </> 
     }
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {

  const { term, order } = context.query;
  
  const response = await fetch(`https://api.spaceflightnewsapi.net/v3/articles?_limit=10&_start=0&title_contains=${term}&_sort=id:${order ?? 'DESC'}`);
  const data = await response.json();

  return {
    props: {
      postsInitial: data,
      term: term
    },
  }
}