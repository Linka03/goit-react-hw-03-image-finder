// App.jsx
import React, { Component } from 'react';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button';
import Loader from './components/Loader';
import Modal from './components/Modal';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      images: [],
      page: 1,
      isLoading: false,
      showModal: false,
      selectedImage: '',
    };
  }

  handleSearchSubmit = newQuery => {
    this.setState({
      query: newQuery,
      images: [],
      page: 1,
    });
  };

  handleImageClick = largeImageUrl => {
    this.setState({
      selectedImage: largeImageUrl,
      showModal: true,
    });
  };

  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false,
      selectedImage: '',
    });
  };

  fetchImages = async () => {
    this.setState({
      isLoading: true,
    });

    try {
      const apiKey = '40250355-d0c6ab5be835447af42ca5fe7';
      const perPage = 12;
      const { query, page } = this.state;
      const apiUrl = `https://pixabay.com/api/?q=${query}&page=${page}&key=${apiKey}&image_type=photo&orientation=horizontal&per_page=${perPage}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      this.setState(prevState => ({
        images: [...prevState.images, ...data.hits],
      }));
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  componentDidMount() {
    this.fetchImages();
  }

  componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;
    if (query !== prevState.query || page !== prevState.page) {
      this.fetchImages();
    }
  }

  render() {
    const { images, isLoading, showModal, selectedImage } = this.state;

    return (
      <div>
        <Searchbar onSubmit={this.handleSearchSubmit} />
        <ImageGallery images={images} onImageClick={this.handleImageClick} />
        {isLoading && <Loader />}
        {images.length > 0 && !isLoading && (
          <Button
            className="load-more-button"
            onClick={this.handleLoadMore}
            disabled={isLoading}
          >
            Load more
          </Button>
        )}
        {showModal && (
          <Modal
            largeImageUrl={selectedImage}
            onClose={this.handleCloseModal}
          />
        )}
      </div>
    );
  }
}

export default App;
