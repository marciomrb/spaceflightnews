import 'styles/main.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import SSRProvider from 'react-bootstrap/SSRProvider';
import Header from '@/components/header';
import { useRouter } from 'next/router';
import react, {useState} from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [order, setOrder ] = useState(router.query?.order ?? 'DESC');

  return (
    <SSRProvider>
      <Header order={order} setOrder={setOrder} />
    <Component {...pageProps} order={order} />
    </SSRProvider>
  )
}

export default MyApp
