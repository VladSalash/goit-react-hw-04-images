import { useState } from 'react';
import PropTypes from 'prop-types';

import { Header, Form, Button, ButtonLabel, Input } from './Searchbar.styled';

// Toaster
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Searchbar = ({ onSubmit }) => {
  const [category, setContact] = useState('');

  const handleChange = event => {
    setContact(event.currentTarget.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (category.trim() === '') {
      return toast.info('Please enter category name');
    }

    onSubmit(category);
    reset();
  };

  const reset = () => {
    setContact('');
  };

  return (
    <Header>
      <Form onSubmit={handleSubmit}>
        <Input
          value={category}
          onChange={handleChange}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
        <Button type="submit">
          <ButtonLabel>Search</ButtonLabel>
        </Button>
      </Form>
    </Header>
  );
};

export default Searchbar;
