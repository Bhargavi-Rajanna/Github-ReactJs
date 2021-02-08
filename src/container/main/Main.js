import React, { useState, useEffect } from "react";
import axios from "axios";

import GistList from "../../components/modules/gistList/GistList";
import Search from "../../components/modules/search/Search";
import "./main.scss";

//mockData for gists and fork response
// import { gistsMock } from "../../data/gists";
// import { forksMock } from "../../data/multiforks";

const Main = () => {
  const [gists, setGists] = useState([]);
  const [user, setUser] = useState("");
  const [forks, setForks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [gistUserInfo, setGistUserInfo] = useState([]);
  const [gistNumber, setGistNumber] = useState(6);
  const [isloadMore, setIsloadMore] = useState(true);

  const rootUrl = "https://api.github.com";

  useEffect(() => {
    searchGistsOfUser(user);
  }, [setGists]);

  useEffect(() => [setForks]);

  const searchGistsOfUser = async (user) => {
    if (user) {
      const response = await axios(`${rootUrl}/users/${user}/gists`).catch(
        (err) => {
          if (err.response.status === 403)
            setErrorMessage("API rate limit exceeded. Try after sometime");
        }
      );

      if (response) {
        let gists = response.data;
        setGists(gists);
        let gistsCount = gists.length;
        if (gists.length > 0) {
          const UserInfo = [];
          let avatar_img = gists[0].owner.avatar_url;
          let login = gists[0].owner.login;
          UserInfo.push(avatar_img, login, gistsCount);
          setGistUserInfo(UserInfo);
          gists.map((files, index) => {
            const gist_id = files.id;
            Promise.allSettled([axios(`${rootUrl}/gists/${gist_id}/forks`)])
              .then((results) => {
                let forkObj = {};
                if (results[0].value.data.length > 0) {
                  forkObj[gist_id] = results[0].value.data;
                  setForks(forkObj);
                }
              })
              .catch((err) => console.log(err));
          });
        }
      } else {
        console.log(true, "There is no user with that username");
      }
    }
  };
  const LoadMore = () => {
    if (gistNumber <= gists.length) {
      setGistNumber((prevValue) => prevValue + 6);
    } else {
      setIsloadMore(false);
    }
  };
  return (
    <div className="main-container">
      <Search searchGistsOfUser={searchGistsOfUser} />
      {gists.length > 0 && (
        <div className="user-info">
          <div>
            <img alt="avatar-img" src={gistUserInfo[0]}></img>
            <p className="user-name">{gistUserInfo[1]}</p>
          </div>
          <div>
            <svg
              className="gist-svg"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path d="M1.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25H1.75zM0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0114.25 16H1.75A1.75 1.75 0 010 14.25V1.75zm9.22 3.72a.75.75 0 000 1.06L10.69 8 9.22 9.47a.75.75 0 101.06 1.06l2-2a.75.75 0 000-1.06l-2-2a.75.75 0 00-1.06 0zM6.78 6.53a.75.75 0 00-1.06-1.06l-2 2a.75.75 0 000 1.06l2 2a.75.75 0 101.06-1.06L5.31 8l1.47-1.47z"></path>
            </svg>

            <p className="gist-count"> Public Gists : {gistUserInfo[2]}</p>
          </div>
        </div>
      )}
      {gists && (
        <div className="gist-list-container">
          {gists.slice(0, gistNumber).map((list) => (
            <GistList
              {...list}
              key={list.id}
              gistId={list.id}
              user={gistUserInfo[1]}
              forks={forks}
            />
          ))}
        </div>
      )}
      {gists.length > 0 ? (
        <div className="load-btn">
          <button
            onClick={LoadMore}
            className={isloadMore ? "load-more" : "all-loaded"}
          >
            {isloadMore ? "Load More" : "Thats all folks"}
          </button>
        </div>
      ) : (
        <div>
          <p className="no-users">
            {user ? "There is no user with that username" : ""}
            {errorMessage ? errorMessage : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default Main;
