import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CircularProgress from "@material-ui/core/CircularProgress";

function Wait(m1) {
  if (m1 > 0) {
    return new Promise((resolve) => setTimeout(resolve, m1));
  }
}

function App() {
  const inputRef = React.useRef(null);

  // input state
  const [searchText, setSearchText] = React.useState("");

  // state of api results { results: [...items]}
  const [datalistItems, setDatalistItems] = React.useState([]);

  // state of selected items
  const [selectedItems, setSelectedItems] = React.useState([]);

  // loading state
  const [isLoading, setLoading] = React.useState(false);

  const [alert, setAlert] = React.useState(false);

  const handleCloseAlert = () => {
    setAlert(false);
  };

  /*
  React.useEffect(() => {
    setLoading(true);
    fetch("https://randomuser.me/api/?nat=us,gb&results=10")
      .then((response) => response.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setDatalistItems([...datalistItems, ...data.results]);
        }
      })
      .catch(() => {
        setDatalistItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); */

  const handleSearch = (inputValue) => {
    setAlert(false);
    if (inputValue) {
      const isSelectedItem = findAndSelectItem(inputValue);

      if (isSelectedItem === true) {
        setSearchText("");
      } else {
        Wait(300).then(() => {
          if (inputValue === inputRef.current.value) {
            setLoading(true);
            fetch(`https://randomuser.me/api/?nat=us,gb&q=${inputValue}`)
              .then((response) => response.json())
              .then((data) => {
                if (data.results && data.results.length > 0) {
                  setDatalistItems([...datalistItems, ...data.results]);
                }
              })
              .catch(() => {
                setDatalistItems([]);
              })
              .finally(() => {
                setLoading(false);
              });
          }
        });

        setSearchText(inputValue);
      }
    } else {
      setSearchText(inputValue);
    }
  };

  const handleKeyUp = (e) => {
    setAlert(false);
    if (e.key === "Enter") {
      const isSelectedItem = findAndSelectItem(searchText);

      if (isSelectedItem === true) {
        setSearchText("");
      }
    }
  };

  const formatName = (item) => {
    return `${item.name.title || ""} ${item.name.first || ""} ${
      item.name.last || ""
    }`.trim();
  };

  const findAndSelectItem = (name) => {
    setAlert(false);
    if (name) {
      const existsItem = datalistItems.find(
        (item) => name.toLowerCase() === formatName(item).toLowerCase()
      );

      if (
        existsItem &&
        !selectedItems.some(
          (item) => name.toLowerCase() === formatName(item).toLowerCase()
        )
      ) {
        setSelectedItems([...selectedItems, existsItem]);
        return true;
      }
    }
  };

  const handleDelete = (idx) => {
    selectedItems.splice(idx, 1);
    setSelectedItems([...selectedItems]);
    setAlert(true);
  };

  return (
    <Grid container style={{ width: 1024, margin: "0 auto" }}>
      <Grid item xs={12}>
        <h2>Welcome to our system</h2>
      </Grid>

      <Grid item xs={12}>
        {alert ? (
          <div
            style={{
              backgroundColor: "#87e8b1",
              padding: "15px",
              borderRadius: 10,
            }}
          >
            User deleted!
          </div>
        ) : null}
        <h4>Please focus on input and select an user</h4>
        <label htmlFor="user">
          <h5>Users: </h5>
        </label>
        <input
          style={{ padding: "10px" }}
          ref={inputRef}
          value={searchText}
          onKeyUp={(e) => handleKeyUp(e)}
          onChange={(e) => handleSearch(e.target.value)}
          list="users"
          name="user"
          id="user"
        />
      </Grid>

      <Grid item xs={12}>
        {isLoading && <CircularProgress />}
      </Grid>

      <Grid item xs={12}>
        <datalist id="users">
          {datalistItems.map((item, idx) => {
            return <option key={idx} value={formatName(item)} />;
          })}
        </datalist>
      </Grid>

      <Grid item xs={12}>
        <h4>Selected Users</h4>
      </Grid>

      <ul>
        {selectedItems.map((item, idx) => {
          return (
            <li key={idx}>
              {formatName(item)}{" "}
              <IconButton
                aria-label="delete"
                onClick={(e) => handleDelete(idx)}
              >
                <DeleteIcon />
              </IconButton>
            </li>
          );
        })}
        {selectedItems.length === 0 && <p></p>}
      </ul>
    </Grid>
  );
}

export default App;
