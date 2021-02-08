import React, { useState } from "react";
import "./search.scss";

const Search = (props) => {
  let searchUser = "";
  const [user, setUser] = useState(""); //prof3ssorSt3v3
  const onChangeHandler = (e) => {
    setUser(e.target.value);
    searchUser = e.target.value;
  };
  const keyPress = (e) => {
    if (e.keyCode === 13) {
      props.searchGistsOfUser(`${user}`);
    }
  };
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search..."
        value={user}
        onChange={(e) => onChangeHandler(e)}
        onKeyDown={(e) => keyPress(e)}
      ></input>

      <button onClick={() => props.searchGistsOfUser(`${user}`)}>Search</button>
    </div>
  );
};

export default Search;
