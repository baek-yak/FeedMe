import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../../store/slice';
import { useNavigate } from 'react-router-dom';
import NotificationModal from '../Notice/NotificationModal';
import '../Main/Search.css';
import noti from '../../assets/icons/icon-noti-gray.png';
import search from '../../assets/icons/icon-search-gray-24.png';
import mypage from '../../assets/icons/icon-account-gray-24.png';
import '../../assets/font/Font.css' 

const Search = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('accessToken');
    if (sessionToken) {
      dispatch(setToken(sessionToken));
    } else {
      navigate('/login'); 
    }
  }, [dispatch, navigate]);

  const token = useSelector((state) => state.auth.token);

  const fetchSearchResults = async (term) => {
    try {
      const response = await fetch(`http://localhost:8080/users/${term}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data); 
      } else {
        setSuggestions([]);
        console.error('Search request failed');
      }
    } catch (error) {
      setSuggestions([]);
      console.error('An error occurred while fetching search results:', error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchSearchResults(searchTerm);
    } else {
      setSuggestions([]); 
    }
  }, [searchTerm]);

  const handleNotificationClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleProfileClick = () => {
    navigate('/MyPage');
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.nickname);
    console.log(suggestion)
    setSuggestions([]);
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder="전체 사용자 검색"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <div className="search-icon">
        <img src={search} alt="Search Icon" />
      </div>
      <div className="noti-mypage-icons">
        <div onClick={handleNotificationClick}>
          <img src={noti} alt="Noti Icon" />
        </div>
        <div onClick={handleProfileClick}>
          <img src={mypage} alt="Mypage Icon" />
        </div>
      </div>
      {suggestions.length > 0 && (
        <div className="suggestions-modal">
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion.nickname} 
                {!suggestion.friend && ( 
                  <button className="suggestionsListButton">친구 신청</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {isModalOpen && <NotificationModal onClose={handleNotificationClick} />}
    </div>
  );
};

export default Search;

