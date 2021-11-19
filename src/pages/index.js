import Link from 'next/link';
import moment from 'moment';


import Head from 'next/head';
import { useRouter } from 'next/router'
import { useState, useEffect, useRef} from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#__next');


import { Container, Row, Col } from 'react-bootstrap';


export default function Home({post, order} = props) {
  const router = useRouter();
  const [item, setItem] = useState(null);

  const [posts, setPosts] = useState(post);
  const [loading, setLoading] = useState(false);

  const firstUpdate = useRef(true);
  const start = useRef(0);

  
  const replaceImgWithError = e => {
    e.target.onerror = null;
    e.target.src = '/space.jpg';
  };

  const getPosts = () => {
    setLoading(true);
    fetch(`https://api.spaceflightnewsapi.net/v3/articles?_limit=10&_start=${start.current}&_sort=id:${order}`)
      .then(res => res.json())
      .then(res => {
        setPosts(oldPosts => [...oldPosts, ...res]);
        setLoading(false);
      });
  }

  const handleCarregarMais = () => {
    start.current += 10;
    getPosts();
  }
  
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    setPosts([]);
    start.current = 0;
    getPosts();
  }, [order]);

  useEffect(() => {
    router.replace({ pathname: '/', query: (order == 'ASC' ? { order: order } : {})});
  }, [order]);


  return (
    <>
    <Head>
      <title>Space Flight News</title>
    </Head>
      <Container>
        <ul className="content">
          {posts
            .map((item, i) => (
              <li key={i}>
                <img src={item?.imageUrl} alt={item?.title} className="imgCard" onError={replaceImgWithError}/>
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
            <button className="btn btn-loadmore" onClick={handleCarregarMais}>{loading ? 'Carregando...' : 'Carregar Mais'}</button>
          </Col>
        </Row>
      </Container>

      <Modal
        isOpen={(item ? true : false)}
        onAfterOpen={() => { }}
        onRequestClose={() => setItem(null)}
        className="modal-space"
        ariaHideApp={false}
        style={{ overlay: { backgroundColor: 'rgba(0,0,0,0.8)', zIndex: '9998', } }}>

        <Container>
          <div className="modal-body">
            <Row>
              <Col md={6}>
                <div className="boxImage position-relative">
                  <img src={item?.imageUrl ? item?.imageUrl : '/placeholder.png'} className="modalImg" alt={item?.title} />
                </div>
              </Col>
              <Col md={6}>
                <div className="infos-modal">
                  <h4>{item?.title}</h4>
                  <h6>{moment(item?.publishedAt).locale('pt-br').format('L')}</h6>
                  <p>{item?.summary}</p>
                </div>
              </Col>

              <Col md={12} className="d-flex justify-content-center">
                <Link href={`${item?.url}`} passHref={true} ><a target="_blank" className="btn btn-primary my-3">Ir para o site</a></Link>

              </Col>
            </Row>
          </div>

        </Container>
      </Modal>
    </>
  )
}

export async function getServerSideProps(context) {

 const response = await fetch(`https://api.spaceflightnewsapi.net/v3/articles?_limit=10&_start=0&_sort=id:${context.query?.order ?? 'DESC'}`);
 const data = await response.json();

  return {
    props: {
      post: data
    },
  }
}