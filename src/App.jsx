import { useState, useEffect } from 'react';

import { fetchApi } from 'API/api.js';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { animateScroll as Scroll } from 'react-scroll';

import Searchbar from 'components/Searchbar/Searchbar';
import LoadMore from 'components/Button/Button';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Titles from 'components/Title/Title';
import Loader from 'components/Loader/Loader';
import Container from 'components/Container/Container';
import Modal from 'components/Modal/Modal';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

function App() {
  const [keyWord, setKeyWord] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [largeImage, setLargeImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (!keyWord) {
      return;
    }
    setStatus(Status.PENDING);

    const fetchRequest = async () => {
      try {
        const result = await fetchApi(keyWord, page);

        if (result.length === 0) {
          setStatus(Status.IDLE);
          return toast.warning(`${keyWord} not found`);
        }
        setSearchResults(
          prevState => [...prevState, ...result],
          setStatus(Status.RESOLVED)
        );

        scrollToBottom();

        if (page === 1) {
          return toast.success(`Enjoy`);
        }
      } catch (error) {
        setStatus(Status.REJECTED);
        return toast.error(
          `Whoops something went wrong, please try again later`
        );
      }
    };

    fetchRequest();
  }, [page, keyWord]);

  const submitResultsForm = searchQuery => {
    if (searchQuery !== keyWord) {
      setKeyWord(searchQuery);
      setSearchResults([]);
      setPage(1);
    }

    if (searchQuery === keyWord) {
      return toast.warning(`You already here "${keyWord}"`);
    }
  };

  const onLoadMoreBtn = () => {
    setPage(prevState => prevState + 1);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const onImgClick = event => {
    toggleModal();
    setLargeImage(event.largeImageURL);
    setTags(event.tags);
  };

  const scrollToBottom = () => {
    Scroll.scrollToBottom();
  };

  return (
    <>
      <Searchbar onSubmit={submitResultsForm} />
      <Container>
        {status === Status.IDLE && <Titles />}
        {status === Status.REJECTED && <Titles />}
        {status === Status.PENDING && <Loader />}

        <ImageGallery searchResults={searchResults} onClick={onImgClick} />

        {showModal && (
          <Modal
            onClose={toggleModal}
            largeImage={largeImage}
            tags={tags}
          ></Modal>
        )}

        {searchResults.length > 0 && <LoadMore onClick={onLoadMoreBtn} />}
      </Container>

      <ToastContainer autoClose={3000} />
    </>
  );
}
export default App;
